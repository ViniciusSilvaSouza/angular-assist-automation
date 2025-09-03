# Angular Assist - Environment Automation

Extensão do VS Code para automatizar a configuração de ambiente para projetos Angular com sistema avançado de gerenciamento de textos e configurações dinâmicas.

## Funcionalidades

- **Detecção automática de projetos Angular**: A extensão detecta automaticamente quando você abre um projeto Angular e oferece configuração automática.
- **Configuração rápida**: Configure rapidamente tarefas do VS Code, configurações de debug e scripts PowerShell para automação.
- **Scripts compartilhados**: Os scripts PowerShell são armazenados em uma pasta comum e reutilizados entre projetos.
- **Configuração por projeto**: As configurações específicas de cada projeto são armazenadas no `settings.json` do workspace.
- **Textos centralizados**: Sistema organizado de constantes para facilitar manutenção e localização.
- **Leitura dinâmica de configurações**: Lê automaticamente o `baseHref` do `angular.json` para configuração padrão da rota.
- **Normalização automática**: Remove barras finais das rotas automaticamente.

## Como usar

1. **Instalação**: Instale a extensão através do arquivo .vsix gerado
2. **Detecção automática**: Ao abrir um projeto Angular, a extensão oferecerá automaticamente a configuração
3. **Configuração manual**: Use o comando `Angular Assist: Configurar Automação` na paleta de comandos (Ctrl+Shift+P)

## Configuração

Durante a configuração, você será solicitado a fornecer:

- **Nome do Projeto**: Nome identificador do projeto
- **Porta**: Porta para o servidor Angular (padrão: 4200)  
- **Porta de Debug**: Porta para debug do Chrome (padrão: 9222)
- **Rota**: Rota da aplicação (lida automaticamente do angular.json, ex: /projetoxyz)

## Estrutura criada

A extensão cria a seguinte estrutura:

**No projeto:**
```
.vscode/
├── tasks.json            # Tarefas do VS Code
├── launch.json           # Configurações de debug
├── keybindings.json      # Atalhos de teclado
└── settings.json         # Configurações específicas do projeto
```

**Globalmente (pasta do usuário):**
```
%APPDATA%/Code/User/globalStorage/angular-assist-automation/
└── scripts/              # Scripts PowerShell compartilhados entre todos os projetos
    ├── start-projeto-vscode.ps1
    ├── start-projeto.ps1
    ├── restart-projeto.ps1
    ├── stop-all-processes.ps1
    └── clean-chrome.ps1
```

## Comandos disponíveis

- `Angular Assist: Detectar Projeto Angular` - Verifica se o projeto atual é Angular
- `Angular Assist: Configurar Automação` - Configura a automação para o projeto atual

## Tarefas criadas

- **Start Projeto - [NOME_PROJETO] (Angular Assist)** - Inicia o projeto (F5)
- **🔄 Restart Projeto - [NOME_PROJETO]** - Reinicia o projeto
- **🛑 Stop All Processes** - Para todos os processos do projeto
- **🌐 Clean Chrome [NOME_PROJETO]** - Limpa dados do Chrome específicos do projeto
- **ng serve** - Comando ng serve padrão
- **ng build** - Comando ng build padrão

## Configurações no settings.json

As configurações específicas do projeto são armazenadas no formato:

```json
{
  "angular-assist.automation": {
    "nome-do-projeto": {
      "projectName": "nome-do-projeto",
      "port": "4200",
      "debugPort": "9222",
      "route": "/rota",
      "workspacePath": "C:\\caminho\\do\\projeto",
      "globalScriptsPath": "C:\\Users\\usuario\\AppData\\Roaming\\Code\\User\\globalStorage\\angular-assist-automation\\scripts"
    }
  }
}
```

## Arquitetura Interna

### Sistema de Textos Centralizados

A extensão utiliza um sistema organizado de constantes de texto em `src/constants/texts.ts`:

**Categorias disponíveis:**
- `TEXTS.ERRORS`: Mensagens de erro
- `TEXTS.PROMPTS`: Prompts de entrada do usuário  
- `TEXTS.MESSAGES`: Mensagens informativas
- `TEXTS.TASKS`: Labels das tarefas VS Code
- `TEXTS.SCRIPTS`: Mensagens dos scripts PowerShell
- `TEXTS.EXTENSION`: Informações da extensão
- `TEXTS.SCRIPT_FILES`: Nomes dos arquivos de script

**Funções auxiliares:**
```typescript
buildText.setupComplete(projectName) // "Configuração para [projeto] criada com sucesso!"
buildText.startingProject(projectName) // "Iniciando o projeto [projeto] - Angular Assist..."
```

### Leitura Dinâmica de Configurações

A extensão lê automaticamente:
- **baseHref** do `angular.json` para configurar rota padrão
- **Dependências** do `package.json` para validar projetos Angular
- **Configurações existentes** no `settings.json` para evitar duplicações

### Normalização Automática

- Remove barras finais das rotas (ex: "/estudante/" → "/estudante")
- Preserva rota raiz "/" quando necessário
- Aplica configurações consistentes entre projetos

## Requisitos

- Node.js instalado
- Angular CLI instalado globalmente
- Visual Studio Code
- PowerShell (Windows)

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Faça um pull request

## Licença

MIT License
