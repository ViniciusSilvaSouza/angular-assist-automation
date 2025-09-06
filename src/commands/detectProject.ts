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

    if (await isAngularProject(workspaceFolder.uri.fsPath)) {
        if (!await hasAngularAssistAutomation(workspaceFolder.uri.fsPath)) {
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
    const packageJsonPath = path.join(projectPath, TEXTS.DETECTION.PACKAGE_JSON_FILENAME);
    if (!fs.existsSync(packageJsonPath)) {
        return false;
    }

    try {
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson: PackageJson = JSON.parse(packageJsonContent);

        const dependencies = {...packageJson.dependencies, ...packageJson.devDependencies};
        return !!(dependencies[TEXTS.DETECTION.ANGULAR_CORE_DEPENDENCY] || dependencies[TEXTS.DETECTION.ANGULAR_CLI_DEPENDENCY]);
    } catch {
        // ignore - treat as non-angular or unreadable package.json
        return false;
    }
}

async function hasAngularAssistAutomation(projectPath: string): Promise<boolean> {
    const settingsPath = path.join(projectPath, TEXTS.DETECTION.SETTINGS_JSON_PATH);
    if (fs.existsSync(settingsPath)) {
        try {
            const settingsContent = fs.readFileSync(settingsPath, 'utf8');
            const settings: AngularAssistSettings = JSON.parse(settingsContent);
            return !!settings[TEXTS.DETECTION.AUTOMATION_SETTING_KEY];
        } catch {
            // ignore - unreadable settings
            return false;
        }
    }

    return false;
}
