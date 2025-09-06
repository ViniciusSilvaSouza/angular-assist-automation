export type Locale = 'pt-BR' | 'en-US';

export type PromptWithPlaceholder = { prompt: string; placeholder: string };
export type PromptWithDefault = { prompt: string; defaultValue: string };

export type Prompts = {
    PROJECT_NAME: PromptWithPlaceholder;
    SERVER_PORT: PromptWithDefault;
    DEBUG_PORT: PromptWithDefault;
    APPLICATION_ROUTE: PromptWithDefault;
};

export type LocaleTexts = {
    ERRORS: Record<string, string>;
    DETECTION: {
        ANGULAR_CORE_DEPENDENCY: string;
        ANGULAR_CLI_DEPENDENCY: string;
        AUTOMATION_SETTING_KEY: string;
        PACKAGE_JSON_FILENAME: string;
        ANGULAR_JSON_FILENAME: string;
        SETTINGS_JSON_PATH: string;
        VSCODE_FOLDER: string;
    };
    CONFIG_FILES: {
        SETTINGS: string;
        TASKS: string;
        LAUNCH: string;
        KEYBINDINGS: string;
    };
    PROMPTS: Prompts;
    MESSAGES: Record<string, string>;
    COMMANDS: Record<string, string>;
    TASKS: Record<string, string>;
    DEBUG: Record<string, string>;
    SCRIPTS: Record<string, string>;
    COLORS: Record<string, string>;
    EXTENSION: Record<string, string>;
    SCRIPT_FILES: Record<string, string>;
    LANGUAGE: {
        SELECT_PLACEHOLDER: string;
        ENGLISH_LABEL: string;
        PORTUGUESE_LABEL: string;
        CHANGED_TO: string;
    };
};
