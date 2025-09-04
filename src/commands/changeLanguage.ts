import * as vscode from 'vscode';
import { setLocale, Locale, TEXTS } from '../constants/texts';

export async function changeLanguage(): Promise<void> {
    const options: Array<{ label: string; value: Locale }> = [
        { label: TEXTS.LANGUAGE.ENGLISH_LABEL, value: 'en-US' },
        { label: TEXTS.LANGUAGE.PORTUGUESE_LABEL, value: 'pt-BR' }
    ];

    const pick = await vscode.window.showQuickPick(options.map(o => o.label), {
        placeHolder: TEXTS.LANGUAGE.SELECT_PLACEHOLDER,
        ignoreFocusOut: true
    });

    if (!pick) return;

    const selected = options.find(o => o.label === pick)?.value ?? 'en-US';

    await vscode.workspace.getConfiguration('angular-assist').update('language', selected, vscode.ConfigurationTarget.Global);
    setLocale(selected);

    vscode.window.showInformationMessage(TEXTS.LANGUAGE.CHANGED_TO);
}
