
import type { Locale, LocaleTexts } from '../types/i18n';
export type { Locale } from '../types/i18n';

const LOCALE_TEXTS: Record<Locale, LocaleTexts> = {
    'pt-BR': {
        ERRORS: {
            NO_WORKSPACE: 'Nenhum workspace aberto!',
            NODE_NOT_FOUND: 'ERRO: Node.js não encontrado. Por favor, instale o Node.js primeiro.',
            ANGULAR_CLI_INSTALL_FAILED: 'ERRO: Falha ao instalar Angular CLI',
            DEPENDENCIES_INSTALL_FAILED: 'ERRO: Falha ao instalar dependências',
            READING_PACKAGE_JSON: 'Erro ao analisar package.json:',
            READING_SETTINGS_JSON: 'Erro ao ler settings.json:',
            READING_ANGULAR_JSON: 'Erro ao ler angular.json:',
            TEMPLATE_NOT_FOUND: 'Template não encontrado:',
            FILE_MERGE_ERROR: 'Erro ao mesclar arquivo'
        },
        DETECTION: {
            ANGULAR_CORE_DEPENDENCY: '@angular/core',
            ANGULAR_CLI_DEPENDENCY: '@angular/cli',
            AUTOMATION_SETTING_KEY: 'angular-assist.automation',
            PACKAGE_JSON_FILENAME: 'package.json',
            ANGULAR_JSON_FILENAME: 'angular.json',
            SETTINGS_JSON_PATH: '.vscode/settings.json',
            VSCODE_FOLDER: '.vscode'
        },
        CONFIG_FILES: {
            SETTINGS: 'settings.json',
            TASKS: 'tasks.json',
            LAUNCH: 'launch.json',
            KEYBINDINGS: 'keybindings.json'
        },
        PROMPTS: {
            PROJECT_NAME: { prompt: 'Nome do Projeto', placeholder: 'Ex: projeto-xyz' },
            SERVER_PORT: { prompt: 'Porta para o servidor Angular', defaultValue: '4200' },
            DEBUG_PORT: { prompt: 'Porta para debug Chrome', defaultValue: '9222' },
            APPLICATION_ROUTE: { prompt: 'Rota da aplicação (ex: /projeto-xyz)', defaultValue: '/projeto-xyz' }
        },
        MESSAGES: {
            ANGULAR_PROJECT_DETECTED: 'Projeto Angular detectado! Deseja configurar a automação Angular Assist?',
            SETUP_COMPLETE: 'criada com sucesso!',
            SETUP_NOW: 'Configurar Agora',
            IGNORE: 'Ignorar'
        },
        COMMANDS: {
            DETECT_TITLE: '🚀 Setup Angular Assist: Detectar Projeto Angular',
            SETUP_TITLE: '🚀 Setup Angular Assist: Configurar Automação'
        },
        TASKS: {
            START_PROJECT: 'Start Projeto -',
            START_PROJECT_SUFFIX: '(Angular Assist)',
            RESTART_PROJECT: '🔄 Restart Projeto -',
            STOP_ALL_PROCESSES: '🛑 Stop All Processes',
            CLEAN_CHROME: '🌐 Clean Chrome',
            NG_SERVE: 'ng serve',
            NG_BUILD: 'ng build'
        },
        DEBUG: {
            CHROME_DEBUG: '🔥 Chrome Debug -'
        },
        SCRIPTS: {
            STARTING_PROJECT: 'Iniciando o projeto',
            NODE_FOUND: 'Node.js encontrado:',
            ANGULAR_CLI_FOUND: 'Angular CLI encontrado',
            ANGULAR_CLI_NOT_FOUND: 'Angular CLI nao encontrado. Instalando...',
            DEPENDENCIES_ALREADY_INSTALLED: 'Dependencias ja instaladas',
            INSTALLING_DEPENDENCIES: 'Instalando dependencias do projeto...',
            CHECKING_PORT: 'Verificando processos na porta',
            STOPPING_PROCESSES_ON_PORT: 'Finalizando processos na porta',
            PROCESS_STOPPED: 'Processo finalizado.',
            STARTING_DEV_SERVER: 'Iniciando servidor de desenvolvimento...',
            PROJECT_ACCESSIBLE_AT: 'O projeto sera acessivel em:',
            PRESS_CTRL_C: 'Pressione Ctrl+C para parar o servidor',
            PROJECT_WILL_OPEN_AT: 'O projeto sera aberto em:',
            RESTARTING_PROJECT: 'Reiniciando projeto',
            STOPPING_ALL_PROCESSES: 'Finalizando todos os processos do projeto',
            STOPPING_NODE_PROCESSES: 'Finalizando processos Node.js...',
            STOPPING_CHROME_PROCESSES: 'Finalizando processos Chrome do projeto...',
            ALL_PROCESSES_STOPPED: 'foram finalizados!',
            CLEANING_CHROME: 'Limpando processos Chrome do projeto',
            CHROME_STOPPED: 'Chrome do projeto finalizado',
            NO_CHROME_PROCESSES: 'Nenhum processo Chrome especifico do projeto encontrado.',
            CLEANING_CHROME_DATA: 'Limpando dados do Chrome...',
            CHROME_DATA_CLEANED: 'Dados do Chrome limpos.',
            CHROME_DATA_CLEANUP_WARNING: 'Aviso: Nao foi possivel limpar todos os dados do Chrome.',
            CHROME_CLEANUP_COMPLETE: 'concluida!',
            NO_PROCESS_ON_PORT: 'Nenhum processo encontrado na porta',
            PROCESS_STOPPED_NAME_PID: 'Processo finalizado:',
            WAITING_SECONDS: 'Aguardando 3 segundos...',
            PRESS_ENTER_TO_EXIT: 'Pressione Enter para sair'
        },
        COLORS: { GREEN: 'Green', RED: 'Red', YELLOW: 'Yellow', CYAN: 'Cyan' },
        EXTENSION: {
            NAME: 'angular-assist-automation',
            DISPLAY_NAME: 'Angular Assist - Environment Automation',
            DESCRIPTION: 'Automatização de ambiente para projetos Angular',
            ACTIVATION_MESSAGE: 'Extensão "Angular Assist - Environment Automation" ativada!'
        },
        SCRIPT_FILES: {
            START_VSCODE: 'start-projeto-vscode.ps1',
            START_PROJECT: 'start-projeto.ps1',
            RESTART_PROJECT: 'restart-projeto.ps1',
            STOP_ALL_PROCESSES: 'stop-all-processes.ps1',
            CLEAN_CHROME: 'clean-chrome.ps1'
        },
        LANGUAGE: {
            SELECT_PLACEHOLDER: 'Selecione o idioma',
            ENGLISH_LABEL: 'English (United States)',
            PORTUGUESE_LABEL: 'Português (Brasil)',
            CHANGED_TO: 'Idioma alterado para Português (Brasil)'
        }
    },
    'en-US': {
        ERRORS: {
            NO_WORKSPACE: 'No workspace is open!',
            NODE_NOT_FOUND: 'ERROR: Node.js not found. Please install Node.js first.',
            ANGULAR_CLI_INSTALL_FAILED: 'ERROR: Failed to install Angular CLI',
            DEPENDENCIES_INSTALL_FAILED: 'ERROR: Failed to install dependencies',
            READING_PACKAGE_JSON: 'Error parsing package.json:',
            READING_SETTINGS_JSON: 'Error reading settings.json:',
            READING_ANGULAR_JSON: 'Error reading angular.json:',
            TEMPLATE_NOT_FOUND: 'Template not found:',
            FILE_MERGE_ERROR: 'Error merging file'
        },
        DETECTION: {
            ANGULAR_CORE_DEPENDENCY: '@angular/core',
            ANGULAR_CLI_DEPENDENCY: '@angular/cli',
            AUTOMATION_SETTING_KEY: 'angular-assist.automation',
            PACKAGE_JSON_FILENAME: 'package.json',
            ANGULAR_JSON_FILENAME: 'angular.json',
            SETTINGS_JSON_PATH: '.vscode/settings.json',
            VSCODE_FOLDER: '.vscode'
        },
        CONFIG_FILES: {
            SETTINGS: 'settings.json',
            TASKS: 'tasks.json',
            LAUNCH: 'launch.json',
            KEYBINDINGS: 'keybindings.json'
        },
        PROMPTS: {
            PROJECT_NAME: { prompt: 'Project Name', placeholder: 'e.g., project-xyz' },
            SERVER_PORT: { prompt: 'Port for Angular dev server', defaultValue: '4200' },
            DEBUG_PORT: { prompt: 'Port for Chrome debug', defaultValue: '9222' },
            APPLICATION_ROUTE: { prompt: 'Application route (e.g., /project-xyz)', defaultValue: '/project-xyz' }
        },
        MESSAGES: {
            ANGULAR_PROJECT_DETECTED: 'Angular project detected! Do you want to configure Angular Assist automation?',
            SETUP_COMPLETE: 'created successfully!',
            SETUP_NOW: 'Setup Now',
            IGNORE: 'Ignore'
        },
        COMMANDS: {
            DETECT_TITLE: '🚀 Setup Angular Assist: Detect Angular Project',
            SETUP_TITLE: '🚀 Setup Angular Assist: Configure Automation'
        },
        TASKS: {
            START_PROJECT: 'Start Project -',
            START_PROJECT_SUFFIX: '(Angular Assist)',
            RESTART_PROJECT: '🔄 Restart Project -',
            STOP_ALL_PROCESSES: '🛑 Stop All Processes',
            CLEAN_CHROME: '🌐 Clean Chrome',
            NG_SERVE: 'ng serve',
            NG_BUILD: 'ng build'
        },
        DEBUG: { CHROME_DEBUG: '🔥 Chrome Debug -' },
        SCRIPTS: {
            STARTING_PROJECT: 'Starting project',
            NODE_FOUND: 'Node.js found:',
            ANGULAR_CLI_FOUND: 'Angular CLI found',
            ANGULAR_CLI_NOT_FOUND: 'Angular CLI not found. Installing...',
            DEPENDENCIES_ALREADY_INSTALLED: 'Dependencies already installed',
            INSTALLING_DEPENDENCIES: 'Installing project dependencies...',
            CHECKING_PORT: 'Checking processes on port',
            STOPPING_PROCESSES_ON_PORT: 'Stopping processes on port',
            PROCESS_STOPPED: 'Process stopped.',
            STARTING_DEV_SERVER: 'Starting development server...',
            PROJECT_ACCESSIBLE_AT: 'Project will be accessible at:',
            PRESS_CTRL_C: 'Press Ctrl+C to stop the server',
            PROJECT_WILL_OPEN_AT: 'The project will open at:',
            RESTARTING_PROJECT: 'Restarting project',
            STOPPING_ALL_PROCESSES: 'Stopping all project processes',
            STOPPING_NODE_PROCESSES: 'Stopping Node.js processes...',
            STOPPING_CHROME_PROCESSES: 'Stopping project Chrome processes...',
            ALL_PROCESSES_STOPPED: 'have been stopped!',
            CLEANING_CHROME: 'Cleaning project Chrome processes',
            CHROME_STOPPED: 'Project Chrome stopped',
            NO_CHROME_PROCESSES: 'No project-specific Chrome processes found.',
            CLEANING_CHROME_DATA: 'Cleaning Chrome data...',
            CHROME_DATA_CLEANED: 'Chrome data cleaned.',
            CHROME_DATA_CLEANUP_WARNING: 'Warning: Could not clean all Chrome data.',
            CHROME_CLEANUP_COMPLETE: 'completed!',
            NO_PROCESS_ON_PORT: 'No process found on port',
            PROCESS_STOPPED_NAME_PID: 'Process stopped:',
            WAITING_SECONDS: 'Waiting 3 seconds...',
            PRESS_ENTER_TO_EXIT: 'Press Enter to exit'
        },
        COLORS: { GREEN: 'Green', RED: 'Red', YELLOW: 'Yellow', CYAN: 'Cyan' },
        EXTENSION: {
            NAME: 'angular-assist-automation',
            DISPLAY_NAME: 'Angular Assist - Environment Automation',
            DESCRIPTION: 'Environment automation for Angular projects',
            ACTIVATION_MESSAGE: 'Extension "Angular Assist - Environment Automation" activated!'
        },
        SCRIPT_FILES: {
            START_VSCODE: 'start-projeto-vscode.ps1',
            START_PROJECT: 'start-projeto.ps1',
            RESTART_PROJECT: 'restart-projeto.ps1',
            STOP_ALL_PROCESSES: 'stop-all-processes.ps1',
            CLEAN_CHROME: 'clean-chrome.ps1'
        },
        LANGUAGE: {
            SELECT_PLACEHOLDER: 'Select language',
            ENGLISH_LABEL: 'English (United States)',
            PORTUGUESE_LABEL: 'Português (Brasil)',
            CHANGED_TO: 'Language changed to English'
        }
    }
};

    let CURRENT_LOCALE: Locale = 'en-US';
export let TEXTS: LocaleTexts = LOCALE_TEXTS[CURRENT_LOCALE];

export function setLocale(locale: Locale): void {
    CURRENT_LOCALE = LOCALE_TEXTS[locale] ? locale : 'pt-BR';
    TEXTS = LOCALE_TEXTS[CURRENT_LOCALE];
}

export function getLocale(): Locale {
    return CURRENT_LOCALE;
}

export const buildText = {
    startingProject: (projectName: string): string => `${TEXTS.SCRIPTS.STARTING_PROJECT} ${projectName} - Angular Assist...`,
    setupComplete: (projectName: string): string => `Configuração para ${projectName} ${TEXTS.MESSAGES.SETUP_COMPLETE}`,
    checkingPort: (port: string): string => `${TEXTS.SCRIPTS.CHECKING_PORT} ${port}...`,
    stoppingProcessesOnPort: (port: string): string => `${TEXTS.SCRIPTS.STOPPING_PROCESSES_ON_PORT} ${port}...`,
    projectAccessibleAt: (port: string, route: string): string => `${TEXTS.SCRIPTS.PROJECT_ACCESSIBLE_AT} http://localhost:${port}${route}`,
    projectWillOpenAt: (port: string, route: string): string => `${TEXTS.SCRIPTS.PROJECT_WILL_OPEN_AT} http://localhost:${port}${route}`,
    restartingProject: (projectName: string): string => `${TEXTS.SCRIPTS.RESTARTING_PROJECT} ${projectName} - Angular Assist...`,
    stoppingAllProcesses: (projectName: string): string => `${TEXTS.SCRIPTS.STOPPING_ALL_PROCESSES} ${projectName}...`,
    allProcessesStopped: (projectName: string): string => `Todos os processos do projeto ${projectName} ${TEXTS.SCRIPTS.ALL_PROCESSES_STOPPED}`,
    cleaningChrome: (projectName: string): string => `${TEXTS.SCRIPTS.CLEANING_CHROME} ${projectName}...`,
    chromeCleanupComplete: (projectName: string): string => `Limpeza de Chrome do projeto ${projectName} ${TEXTS.SCRIPTS.CHROME_CLEANUP_COMPLETE}`,
    noProcessOnPort: (port: string): string => `${TEXTS.SCRIPTS.NO_PROCESS_ON_PORT} ${port}`,
    processStoppedNamePid: (processName: string, pid: string): string => `${TEXTS.SCRIPTS.PROCESS_STOPPED_NAME_PID} ${processName} (PID: ${pid})`,
    startProjectTask: (projectName: string): string => `${TEXTS.TASKS.START_PROJECT} ${projectName} ${TEXTS.TASKS.START_PROJECT_SUFFIX}`,
    restartProjectTask: (projectName: string): string => `${TEXTS.TASKS.RESTART_PROJECT} ${projectName}`,
    cleanChromeTask: (projectName: string): string => `${TEXTS.TASKS.CLEAN_CHROME} ${projectName}`,
    chromeDebugConfig: (projectName: string): string => `${TEXTS.DEBUG.CHROME_DEBUG} ${projectName}`
};
