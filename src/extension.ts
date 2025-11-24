import * as vscode from 'vscode';
import { detectProject } from './commands/detectProject';
import { setupAutomation } from './commands/setupAutomation';
import { setLocale } from './constants/texts';
import * as logger from './utils/logger';
import { changeLanguage } from './commands/changeLanguage';
import { addDockerSupport } from './commands/addDocker';

export function activate(context: vscode.ExtensionContext): void {
    const config = vscode.workspace.getConfiguration('angular-assist');
    const lang = (config.get('language') as 'pt-BR' | 'en-US') ?? 'en-US';
    setLocale(lang);

    const detectCommand = vscode.commands.registerCommand('angular-assist.detect', async () => {
        try {
            await detectProject(context);
        } catch (err) {
            logger.error('Detect command failed:', err);
            vscode.window.showErrorMessage('Angular Assist: Detect failed.');
        }
    });
    const setupCommand = vscode.commands.registerCommand('angular-assist.setup', async () => {
        try {
            await setupAutomation(context);
        } catch (err) {
            logger.error('Setup command failed:', err);
            vscode.window.showErrorMessage('Angular Assist: Setup failed.');
        }
    });
    const dockerCommand = vscode.commands.registerCommand('angular-assist.addDocker', async () => {
        try {
            await addDockerSupport(context);
        } catch (err) {
            logger.error('Docker command failed:', err);
            vscode.window.showErrorMessage('Angular Assist: Add Docker failed.');
        }
    });
    const changeLangCommand = vscode.commands.registerCommand('angular-assist.changeLanguage', () => changeLanguage());

    context.subscriptions.push(detectCommand, setupCommand, dockerCommand, changeLangCommand);

    const configWatcher = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('angular-assist.language')) {
            const newLang = (vscode.workspace.getConfiguration('angular-assist').get('language') as 'pt-BR' | 'en-US') ?? 'pt-BR';
            setLocale(newLang);
            logger.info(`Locale updated to ${newLang}`);
        }
    });
    context.subscriptions.push(configWatcher);

    detectProject(context);
}

export function deactivate(): void {}
