import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TEXTS, buildText, getLocale } from '../constants/texts';
import { ProjectData, AngularAssistSettings, AngularJson, TasksJson, LaunchJson, VSCodeKeybinding } from '../types';

export async function setupAutomation(context: vscode.ExtensionContext): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('🚀 === INICIANDO SETUP ANGULAR ASSIST ===');
    
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        const errorMsg = TEXTS.ERRORS.NO_WORKSPACE;
        // eslint-disable-next-line no-console
        console.error('❌ ERRO:', errorMsg);
        vscode.window.showErrorMessage(errorMsg);
        return;
    }

    // eslint-disable-next-line no-console
    console.log('📁 Workspace encontrado:', workspaceFolder.uri.fsPath);

    try {
        // Coleta informações sobre o projeto
        // eslint-disable-next-line no-console
        console.log('📝 === COLETANDO DADOS DO PROJETO ===');
        const projectData = await collectProjectData();
        if (!projectData) {
            // eslint-disable-next-line no-console
            console.log('❌ Coleta de dados cancelada pelo usuário');
            vscode.window.showWarningMessage('Configuração cancelada pelo usuário.');
            return;
        }

        // eslint-disable-next-line no-console
        console.log('✅ Dados coletados com sucesso:', JSON.stringify(projectData, null, 2));

        // Criar arquivos de configuração
        // eslint-disable-next-line no-console
        console.log('🔧 === CRIANDO ARQUIVOS DE CONFIGURAÇÃO ===');
        await createConfigFiles(workspaceFolder.uri.fsPath, projectData, context);

        // Verificar se os arquivos foram criados corretamente
        // eslint-disable-next-line no-console
        console.log('🔍 === VERIFICANDO ARQUIVOS CRIADOS ===');
        const verificationResult = await verifyCreatedFiles(workspaceFolder.uri.fsPath, projectData);
        
        if (verificationResult.success) {
            // eslint-disable-next-line no-console
            console.log('✅ === CONFIGURAÇÃO CONCLUÍDA COM SUCESSO! ===');
            // eslint-disable-next-line no-console
            console.log('📋 Arquivos criados:', verificationResult.filesCreated);
            // eslint-disable-next-line no-console
            console.log('🎯 Debug config encontrada:', verificationResult.debugConfigFound);
            
            const successMsg = buildText.setupComplete(projectData.projectName);
            vscode.window.showInformationMessage(
                `${successMsg}\n\n🔍 Verificar:\n• Painel "Run and Debug" (Ctrl+Shift+D)\n• Tarefas no Terminal (Ctrl+Shift+P > Tasks)\n• Configuração criada: ${verificationResult.debugConfigName}`
            );
            
            // Sugerir recarregar a janela para garantir que as configurações sejam aplicadas
            const reloadChoice = await vscode.window.showInformationMessage(
                'Para garantir que todas as configurações sejam aplicadas, recomenda-se recarregar a janela.',
                'Recarregar Janela',
                'Mais Tarde'
            );
            
            if (reloadChoice === 'Recarregar Janela') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        } else {
            // eslint-disable-next-line no-console
            console.error('❌ === PROBLEMAS NA VERIFICAÇÃO ===');
            // eslint-disable-next-line no-console
            console.error('🚫 Arquivos faltando:', verificationResult.missingFiles);
            // eslint-disable-next-line no-console
            console.error('⚠️ Erros encontrados:', verificationResult.errors);
            
            vscode.window.showErrorMessage(
                `Configuração parcial. Problemas encontrados:\n${verificationResult.errors.join('\n')}\n\nVerifique o Developer Console (Ctrl+Shift+I) para mais detalhes.`
            );
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        // eslint-disable-next-line no-console
        console.error('❌ === ERRO CRÍTICO DURANTE SETUP ===');
        // eslint-disable-next-line no-console
        console.error('💥 Detalhes do erro:', error);
        // eslint-disable-next-line no-console
        console.error('📍 Stack trace:', error instanceof Error ? error.stack : 'N/A');
        
        vscode.window.showErrorMessage(
            `Erro crítico durante configuração:\n${errorMessage}\n\nVerifique o Developer Console (Ctrl+Shift+I) para mais detalhes.`
        );
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
    const angularJsonPath = path.join(projectPath, TEXTS.DETECTION.ANGULAR_JSON_FILENAME);
    
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
    // eslint-disable-next-line no-console
    console.log('📂 === CRIANDO ARQUIVOS DE CONFIGURAÇÃO ===');
    // eslint-disable-next-line no-console
    console.log('📂 Workspace:', workspacePath);
    // eslint-disable-next-line no-console
    console.log('📊 Dados do projeto:', JSON.stringify(data, null, 2));
    
    const vscodeDir = path.join(workspacePath, TEXTS.DETECTION.VSCODE_FOLDER);
    
    // eslint-disable-next-line no-console
    console.log('📁 Diretório .vscode:', vscodeDir);
    
    // Criar diretório .vscode se não existir
    if (!fs.existsSync(vscodeDir)) {
        // eslint-disable-next-line no-console
        console.log('📁 Criando diretório .vscode...');
        try {
            fs.mkdirSync(vscodeDir, { recursive: true });
            // eslint-disable-next-line no-console
            console.log('✅ Diretório .vscode criado com sucesso');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('❌ Erro ao criar diretório .vscode:', error);
            throw error;
        }
    } else {
        // eslint-disable-next-line no-console
        console.log('📁 Diretório .vscode já existe');
    }
    
    // Criar diretório global para scripts da extensão (fora do projeto)
    const globalStoragePath = context.globalStorageUri.fsPath;
    // eslint-disable-next-line no-console
    console.log('🌐 Global storage path:', globalStoragePath);
    
    const angularAssistGlobalDir = path.join(globalStoragePath, 'angular-assist-automation');
    if (!fs.existsSync(angularAssistGlobalDir)) {
        // eslint-disable-next-line no-console
        console.log('📁 Criando diretório global Angular Assist...');
        try {
            fs.mkdirSync(angularAssistGlobalDir, { recursive: true });
            // eslint-disable-next-line no-console
            console.log('✅ Diretório global Angular Assist criado');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('❌ Erro ao criar diretório global:', error);
            throw error;
        }
    }
    
    // Criar diretório para scripts compartilhados globalmente
    const globalScriptsDir = path.join(angularAssistGlobalDir, 'scripts');
    if (!fs.existsSync(globalScriptsDir)) {
        // eslint-disable-next-line no-console
        console.log('📁 Criando diretório global de scripts...');
        try {
            fs.mkdirSync(globalScriptsDir, { recursive: true });
            // eslint-disable-next-line no-console
            console.log('✅ Diretório global de scripts criado');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('❌ Erro ao criar diretório de scripts:', error);
            throw error;
        }
    }

    // Carregar templates do contexto da extensão
    const templatesPath = path.join(context.extensionPath, 'templates');
    // eslint-disable-next-line no-console
    console.log('📄 Templates path:', templatesPath);
    
    if (!fs.existsSync(templatesPath)) {
        const error = `Templates path não encontrado: ${templatesPath}`;
        // eslint-disable-next-line no-console
        console.error('❌', error);
        // eslint-disable-next-line no-console
        console.log('📁 Listando conteúdo do extensionPath:', context.extensionPath);
        try {
            const extensionContents = fs.readdirSync(context.extensionPath);
            // eslint-disable-next-line no-console
            console.log('📋 Conteúdo da extensão:', extensionContents);
        } catch (listError) {
            // eslint-disable-next-line no-console
            console.error('❌ Erro ao listar extensionPath:', listError);
        }
        throw new Error(error);
    }
    
    try {
        // Criar ou atualizar settings.json com as configurações específicas do projeto
        // eslint-disable-next-line no-console
        console.log('⚙️ === CRIANDO SETTINGS.JSON ===');
        await updateSettingsFile(path.join(vscodeDir, TEXTS.CONFIG_FILES.SETTINGS), data, globalScriptsDir);
        
        // Criar tasks.json
        // eslint-disable-next-line no-console
        console.log('📋 === CRIANDO TASKS.JSON ===');
        await createFileFromTemplate(
            path.join(templatesPath, TEXTS.CONFIG_FILES.TASKS),
            path.join(vscodeDir, TEXTS.CONFIG_FILES.TASKS),
            data,
            globalScriptsDir
        );

        // Criar launch.json
        // eslint-disable-next-line no-console
        console.log('🚀 === CRIANDO LAUNCH.JSON ===');
        await createFileFromTemplate(
            path.join(templatesPath, TEXTS.CONFIG_FILES.LAUNCH),
            path.join(vscodeDir, TEXTS.CONFIG_FILES.LAUNCH),
            data,
            globalScriptsDir
        );

        // Criar keybindings.json
        // eslint-disable-next-line no-console
        console.log('⌨️ === CRIANDO KEYBINDINGS.JSON ===');
        await createFileFromTemplate(
            path.join(templatesPath, TEXTS.CONFIG_FILES.KEYBINDINGS),
            path.join(vscodeDir, TEXTS.CONFIG_FILES.KEYBINDINGS),
            data,
            globalScriptsDir
        );

        // Copiar scripts PowerShell para o diretório global compartilhado (apenas uma vez)
    const scriptsTemplatePath = path.join(templatesPath, 'scripts');
        // eslint-disable-next-line no-console
        console.log('📜 === COPIANDO SCRIPTS POWERSHELL ===');
    await copyScripts(scriptsTemplatePath, globalScriptsDir);
        
        // eslint-disable-next-line no-console
        console.log('✅ === TODOS OS ARQUIVOS CRIADOS COM SUCESSO! ===');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ === ERRO DURANTE CRIAÇÃO DE ARQUIVOS ===');
        // eslint-disable-next-line no-console
        console.error('💥 Detalhes:', error);
        throw error;
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

    // eslint-disable-next-line no-console
    console.log('🔍 Verificando arquivos em:', vscodeDir);

    // Verificar se cada arquivo foi criado
    for (const fileName of expectedFiles) {
        const filePath = path.join(vscodeDir, fileName);
        if (fs.existsSync(filePath)) {
            result.filesCreated.push(fileName);
            // eslint-disable-next-line no-console
            console.log(`✅ ${fileName} - CRIADO`);
            
            // Verificar conteúdo específico para cada arquivo
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
                        // eslint-disable-next-line no-console
                        console.log(`🎯 Debug config encontrada: ${debugConfig?.name}`);
                    } else {
                        result.errors.push(`launch.json não contém configuração de debug para ${data.projectName}`);
                        // eslint-disable-next-line no-console
                        console.warn(`⚠️ launch.json sem debug config para ${data.projectName}`);
                    }
                } else if (fileName === TEXTS.CONFIG_FILES.SETTINGS) {
                    const settings = JSON.parse(content);
                    const hasAngularAssistConfig = settings['angular-assist.automation'] && 
                        settings['angular-assist.automation'][data.projectName];
                    
                    if (!hasAngularAssistConfig) {
                        result.errors.push(`settings.json não contém configuração Angular Assist para ${data.projectName}`);
                        // eslint-disable-next-line no-console
                        console.warn(`⚠️ settings.json sem config Angular Assist para ${data.projectName}`);
                    } else {
                        // eslint-disable-next-line no-console
                        console.log(`✅ settings.json configurado para ${data.projectName}`);
                    }
                } else if (fileName === TEXTS.CONFIG_FILES.TASKS) {
                    const tasksConfig = JSON.parse(content);
                    const hasAngularAssistTasks = tasksConfig.tasks && 
                        tasksConfig.tasks.some((task: {label: string}) => 
                            task.label.includes(data.projectName) && task.label.includes('Angular Assist')
                        );
                    
                    if (!hasAngularAssistTasks) {
                        result.errors.push(`tasks.json não contém tarefas Angular Assist para ${data.projectName}`);
                        // eslint-disable-next-line no-console
                        console.warn(`⚠️ tasks.json sem tarefas Angular Assist para ${data.projectName}`);
                    } else {
                        const taskCount = tasksConfig.tasks.filter((task: {label: string}) => 
                            task.label.includes(data.projectName) || task.label.includes('Angular Assist')
                        ).length;
                        // eslint-disable-next-line no-console
                        console.log(`✅ tasks.json configurado com ${taskCount} tarefas Angular Assist`);
                    }
                }
            } catch (parseError) {
                result.errors.push(`Erro ao analisar ${fileName}: ${parseError}`);
                // eslint-disable-next-line no-console
                console.error(`❌ Erro ao analisar ${fileName}:`, parseError);
            }
        } else {
            result.missingFiles.push(fileName);
            result.errors.push(`Arquivo ${fileName} não foi criado`);
            // eslint-disable-next-line no-console
            console.error(`❌ ${fileName} - NÃO ENCONTRADO`);
        }
    }

    result.success = result.missingFiles.length === 0 && result.errors.length === 0;
    
    // eslint-disable-next-line no-console
    console.log('📊 RESUMO DA VERIFICAÇÃO:');
    // eslint-disable-next-line no-console
    console.log(`   ✅ Arquivos criados: ${result.filesCreated.length}/${expectedFiles.length}`);
    // eslint-disable-next-line no-console
    console.log(`   ❌ Arquivos faltando: ${result.missingFiles.length}`);
    // eslint-disable-next-line no-console
    console.log(`   ⚠️ Erros encontrados: ${result.errors.length}`);
    // eslint-disable-next-line no-console
    console.log(`   🎯 Debug config: ${result.debugConfigFound ? 'SIM' : 'NÃO'}`);

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
    // Suporta subpastas por idioma: templates/scripts/<locale>/...
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

    // eslint-disable-next-line no-console
    console.log(`📄 Processando template: ${path.basename(templatePath)}`);

    // Ler o conteúdo do template
    let content = fs.readFileSync(templatePath, 'utf8');

    // Substituir as variáveis no template
    content = content
        .replace(/\[NOME_PROJETO\]/g, data.projectName)
        .replace(/\[PORTA\]/g, data.port)
        .replace(/\[PORTA_DEBUG\]/g, data.debugPort)
        .replace(/\[ROTA_APLICACAO\]/g, data.route);

    // Validar se é um JSON válido antes de continuar
    if (destPath.endsWith('.json')) {
        try {
            JSON.parse(content);
            // eslint-disable-next-line no-console
            console.log(`✅ JSON válido para ${path.basename(destPath)}`);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`❌ JSON inválido para ${path.basename(destPath)}:`, error);
            return;
        }
    }

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
                
                // eslint-disable-next-line no-console
                console.log(`✅ Tasks mescladas: ${tasksJson.tasks.length} tarefas total`);
            } else if (destPath.endsWith('launch.json')) {
                // Mescla configurações de lançamento (launch.json)
                const launchJson = updatedJson as LaunchJson;
                if (!launchJson.configurations) launchJson.configurations = [];
                
                // Remover configurações existentes do projeto Angular Assist
                launchJson.configurations = launchJson.configurations.filter(config => 
                    !config.name.includes(data.projectName) &&
                    !config.name.includes('Chrome Debug')
                );
                
                // Adicionar novas configurações
                const newLaunchJson = newJson as LaunchJson;
                launchJson.configurations = [...launchJson.configurations, ...newLaunchJson.configurations];
                updatedJson = launchJson;
                
                // eslint-disable-next-line no-console
                console.log(`✅ Launch configs mescladas: ${launchJson.configurations.length} configurações total`);
            } else if (destPath.endsWith('keybindings.json')) {
                // Para keybindings.json, simplesmente adicionar as novas sem remover existentes
                const mergedJson = Array.isArray(existingJson) ? [...existingJson] : [];
                
                // Filtrar para remover keybindings duplicados
                const existingKeys = new Set(mergedJson.map((key: VSCodeKeybinding) => key.command));
                const newKeybindings = (newJson as VSCodeKeybinding[]).filter((key: VSCodeKeybinding) => !existingKeys.has(key.command));
                
                updatedJson = [...mergedJson, ...newKeybindings];
                
                // eslint-disable-next-line no-console
                console.log(`✅ Keybindings mesclados: ${(updatedJson as VSCodeKeybinding[]).length} atalhos total`);
            }

            // Validar JSON final antes de escrever
            const finalContent = JSON.stringify(updatedJson, null, 2);
            JSON.parse(finalContent); // Validação
            
            // Escrever o arquivo JSON atualizado
            fs.writeFileSync(destPath, finalContent, 'utf8');
            // eslint-disable-next-line no-console
            console.log(`✅ Arquivo ${path.basename(destPath)} criado/atualizado com sucesso`);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`${TEXTS.ERRORS.FILE_MERGE_ERROR} ${destPath}:`, error);
            // Fallback: criar o arquivo como novo
            fs.writeFileSync(destPath, content, 'utf8');
            // eslint-disable-next-line no-console
            console.log(`⚠️ Fallback: arquivo ${path.basename(destPath)} criado como novo`);
        }
    } else {
        // Criar o arquivo normalmente se não existir
        fs.writeFileSync(destPath, content, 'utf8');
        // eslint-disable-next-line no-console
        console.log(`✅ Arquivo ${path.basename(destPath)} criado com sucesso`);
    }
}
