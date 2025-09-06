import * as vscode from 'vscode';

let channel: vscode.OutputChannel | null = null;

function getChannel(): vscode.OutputChannel {
    if (!channel) {
        channel = vscode.window.createOutputChannel('Angular Assist');
    }
    return channel;
}

function isDebugEnabled(): boolean {
    try {
        return !!vscode.workspace.getConfiguration('angular-assist').get('debug');
    } catch {
        return false;
    }
}

export function debug(...args: unknown[]): void {
    if (!isDebugEnabled()) return;
    getChannel().appendLine(`[DEBUG] ${args.map(a => String(a)).join(' ')}`);
}

export function info(...args: unknown[]): void {
    getChannel().appendLine(`[INFO] ${args.map(a => String(a)).join(' ')}`);
}

export function warn(...args: unknown[]): void {
    getChannel().appendLine(`[WARN] ${args.map(a => String(a)).join(' ')}`);
}

export function error(...args: unknown[]): void {
    getChannel().appendLine(`[ERROR] ${args.map(a => String(a)).join(' ')}`);
}

export function showChannel(preserveFocus = true): void {
    getChannel().show(preserveFocus);
}
