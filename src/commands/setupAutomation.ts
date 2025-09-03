import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TEXTS, buildText } from '../constants/texts';
import { ProjectData, AngularAssistSettings, AngularJson, TasksJson, LaunchJson, VSCodeKeybinding } from '../types';

export async function setupAutomation(context: vscode.ExtensionContext): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage(TEXTS.ERRORS.NO_WORKSPACE);
        return;
    }

    try {
        // Coleta informações sobre o projeto
        const projectData = await collectProjectData();
        if (!projectData) return;

        // Criar arquivos de configuração
        await createConfigFiles(workspaceFolder.uri.fsPath, projectData, context);

        vscode.window.showInformationMessage(
            buildText.setupComplete(projectData.projectName)
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Erro: ${errorMessage}`);
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

    // Obter o caminho do projeto atual
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage(TEXTS.ERRORS.NO_WORKSPACE);
        return undefined;
    }

    // Tentar ler o baseHref do angular.json
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
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (!fs.existsSync(angularJsonPath)) {
        return null;
    }

    try {
        const angularJsonContent = fs.readFileSync(angularJsonPath, 'utf8');
        const angularJson: AngularJson = JSON.parse(angularJsonContent);
        
        // Procurar o primeiro projeto no angular.json
        const projects = angularJson.projects;
        if (!projects) {
            return null;
        }

        // Pegar o primeiro projeto disponível
        const firstProjectKey = Object.keys(projects)[0];
        if (!firstProjectKey) {
            return null;
        }

        const project = projects[firstProjectKey];
        
        // Verificar nas configurações de build
        const buildConfig = project?.architect?.build?.options;
        if (buildConfig && buildConfig.baseHref) {
            return normalizeRoute(buildConfig.baseHref);
        }

        // Verificar nas configurações de serve
        const serveConfig = project?.architect?.serve?.options;
        if (serveConfig && serveConfig.baseHref) {
            return normalizeRoute(serveConfig.baseHref);
        }

        // Verificar em configurações de produção
        const prodConfig = project?.architect?.build?.configurations?.production;
        if (prodConfig && prodConfig.baseHref) {
            return normalizeRoute(prodConfig.baseHref);
        }

    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`${TEXTS.ERRORS.READING_ANGULAR_JSON}`, error);
    }

    return null;
}

function normalizeRoute(route: string): string {
    if (!route) return route;
    
    // Remove barra final se existir, mas mantém se for apenas "/"
    if (route.length > 1 && route.endsWith('/')) {
        return route.slice(0, -1);
    }
    
    return route;
}

async function createConfigFiles(workspacePath: string, data: ProjectData, context: vscode.ExtensionContext): Promise<void> {
    const vscodeDir = path.join(workspacePath, '.vscode');
    
    // Criar diretório .vscode se não existir
    if (!fs.existsSync(vscodeDir)) {
        fs.mkdirSync(vscodeDir, { recursive: true });
    }
    
    // Criar diretório global para scripts da extensão (fora do projeto)
    const globalStoragePath = context.globalStorageUri.fsPath;
    const angularAssistGlobalDir = path.join(globalStoragePath, 'angular-assist-automation');
    if (!fs.existsSync(angularAssistGlobalDir)) {
        fs.mkdirSync(angularAssistGlobalDir, { recursive: true });
    }
    
    // Criar diretório para scripts compartilhados globalmente
    const globalScriptsDir = path.join(angularAssistGlobalDir, 'scripts');
    if (!fs.existsSync(globalScriptsDir)) {
        fs.mkdirSync(globalScriptsDir, { recursive: true });
    }

    // Carregar templates do contexto da extensão
    const templatesPath = path.join(context.extensionPath, 'src', 'templates');
    
    // Criar ou atualizar settings.json com as configurações específicas do projeto
    await updateSettingsFile(path.join(vscodeDir, 'settings.json'), data, globalScriptsDir);
    
    // Criar tasks.json
    await createFileFromTemplate(
        path.join(templatesPath, 'tasks.json'),
        path.join(vscodeDir, 'tasks.json'),
        data,
        globalScriptsDir
    );

    // Criar launch.json
    await createFileFromTemplate(
        path.join(templatesPath, 'launch.json'),
        path.join(vscodeDir, 'launch.json'),
        data,
        globalScriptsDir
    );

    // Criar keybindings.json
    await createFileFromTemplate(
        path.join(templatesPath, 'keybindings.json'),
        path.join(vscodeDir, 'keybindings.json'),
        data,
        globalScriptsDir
    );

    // Copiar scripts PowerShell para o diretório global compartilhado (apenas uma vez)
    const scriptsTemplatePath = path.join(templatesPath, 'scripts');
    await copyScripts(scriptsTemplatePath, globalScriptsDir);
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
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`${TEXTS.ERRORS.READING_SETTINGS_JSON}`, error);
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
    const scriptFiles = [
        TEXTS.SCRIPT_FILES.START_VSCODE,
        TEXTS.SCRIPT_FILES.START_PROJECT,
        TEXTS.SCRIPT_FILES.RESTART_PROJECT,
        TEXTS.SCRIPT_FILES.STOP_ALL_PROCESSES,
        TEXTS.SCRIPT_FILES.CLEAN_CHROME
    ];

    for (const scriptFile of scriptFiles) {
        const sourcePath = path.join(scriptsPath, scriptFile);
        const destPath = path.join(destDir, scriptFile);
        
        // Copia o arquivo se não existir no destino
        if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
            fs.copyFileSync(sourcePath, destPath);
        }
    }
}

async function createFileFromTemplate(templatePath: string, destPath: string, data: ProjectData, globalScriptsDir?: string): Promise<void> {
    if (!fs.existsSync(templatePath)) {
        // eslint-disable-next-line no-console
        console.error(`${TEXTS.ERRORS.TEMPLATE_NOT_FOUND} ${templatePath}`);
        return;
    }

    // Ler o conteúdo do template
    let content = fs.readFileSync(templatePath, 'utf8');

    // Substituir as variáveis no template
    content = content
        .replace(/\[NOME_PROJETO\]/g, data.projectName)
        .replace(/\[PORTA\]/g, data.port)
        .replace(/\[PORTA_DEBUG\]/g, data.debugPort)
        .replace(/\[ROTA_APLICACAO\]/g, data.route);

    // Se for um arquivo que usa scripts, substituir o caminho dos scripts pelo caminho global
    if (globalScriptsDir && (destPath.endsWith('tasks.json') || destPath.endsWith('launch.json'))) {
        // Substituir referências ao caminho dos scripts para usar o caminho global
        const normalizedGlobalPath = globalScriptsDir.replace(/\\/g, '\\\\');
        content = content.replace(
            /\$\{workspaceFolder\}\\\.vscode\\angular-assist-automation\\scripts\\/g, 
            `"${normalizedGlobalPath}\\`
        );
    }

    // Verificar se o arquivo já existe
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
            } else if (destPath.endsWith('launch.json')) {
                // Mescla configurações de lançamento (launch.json)
                const launchJson = updatedJson as LaunchJson;
                if (!launchJson.configurations) launchJson.configurations = [];
                
                // Remover configurações existentes do projeto Angular Assist
                launchJson.configurations = launchJson.configurations.filter(config => 
                    !config.name.includes(data.projectName)
                );
                
                // Adicionar novas configurações
                const newLaunchJson = newJson as LaunchJson;
                launchJson.configurations = [...launchJson.configurations, ...newLaunchJson.configurations];
                updatedJson = launchJson;
            } else if (destPath.endsWith('keybindings.json')) {
                // Para keybindings.json, simplesmente adicionar as novas sem remover existentes
                const mergedJson = Array.isArray(existingJson) ? [...existingJson] : [];
                
                // Filtrar para remover keybindings duplicados
                const existingKeys = new Set(mergedJson.map((key: VSCodeKeybinding) => key.command));
                const newKeybindings = (newJson as VSCodeKeybinding[]).filter((key: VSCodeKeybinding) => !existingKeys.has(key.command));
                
                updatedJson = [...mergedJson, ...newKeybindings];
            }

            // Escrever o arquivo JSON atualizado
            fs.writeFileSync(destPath, JSON.stringify(updatedJson, null, 2), 'utf8');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`${TEXTS.ERRORS.FILE_MERGE_ERROR} ${destPath}:`, error);
            // Fallback: criar o arquivo como novo
            fs.writeFileSync(destPath, content, 'utf8');
        }
    } else {
        // Criar o arquivo normalmente se não existir
        fs.writeFileSync(destPath, content, 'utf8');
    }
}
