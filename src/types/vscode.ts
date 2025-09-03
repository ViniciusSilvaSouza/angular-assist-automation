// Tipos para configurações do VS Code (tasks, launch, keybindings)

export interface VSCodeTask {
    label: string;
    type: string;
    command?: string;
    args?: string[];
    group?: string;
    [key: string]: unknown;
}

export interface VSCodeLaunchConfig {
    name: string;
    type: string;
    request: string;
    [key: string]: unknown;
}

export interface VSCodeKeybinding {
    command: string;
    key: string;
    when?: string;
    [key: string]: unknown;
}

export interface TasksJson {
    version: string;
    tasks: VSCodeTask[];
}

export interface LaunchJson {
    version: string;
    configurations: VSCodeLaunchConfig[];
}
