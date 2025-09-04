import * as vscode from 'vscode';
import { detectProject } from './commands/detectProject';
import { setupAutomation } from './commands/setupAutomation';
import { TEXTS, setLocale, getLocale } from './constants/texts';
import { changeLanguage } from './commands/changeLanguage';

export function activate(context: vscode.ExtensionContext): void {
    const config = vscode.workspace.getConfiguration('angular-assist');
    const lang = (config.get('language') as 'pt-BR' | 'en-US') ?? 'en-US';
    setLocale(lang);
    // eslint-disable-next-line no-console
    console.log(TEXTS.EXTENSION.ACTIVATION_MESSAGE);

    // Registra os comandos
    const detectCommand = vscode.commands.registerCommand('angular-assist.detect', () => detectProject(context));
    const setupCommand = vscode.commands.registerCommand('angular-assist.setup', () => setupAutomation(context));
    const changeLangCommand = vscode.commands.registerCommand('angular-assist.changeLanguage', () => changeLanguage());

    context.subscriptions.push(detectCommand, setupCommand, changeLangCommand);

    // Observa mudança de configuração de idioma e atualiza locale
    const configWatcher = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('angular-assist.language')) {
            const newLang = (vscode.workspace.getConfiguration('angular-assist').get('language') as 'pt-BR' | 'en-US') ?? 'pt-BR';
            setLocale(newLang);
            // eslint-disable-next-line no-console
            console.log(`Angular Assist locale atualizado para: ${getLocale()}`);
        }
    });
    context.subscriptions.push(configWatcher);

    // Detecta projetos automaticamente ao abrir o workspace
    detectProject(context);
}

export function deactivate(): void {}
