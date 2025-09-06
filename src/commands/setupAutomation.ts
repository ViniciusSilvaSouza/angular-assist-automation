import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TEXTS, buildText, getLocale } from '../constants/texts';
import { ProjectData, AngularAssistSettings, AngularJson, TasksJson, LaunchJson, VSCodeKeybinding } from '../types';

export async function setupAutomation(context: vscode.ExtensionContext): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        const errorMsg = TEXTS.ERRORS.NO_WORKSPACE;
        vscode.window.showErrorMessage(errorMsg);
        return;
    }

    try {
        const projectData = await collectProjectData();
        if (!projectData) {
            vscode.window.showWarningMessage(TEXTS.MESSAGES.SETUP_CANCELLED_BY_USER || 'Configuração cancelada pelo usuário.');
            return;
        }

        await createConfigFiles(workspaceFolder.uri.fsPath, projectData, context);

        const verificationResult = await verifyCreatedFiles(workspaceFolder.uri.fsPath, projectData);

        if (verificationResult.success) {
            const successMsg = buildText.setupComplete(projectData.projectName);
            vscode.window.showInformationMessage(
                `${successMsg}\n\n🔍 Verificar:\n• Painel "Run and Debug" (Ctrl+Shift+D)\n• Tarefas no Terminal (Ctrl+Shift+P > Tasks)\n• Configuração criada: ${verificationResult.debugConfigName}`
            );

            const reloadChoice = await vscode.window.showInformationMessage(
                'Para garantir que todas as configurações sejam aplicadas, recomenda-se recarregar a janela.',
                'Recarregar Janela',
                'Mais Tarde'
            );

            if (reloadChoice === 'Recarregar Janela') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        } else {
            vscode.window.showErrorMessage(`Configuração parcial. Problemas encontrados:\n${verificationResult.errors.join('\n')}`);
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Erro crítico durante configuração:\n${errorMessage}`);
    }
}

async function collectProjectData(): Promise<ProjectData | undefined> {
    const projectName = await vscode.window.showInputBox({
        prompt: TEXTS.PROMPTS.PROJECT_NAME.prompt,
        placeHolder: TEXTS.PROMPTS.PROJECT_NAME.placeholder
    });

    if (!projectName) return undefined;

    const port = await vscode.window.showInputBox({
        prompt: TEXTS.PROMPTS.SERVER_PORT.prompt,
        value: TEXTS.PROMPTS.SERVER_PORT.defaultValue
    });

    if (!port) return undefined;

    const debugPort = await vscode.window.showInputBox({
        prompt: TEXTS.PROMPTS.DEBUG_PORT.prompt,
        value: TEXTS.PROMPTS.DEBUG_PORT.defaultValue
    });

    if (!debugPort) return undefined;

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage(TEXTS.ERRORS.NO_WORKSPACE);
        return undefined;
    }

    const defaultRoute = await getBaseHrefFromAngularJson(workspaceFolder.uri.fsPath);

    const route = await vscode.window.showInputBox({
        prompt: TEXTS.PROMPTS.APPLICATION_ROUTE.prompt,
        value: defaultRoute || TEXTS.PROMPTS.APPLICATION_ROUTE.defaultValue
    });

    if (route === undefined) return undefined;

    return {
        projectName,
        port,
        debugPort,
        route,
        projectPath: workspaceFolder.uri.fsPath
    };
}

async function getBaseHrefFromAngularJson(projectPath: string): Promise<string | null> {
    const angularJsonPath = path.join(projectPath, TEXTS.DETECTION.ANGULAR_JSON_FILENAME);
    
    if (!fs.existsSync(angularJsonPath)) {
        return null;
    }

    try {
        const angularJsonContent = fs.readFileSync(angularJsonPath, 'utf8');
        const angularJson: AngularJson = JSON.parse(angularJsonContent);
        
        const projects = angularJson.projects;
        if (!projects) {
            return null;
        }

        const firstProjectKey = Object.keys(projects)[0];
        if (!firstProjectKey) {
            return null;
        }

        const project = projects[firstProjectKey];
        
        const buildConfig = project?.architect?.build?.options;
        if (buildConfig && buildConfig.baseHref) {
            return normalizeRoute(buildConfig.baseHref);
        }

        const serveConfig = project?.architect?.serve?.options;
        if (serveConfig && serveConfig.baseHref) {
            return normalizeRoute(serveConfig.baseHref);
        }

        const prodConfig = project?.architect?.build?.configurations?.production;
        if (prodConfig && prodConfig.baseHref) {
            return normalizeRoute(prodConfig.baseHref);
        }

    } catch {
        // ignore and fallback to defaults
    }

    return null;
}

function normalizeRoute(route: string): string {
    if (!route) return route;
    
    if (route.length > 1 && route.endsWith('/')) {
        return route.slice(0, -1);
    }
    
    return route;
}

async function createConfigFiles(workspacePath: string, data: ProjectData, context: vscode.ExtensionContext): Promise<void> {
    // creating configuration files for the project
    const vscodeDir = path.join(workspacePath, TEXTS.DETECTION.VSCODE_FOLDER);
    if (!fs.existsSync(vscodeDir)) {
        try {
            fs.mkdirSync(vscodeDir, { recursive: true });
        } catch {
            throw new Error(TEXTS.ERRORS.CANNOT_CREATE_VSCODE_DIR || 'Cannot create .vscode directory');
        }
    }
    
    // Criar diretório global para scripts da extensão (fora do projeto)
    const globalStoragePath = context.globalStorageUri.fsPath;
    // prepare global storage for extension
    const angularAssistGlobalDir = path.join(globalStoragePath, 'angular-assist-automation');
    if (!fs.existsSync(angularAssistGlobalDir)) {
        try {
            fs.mkdirSync(angularAssistGlobalDir, { recursive: true });
        } catch {
            throw new Error(TEXTS.ERRORS.CANNOT_CREATE_GLOBAL_DIR || 'Cannot create global directory');
        }
    }
    
    // Criar diretório para scripts compartilhados globalmente
    const globalScriptsDir = path.join(angularAssistGlobalDir, 'scripts');
    if (!fs.existsSync(globalScriptsDir)) {
        try {
            fs.mkdirSync(globalScriptsDir, { recursive: true });
        } catch {
            throw new Error(TEXTS.ERRORS.CANNOT_CREATE_GLOBAL_DIR || 'Cannot create global scripts directory');
        }
    }

    // Carregar templates do contexto da extensão
    const templatesPath = path.join(context.extensionPath, 'templates');
    if (!fs.existsSync(templatesPath)) {
        throw new Error(`${TEXTS.ERRORS.TEMPLATE_NOT_FOUND} ${templatesPath}`);
    }
    
    try {
        // Criar ou atualizar settings.json com as configurações específicas do projeto
    // create or update settings.json
        await updateSettingsFile(path.join(vscodeDir, TEXTS.CONFIG_FILES.SETTINGS), data, globalScriptsDir);
        
        // Criar tasks.json
    // create tasks.json
        await createFileFromTemplate(
            path.join(templatesPath, TEXTS.CONFIG_FILES.TASKS),
            path.join(vscodeDir, TEXTS.CONFIG_FILES.TASKS),
            data,
            globalScriptsDir
        );

        // Criar launch.json
    // create launch.json
        await createFileFromTemplate(
            path.join(templatesPath, TEXTS.CONFIG_FILES.LAUNCH),
            path.join(vscodeDir, TEXTS.CONFIG_FILES.LAUNCH),
            data,
            globalScriptsDir
        );

        // Criar keybindings.json
    // create keybindings.json
        await createFileFromTemplate(
            path.join(templatesPath, TEXTS.CONFIG_FILES.KEYBINDINGS),
            path.join(vscodeDir, TEXTS.CONFIG_FILES.KEYBINDINGS),
            data,
            globalScriptsDir
        );

    // Copiar scripts PowerShell para o diretório global compartilhado (apenas uma vez)
    const scriptsTemplatePath = path.join(templatesPath, 'scripts');
    await copyScripts(scriptsTemplatePath, globalScriptsDir);
    } catch {
        throw new Error(TEXTS.ERRORS.SETUP_FAILED || 'Setup failed');
    }
}

interface VerificationResult {
    success: boolean;
    filesCreated: string[];
    missingFiles: string[];
    errors: string[];
    debugConfigFound: boolean;
    debugConfigName?: string;
}

async function verifyCreatedFiles(workspacePath: string, data: ProjectData): Promise<VerificationResult> {
    const result: VerificationResult = {
        success: true,
        filesCreated: [],
        missingFiles: [],
        errors: [],
        debugConfigFound: false
    };

    const vscodeDir = path.join(workspacePath, TEXTS.DETECTION.VSCODE_FOLDER);
    const expectedFiles = [
        TEXTS.CONFIG_FILES.SETTINGS,
        TEXTS.CONFIG_FILES.TASKS, 
        TEXTS.CONFIG_FILES.LAUNCH,
        TEXTS.CONFIG_FILES.KEYBINDINGS
    ];

    // Verificar se cada arquivo foi criado
    for (const fileName of expectedFiles) {
        const filePath = path.join(vscodeDir, fileName);
        if (fs.existsSync(filePath)) {
            result.filesCreated.push(fileName);
            
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                
                if (fileName === TEXTS.CONFIG_FILES.LAUNCH) {
                    const launchConfig = JSON.parse(content);
                    const hasDebugConfig = launchConfig.configurations && 
                        launchConfig.configurations.some((config: {name: string}) => 
                            config.name.includes(data.projectName) && config.name.includes('Chrome Debug')
                        );
                    
                    if (hasDebugConfig) {
                        result.debugConfigFound = true;
                        const debugConfig = launchConfig.configurations.find((config: {name: string}) => 
                            config.name.includes(data.projectName) && config.name.includes('Chrome Debug')
                        );
                        result.debugConfigName = debugConfig?.name;
                        
                    } else {
                        result.errors.push(`launch.json não contém configuração de debug para ${data.projectName}`);
                        
                    }
                } else if (fileName === TEXTS.CONFIG_FILES.SETTINGS) {
                    const settings = JSON.parse(content);
                    const hasAngularAssistConfig = settings['angular-assist.automation'] && 
                        settings['angular-assist.automation'][data.projectName];
                    
                    if (!hasAngularAssistConfig) {
                        result.errors.push(`settings.json não contém configuração Angular Assist para ${data.projectName}`);
                        
                    } else {
                        
                    }
                } else if (fileName === TEXTS.CONFIG_FILES.TASKS) {
                    const tasksConfig = JSON.parse(content);
                    const hasAngularAssistTasks = tasksConfig.tasks && 
                        tasksConfig.tasks.some((task: {label: string}) => 
                            task.label.includes(data.projectName) && task.label.includes('Angular Assist')
                        );
                    
                    if (!hasAngularAssistTasks) {
                        result.errors.push(`tasks.json não contém tarefas Angular Assist para ${data.projectName}`);
                        
                    } else {
                        // calculate task count if needed later
                    }
                }
            } catch (parseError) {
                result.errors.push(`Erro ao analisar ${fileName}: ${parseError}`);
                
            }
        } else {
            result.missingFiles.push(fileName);
            result.errors.push(`Arquivo ${fileName} não foi criado`);
            
        }
    }

    result.success = result.missingFiles.length === 0 && result.errors.length === 0;
    
    // verification summary is returned to caller

    return result;
}

async function updateSettingsFile(settingsPath: string, data: ProjectData, globalScriptsDir: string): Promise<void> {
    // Configurações específicas do projeto Angular Assist
    const newSettings: AngularAssistSettings = {
        "angular-assist.automation": {
            [data.projectName]: {
                "projectName": data.projectName,
                "port": data.port,
                "debugPort": data.debugPort,
                "route": data.route,
                "workspacePath": data.projectPath,
                "globalScriptsPath": globalScriptsDir
            }
        }
    };
    
    let existingSettings: AngularAssistSettings = {};
    
    // Verificar se já existe um arquivo settings.json
    if (fs.existsSync(settingsPath)) {
        try {
            existingSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        } catch {
            // ignore
        }
    }
    
    // Mesclar configurações existentes com as novas
    const updatedSettings = { ...existingSettings, ...newSettings };
    
    // Se já houver configurações angular-assist.automation, mesclar em vez de substituir
    if (existingSettings["angular-assist.automation"]) {
        updatedSettings["angular-assist.automation"] = { 
            ...existingSettings["angular-assist.automation"], 
            ...newSettings["angular-assist.automation"] 
        };
    }
    
    // Salvar arquivo atualizado
    fs.writeFileSync(settingsPath, JSON.stringify(updatedSettings, null, 2), 'utf8');
}

async function copyScripts(scriptsPath: string, destDir: string): Promise<void> {
    const locale = getLocale();
    const localeScriptsPath = path.join(scriptsPath, locale);
    const basePath = fs.existsSync(localeScriptsPath) ? localeScriptsPath : scriptsPath;

    const scriptFiles = [
        TEXTS.SCRIPT_FILES.START_VSCODE,
        TEXTS.SCRIPT_FILES.START_PROJECT,
        TEXTS.SCRIPT_FILES.RESTART_PROJECT,
        TEXTS.SCRIPT_FILES.STOP_ALL_PROCESSES,
        TEXTS.SCRIPT_FILES.CLEAN_CHROME
    ];

    for (const scriptFile of scriptFiles) {
        const sourcePath = path.join(basePath, scriptFile);
        const destPath = path.join(destDir, scriptFile);
        
        if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
            fs.copyFileSync(sourcePath, destPath);
        }
    }
}

async function createFileFromTemplate(templatePath: string, destPath: string, data: ProjectData, globalScriptsDir?: string): Promise<void> {
    if (!fs.existsSync(templatePath)) {
        throw new Error(`${TEXTS.ERRORS.TEMPLATE_NOT_FOUND} ${templatePath}`);
    }

    let content = fs.readFileSync(templatePath, 'utf8');

    content = content
        .replace(/\[NOME_PROJETO\]/g, data.projectName)
        .replace(/\[PORTA\]/g, data.port)
        .replace(/\[PORTA_DEBUG\]/g, data.debugPort)
        .replace(/\[ROTA_APLICACAO\]/g, data.route);

    if (destPath.endsWith('.json')) {
        try {
            JSON.parse(content);
        } catch {
            return;
        }
    }

    if (globalScriptsDir && (destPath.endsWith('tasks.json') || destPath.endsWith('launch.json'))) {
        const normalizedGlobalPath = globalScriptsDir.replace(/\\/g, '\\\\');
        content = content.replace(
            /\$\{workspaceFolder\}\\\.vscode\\angular-assist-automation\\scripts\\/g, 
            `"${normalizedGlobalPath}\\`
        );
    }

    const fileExists = fs.existsSync(destPath);
    
    // Se for um arquivo tasks.json, launch.json ou keybindings.json que já existe,
    // precisamos mesclá-lo em vez de substituí-lo
    if (fileExists && (destPath.endsWith('tasks.json') || destPath.endsWith('launch.json') || destPath.endsWith('keybindings.json'))) {
    try {
            const existingContent = fs.readFileSync(destPath, 'utf8');
            const existingJson = JSON.parse(existingContent);
            const newJson = JSON.parse(content);

            // Mesclar os arquivos JSON
            let updatedJson: unknown = {...existingJson};

            if (destPath.endsWith('tasks.json')) {
                // Mescla tarefas (tasks.json)
                const tasksJson = updatedJson as TasksJson;
                if (!tasksJson.tasks) tasksJson.tasks = [];
                
                // Remover tarefas existentes do projeto Angular Assist
                tasksJson.tasks = tasksJson.tasks.filter(task => 
                    !task.label.includes('Angular Assist') &&
                    !task.label.includes(data.projectName)
                );
                
                // Adicionar novas tarefas
                const newTasksJson = newJson as TasksJson;
                tasksJson.tasks = [...tasksJson.tasks, ...newTasksJson.tasks];
                updatedJson = tasksJson;
                
                // tasks merged
            } else if (destPath.endsWith('launch.json')) {
                // Mescla configurações de lançamento (launch.json)
                const launchJson = updatedJson as LaunchJson;
                if (!launchJson.configurations) launchJson.configurations = [];
                
                // Remover configurações existentes do projeto Angular Assist
                launchJson.configurations = launchJson.configurations.filter(config => 
                    !config.name.includes(data.projectName) &&
                    !config.name.includes('Chrome Debug')
                );
                
                const newLaunchJson = newJson as LaunchJson;
                launchJson.configurations = [...launchJson.configurations, ...newLaunchJson.configurations];
                updatedJson = launchJson;
                
                // launch configs merged
            } else if (destPath.endsWith('keybindings.json')) {
                // Para keybindings.json, simplesmente adicionar as novas sem remover existentes
                const mergedJson = Array.isArray(existingJson) ? [...existingJson] : [];
                
                const existingKeys = new Set(mergedJson.map((key: VSCodeKeybinding) => key.command));
                const newKeybindings = (newJson as VSCodeKeybinding[]).filter((key: VSCodeKeybinding) => !existingKeys.has(key.command));
                
                updatedJson = [...mergedJson, ...newKeybindings];
                
                // keybindings merged
            }

            // Validar JSON final antes de escrever
            const finalContent = JSON.stringify(updatedJson, null, 2);
            JSON.parse(finalContent); // Validação

            // Escrever o arquivo JSON atualizado
            fs.writeFileSync(destPath, finalContent, 'utf8');
        } catch {
            // Fallback: criar o arquivo como novo
            fs.writeFileSync(destPath, content, 'utf8');
        }
    } else {
        // Criar o arquivo normalmente se não existir
        fs.writeFileSync(destPath, content, 'utf8');
    }
}
