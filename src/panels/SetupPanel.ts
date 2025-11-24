import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ProjectData } from '../types';

export class SetupPanel {
    public static currentPanel: SetupPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, defaults: Partial<ProjectData>, callback: (data: ProjectData) => void) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'ready':
                        this._panel.webview.postMessage({ command: 'setDefaults', ...defaults });
                        return;
                    case 'submit':
                        callback(message.data);
                        this.dispose();
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public static createOrShow(extensionUri: vscode.Uri, defaults: Partial<ProjectData>, callback: (data: ProjectData) => void) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (SetupPanel.currentPanel) {
            SetupPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'angularAssistSetup',
            'Angular Assist Setup',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'templates', 'ui')]
            }
        );

        SetupPanel.currentPanel = new SetupPanel(panel, extensionUri, defaults, callback);
    }

    public dispose() {
        SetupPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const htmlPath = vscode.Uri.joinPath(this._extensionUri, 'src', 'templates', 'ui', 'setup.html');
        let html = fs.readFileSync(htmlPath.fsPath, 'utf8');
        return html;
    }
}
