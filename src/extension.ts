import * as vscode from 'vscode';
import { detectProject } from './commands/detectProject';
import { setupAutomation } from './commands/setupAutomation';
import { TEXTS } from './constants/texts';

export function activate(context: vscode.ExtensionContext): void {
    // eslint-disable-next-line no-console
    console.log(TEXTS.EXTENSION.ACTIVATION_MESSAGE);

    // Registra os comandos
    const detectCommand = vscode.commands.registerCommand('angular-assist.detect', () => detectProject(context));
    const setupCommand = vscode.commands.registerCommand('angular-assist.setup', () => setupAutomation(context));

    context.subscriptions.push(detectCommand, setupCommand);

    // Detecta projetos automaticamente ao abrir o workspace
    detectProject(context);
}

export function deactivate(): void {}
