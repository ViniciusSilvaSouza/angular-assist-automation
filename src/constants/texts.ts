// Arquivo de constantes para textos da interface
// Centraliza todos os textos exibidos ao usuário para facilitar manutenção

export const TEXTS = {
    // Mensagens de erro
    ERRORS: {
        NO_WORKSPACE: "Nenhum workspace aberto!",
        NODE_NOT_FOUND: "ERRO: Node.js não encontrado. Por favor, instale o Node.js primeiro.",
        ANGULAR_CLI_INSTALL_FAILED: "ERRO: Falha ao instalar Angular CLI",
        DEPENDENCIES_INSTALL_FAILED: "ERRO: Falha ao instalar dependências",
        READING_PACKAGE_JSON: "Erro ao analisar package.json:",
        READING_SETTINGS_JSON: "Erro ao ler settings.json:",
        READING_ANGULAR_JSON: "Erro ao ler angular.json:",
        TEMPLATE_NOT_FOUND: "Template não encontrado:",
        FILE_MERGE_ERROR: "Erro ao mesclar arquivo"
    },

    // Prompts de entrada do usuário
    PROMPTS: {
        PROJECT_NAME: {
            prompt: 'Nome do Projeto',
            placeholder: 'Ex: projeto-xyz'
        },
        SERVER_PORT: {
            prompt: 'Porta para o servidor Angular',
            defaultValue: '4200'
        },
        DEBUG_PORT: {
            prompt: 'Porta para debug Chrome',
            defaultValue: '9222'
        },
        APPLICATION_ROUTE: {
            prompt: 'Rota da aplicação (ex: /projeto-xyz)',
            defaultValue: '/projeto-xyz'
        }
    },

    // Mensagens de confirmação e informação
    MESSAGES: {
        ANGULAR_PROJECT_DETECTED: 'Projeto Angular detectado! Deseja configurar a automação Angular Assist?',
        SETUP_COMPLETE: 'criada com sucesso!', // será concatenado com nome do projeto
        SETUP_NOW: 'Configurar Agora',
        IGNORE: 'Ignorar'
    },

    // Comandos e labels
    COMMANDS: {
        DETECT_TITLE: '🚀 Setup Angular Assist: Detectar Projeto Angular',
        SETUP_TITLE: '🚀 Setup Angular Assist: Configurar Automação'
    },

    // Labels de tarefas
    TASKS: {
        START_PROJECT: 'Start Projeto -', // será concatenado com nome do projeto
        START_PROJECT_SUFFIX: '(Angular Assist)',
        RESTART_PROJECT: '🔄 Restart Projeto -', // será concatenado com nome do projeto
        STOP_ALL_PROCESSES: '🛑 Stop All Processes',
        CLEAN_CHROME: '🌐 Clean Chrome', // será concatenado com nome do projeto
        NG_SERVE: 'ng serve',
        NG_BUILD: 'ng build'
    },

    // Labels de configuração de debug
    DEBUG: {
        CHROME_DEBUG: '🔥 Chrome Debug -' // será concatenado com nome do projeto
    },

    // Mensagens dos scripts PowerShell
    SCRIPTS: {
        STARTING_PROJECT: 'Iniciando o projeto', // será concatenado com nome do projeto
        NODE_FOUND: 'Node.js encontrado:',
        ANGULAR_CLI_FOUND: 'Angular CLI encontrado',
        ANGULAR_CLI_NOT_FOUND: 'Angular CLI não encontrado. Instalando...',
        DEPENDENCIES_ALREADY_INSTALLED: 'Dependências já instaladas',
        INSTALLING_DEPENDENCIES: 'Instalando dependências do projeto...',
        CHECKING_PORT: 'Verificando processos na porta',
        STOPPING_PROCESSES_ON_PORT: 'Finalizando processos na porta',
        PROCESS_STOPPED: 'Processo finalizado.',
        STARTING_DEV_SERVER: 'Iniciando servidor de desenvolvimento...',
        PROJECT_ACCESSIBLE_AT: 'O projeto será acessível em:',
        PRESS_CTRL_C: 'Pressione Ctrl+C para parar o servidor',
        PROJECT_WILL_OPEN_AT: 'O projeto será aberto em:',
        RESTARTING_PROJECT: 'Reiniciando projeto',
        STOPPING_ALL_PROCESSES: 'Finalizando todos os processos do projeto',
        STOPPING_NODE_PROCESSES: 'Finalizando processos Node.js...',
        STOPPING_CHROME_PROCESSES: 'Finalizando processos Chrome do projeto...',
        ALL_PROCESSES_STOPPED: 'foram finalizados!', // será concatenado com nome do projeto
        CLEANING_CHROME: 'Limpando processos Chrome do projeto',
        CHROME_STOPPED: 'Chrome do projeto finalizado',
        NO_CHROME_PROCESSES: 'Nenhum processo Chrome específico do projeto encontrado.',
        CLEANING_CHROME_DATA: 'Limpando dados do Chrome...',
        CHROME_DATA_CLEANED: 'Dados do Chrome limpos.',
        CHROME_DATA_CLEANUP_WARNING: 'Aviso: Não foi possível limpar todos os dados do Chrome.',
        CHROME_CLEANUP_COMPLETE: 'concluída!', // será concatenado com nome do projeto
        NO_PROCESS_ON_PORT: 'Nenhum processo encontrado na porta',
        PROCESS_STOPPED_NAME_PID: 'Processo finalizado:', // será concatenado com nome e PID
        WAITING_SECONDS: 'Aguardando 3 segundos...',
        PRESS_ENTER_TO_EXIT: 'Pressione Enter para sair'
    },

    // Cores para os scripts PowerShell
    COLORS: {
        GREEN: 'Green',
        RED: 'Red',
        YELLOW: 'Yellow',
        CYAN: 'Cyan'
    },

    // Extensão metadata
    // Informações da extensão
    EXTENSION: {
        NAME: 'angular-assist-automation',
        DISPLAY_NAME: 'Angular Assist - Environment Automation',
        DESCRIPTION: 'Automatização de ambiente para projetos Angular',
        ACTIVATION_MESSAGE: 'Extensão "Angular Assist - Environment Automation" ativada!'
    },

    // Nomes de arquivos de script
    SCRIPT_FILES: {
        START_VSCODE: 'start-projeto-vscode.ps1',
        START_PROJECT: 'start-projeto.ps1',
        RESTART_PROJECT: 'restart-projeto.ps1',
        STOP_ALL_PROCESSES: 'stop-all-processes.ps1',
        CLEAN_CHROME: 'clean-chrome.ps1'
    }
};

    // Funções auxiliares para construir textos dinâmicos
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
    
    // Labels de tarefas
    startProjectTask: (projectName: string): string => `${TEXTS.TASKS.START_PROJECT} ${projectName} ${TEXTS.TASKS.START_PROJECT_SUFFIX}`,
    restartProjectTask: (projectName: string): string => `${TEXTS.TASKS.RESTART_PROJECT} ${projectName}`,
    cleanChromeTask: (projectName: string): string => `${TEXTS.TASKS.CLEAN_CHROME} ${projectName}`,
    chromeDebugConfig: (projectName: string): string => `${TEXTS.DEBUG.CHROME_DEBUG} ${projectName}`
};
