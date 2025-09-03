import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TEXTS } from '../constants/texts';
import { PackageJson, AngularAssistSettings } from '../types';

export async function detectProject(_context: vscode.ExtensionContext): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        return;
    }

    // Verifica se é um projeto Angular
    if (await isAngularProject(workspaceFolder.uri.fsPath)) {
        // Verifica se já existe configuração do EducaDF
        if (!await hasEducaDFAutomation(workspaceFolder.uri.fsPath)) {
            const setupChoice = await vscode.window.showInformationMessage(
                TEXTS.MESSAGES.ANGULAR_PROJECT_DETECTED,
                TEXTS.MESSAGES.SETUP_NOW,
                TEXTS.MESSAGES.IGNORE
            );

            if (setupChoice === TEXTS.MESSAGES.SETUP_NOW) {
                vscode.commands.executeCommand('angular-assist.setup');
            }
        }
    }
}

async function isAngularProject(projectPath: string): Promise<boolean> {
    // Verifica se existe package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        return false;
    }

    try {
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson: PackageJson = JSON.parse(packageJsonContent);
        
        // Verifica se tem dependências do Angular
        const dependencies = {...packageJson.dependencies, ...packageJson.devDependencies};
        return !!(dependencies['@angular/core'] || dependencies['@angular/cli']);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`${TEXTS.ERRORS.READING_PACKAGE_JSON}`, error);
        return false;
    }
}

async function hasEducaDFAutomation(projectPath: string): Promise<boolean> {
    // Verifica se existe configuração no settings.json
    const settingsPath = path.join(projectPath, '.vscode', 'settings.json');
    if (fs.existsSync(settingsPath)) {
        try {
            const settingsContent = fs.readFileSync(settingsPath, 'utf8');
            const settings: AngularAssistSettings = JSON.parse(settingsContent);
            return !!settings['angular-assist.automation'];
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`${TEXTS.ERRORS.READING_SETTINGS_JSON}`, error);
            return false;
        }
    }

    return false;
}
