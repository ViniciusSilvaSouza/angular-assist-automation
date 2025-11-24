import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function addDockerSupport(context: vscode.ExtensionContext): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('Nenhum workspace aberto.');
        return;
    }

    const projectPath = workspaceFolder.uri.fsPath;

    // Tenta obter nome do projeto do package.json e sanitizar para Docker service name
    let projectName = 'my-angular-app';
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf8'));
        if (packageJson.name) {
            // Remove caracteres inválidos para service name do Docker Compose (permitido: [a-zA-Z0-9._-])
            projectName = packageJson.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
        }
    } catch {
        // ignore
    }

    // Coletar informações do usuário
    const nameInput = await vscode.window.showInputBox({
        prompt: 'Nome do serviço Docker',
        value: projectName,
        placeHolder: 'angular-app',
        validateInput: (text) => {
            if (!/^[a-zA-Z0-9._-]+$/.test(text)) {
                return 'Nome deve conter apenas letras, números, pontos, sublinhados e hífens.';
            }
            return null;
        }
    });

    if (!nameInput) return;

    const portInput = await vscode.window.showInputBox({
        prompt: 'Porta para expor',
        value: '8080',
        placeHolder: '8080'
    });

    if (!portInput) return;

    try {
        const templatesPath = path.join(context.extensionPath, 'templates', 'docker');

        // Dockerfile
        let dockerfileContent = fs.readFileSync(path.join(templatesPath, 'Dockerfile'), 'utf8');
        dockerfileContent = dockerfileContent.replace(/\[NOME_PROJETO\]/g, nameInput); // Ajuste necessário pois o path do dist depende do nome no angular.json, não necessariamente do serviço
        // OBS: Aqui assume que o nome do projeto no angular.json é o mesmo que o user digitou ou precisaria ler angular.json
        // Melhor ler angular.json para garantir o path correto do dist

        // Ler angular.json para pegar o outputPath correto
        let distPath = `dist/${projectName}`;
        try {
            const angularJson = JSON.parse(fs.readFileSync(path.join(projectPath, 'angular.json'), 'utf8'));
            const defaultProject = angularJson.defaultProject || Object.keys(angularJson.projects)[0];
            const buildOptions = angularJson.projects[defaultProject]?.architect?.build?.options;
            if (buildOptions?.outputPath) {
                distPath = buildOptions.outputPath;
            }
        } catch {
            // fallback
        }

        // Ajustar Dockerfile para usar o path correto do dist
        // O template atual usa: COPY --from=build /app/dist/[NOME_PROJETO]/browser /usr/share/nginx/html
        // Vamos substituir toda a linha do COPY
        const copyLine = `COPY --from=build /app/${distPath} /usr/share/nginx/html`;
        const dockerfileLines = dockerfileContent.split('\n');
        const newDockerfileLines = dockerfileLines.map(line => {
            if (line.includes('COPY --from=build') && line.includes('/usr/share/nginx/html')) {
                return copyLine;
            }
            return line;
        });
        dockerfileContent = newDockerfileLines.join('\n');

        fs.writeFileSync(path.join(projectPath, 'Dockerfile'), dockerfileContent);

        // docker-compose.yml
        let composeContent = fs.readFileSync(path.join(templatesPath, 'docker-compose.yml'), 'utf8');
        composeContent = composeContent
            .replace(/\[NOME_PROJETO\]/g, nameInput)
            .replace(/\[PORTA\]/g, portInput);

        fs.writeFileSync(path.join(projectPath, 'docker-compose.yml'), composeContent);

        vscode.window.showInformationMessage('Arquivos Docker adicionados com sucesso! 🐳');

    } catch (error) {
        vscode.window.showErrorMessage(`Erro ao criar arquivos Docker: ${error}`);
    }
}
