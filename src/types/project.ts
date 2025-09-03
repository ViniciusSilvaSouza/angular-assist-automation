// Tipos relacionados a projetos e configurações do Angular Assist

export interface ProjectData {
    projectName: string;
    port: string;
    debugPort: string;
    route: string;
    projectPath: string;
}

export interface AngularAssistProjectConfig {
    projectName: string;
    port: string;
    debugPort: string;
    route: string;
    workspacePath: string;
    globalScriptsPath: string;
}

export interface AngularAssistSettings {
    "angular-assist.automation"?: {
        [projectName: string]: AngularAssistProjectConfig;
    };
    [key: string]: unknown;
}
