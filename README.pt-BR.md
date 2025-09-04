# Angular Assist - Automação de Ambiente

[![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.103.0+-007ACC.svg)](https://code.visualstudio.com/)

> Extensão do VS Code para automatizar completamente ambientes de desenvolvimento Angular

Uma solução robusta que simplifica a configuração e o gerenciamento de múltiplos projetos Angular em ambientes corporativos, oferecendo automação inteligente, scripts compartilhados e configurações padronizadas.

> Idioma da extensão: o padrão é inglês (en-US). Você pode alterar para português (pt-BR) nas configurações ou pelo comando de troca de linguagem — veja a seção “Idioma da Extensão”.

---

## 🎯 Por que esta extensão?

### O problema
Em ambientes corporativos com múltiplos projetos Angular executando separadamente, os desenvolvedores enfrentam:

- Configuração repetitiva de tasks, debug e scripts por projeto
- Inconsistência de configurações entre projetos e times
- Tempo perdido configurando o ambiente em cada novo projeto/workspace
- Dificuldade em padronizar processos de desenvolvimento
- Scripts dispersos e não reutilizáveis

### A solução
O Angular Assist automatiza completamente a configuração do ambiente, criando:
- ✅ Uma configuração única que se adapta a qualquer projeto Angular
- ✅ Scripts globais reutilizáveis entre todos os projetos
- ✅ Padronização automática de tasks, debug e keybindings
- ✅ Detecção inteligente de configurações existentes
- ✅ Um workflow otimizado para desenvolvimento e debug

---

## 🚀 Funcionalidades

### 🔍 Detecção inteligente
- Detecta automaticamente projetos Angular ao abrir o workspace
- Lê dinamicamente o `angular.json` para inferir padrões
- Valida dependências e estrutura do projeto

### ⚡ Configuração instantânea
- Setup completo em menos de 30 segundos
- Configura automaticamente tasks, launch configs e keybindings
- Scripts PowerShell otimizados para desenvolvimento

### 🔄 Scripts compartilhados
- Scripts globais reutilizáveis entre todos os projetos
- Gerenciamento inteligente de processos Node.js
- Limpeza automática de cache e dados temporários

### 🎛️ Controle total
- Tasks integradas ao VS Code com atalhos úteis
- Debug no Chrome configurado automaticamente
- Reinício de projetos sem perder contexto

---

## 📥 Instalação

Você pode instalar utilizando o arquivo `.vsix` já empacotado:

- `angular-assist-automation-1.0.2.vsix` (recomendado)
- Versões anteriores disponíveis para referência: `1.0.1`, `1.0.0`

> Como instalar o `.vsix` no VS Code:
> 1. Abra o VS Code → Extensions (Ctrl+Shift+X)
> 2. Clique nos “...” no topo → “Install from VSIX...”
> 3. Selecione o arquivo `.vsix`

### ✅ Verificar instalação
Após a instalação:
1. Abra um projeto Angular no VS Code
2. A extensão deve detectar automaticamente e oferecer a configuração
3. Ou use `Ctrl+Shift+P` → `Angular Assist: Configure Automation`

> Dicas:
> - Guarde o `.vsix` para reinstalações futuras
> - Funciona offline após instalado
> - Para atualizar, baixe a nova versão e reinstale o `.vsix`
> - Veja as [releases](https://github.com/ViniciusSilvaSouza/angular-assist-automation/releases) para atualizações

---

## 🎮 Como usar

### 🔧 Setup automático
1. Abra qualquer projeto Angular no VS Code
2. Aceite a configuração quando a extensão detectar o projeto
3. Preencha as informações solicitadas (nome, porta, rota)
4. Pronto! Seu ambiente estará configurado

### 🎯 Setup manual
```
Ctrl+Shift+P → "Angular Assist: Configure Automation"
```

### ⌨️ Atalhos
- **F5** - Iniciar projeto (com debug)
- **Ctrl+Shift+F5** - Reiniciar projeto
- **Ctrl+Alt+S** - Parar todos os processos

---

## 📋 Configuração

Durante o setup, você define:

| Campo | Descrição | Exemplo | Padrão |
|-------|-----------|---------|--------|
| **Nome do projeto** | Identificador único | `meu-projeto-angular` | - |
| **Porta** | Porta do servidor dev | `4200` | `4200` |
| **Porta de debug** | Porta do Chrome para debug | `9222` | `9222` |
| **Rota** | Rota base da aplicação | `/estudantes` | auto-detectado |

> Dica: a rota é lida automaticamente do `angular.json` quando disponível

---

## 📁 Estrutura criada

### 🏠 No projeto (workspace)
```
.vscode/
├── tasks.json            # 6 tasks otimizadas para Angular
├── launch.json           # Configuração de debug no Chrome
├── keybindings.json      # Atalhos personalizados
└── settings.json         # Configurações específicas do projeto
```

### 🌐 Global (sistema)
```
%APPDATA%/Code/User/globalStorage/angular-assist-automation/
└── scripts/              # Scripts PowerShell compartilhados
    ├── start-projeto-vscode.ps1    # Iniciar com debug integrado
    ├── start-projeto.ps1           # Início standalone
    ├── restart-projeto.ps1         # Reinício inteligente
    ├── stop-all-processes.ps1      # Parada completa e limpeza
    └── clean-chrome.ps1            # Limpeza de dados do Chrome
```

---

## 🛠️ Tasks disponíveis

| Task | Atalho | Descrição |
|------|--------|-----------|
| **Start Projeto** | `F5` | Inicia o projeto com debug automático |
| **🔄 Restart Projeto** | `Ctrl+Shift+F5` | Reinicia sem perder contexto |
| **🛑 Stop All Processes** | `Ctrl+Alt+S` | Para todos os processos relacionados |
| **🌐 Clean Chrome** | - | Limpa dados específicos do projeto |
| **ng serve** | - | Comando padrão do Angular CLI |
| **ng build** | - | Build de produção |

---

### 🌐 Idioma da extensão
O idioma padrão é inglês. Para alterar:

```jsonc
// settings.json (Usuário ou Workspace)
{
  "angular-assist.language": "pt-BR" // valores possíveis: "en-US" | "pt-BR"
}
```

Ou via Command Palette:

```
Ctrl+Shift+P → "Angular Assist: Change Language"
```

---

### 📝 Exemplo de settings.json
```json
{
  "angular-assist.automation": {
    "meu-projeto": {
      "projectName": "meu-projeto",
      "port": "4200",
      "debugPort": "9222",
      "route": "/estudantes",
      "workspacePath": "C:\\Dev\\meu-projeto",
      "globalScriptsPath": "C:\\Users\\usuario\\AppData\\...\\scripts"
    }
  }
}
```

### 🎛️ Exemplo de tasks.json (gerado)
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Projeto - meu-projeto (Angular Assist)",
      "type": "shell",
      "command": "powershell.exe",
      "args": ["..."],
      "group": { "kind": "build", "isDefault": true },
      "isBackground": true
    }
    // ... outras tasks
  ]
}
```

---

## 🏗️ Arquitetura

### 📦 Estrutura de código
```
src/
├── commands/                 # Comandos da extensão
│   ├── detectProject.ts      # Detecção de projetos Angular
│   └── setupAutomation.ts    # Configuração automática
├── constants/                # Constantes e textos
│   └── texts.ts              # Sistema central de textos (i18n)
├── templates/                # Templates de configuração
│   ├── tasks.json            # Template de tasks
│   ├── launch.json           # Template de debug
│   ├── settings.json         # Template de settings
│   ├── keybindings.json      # Template de atalhos
│   └── scripts/              # Scripts PowerShell
└── types/                    # Definições TypeScript
    ├── index.ts              # Re-exports centralizados
    ├── project.ts            # Tipos de projeto
    ├── vscode.ts             # Tipos VS Code
    └── packageAndAngular.ts  # Tipos de package.json/angular.json
```

### 🧩 Sistema de textos
```typescript
// Textos organizados por categoria
TEXTS.ERRORS.PROJECT_NOT_FOUND
TEXTS.PROMPTS.PROJECT_NAME
TEXTS.MESSAGES.SETUP_COMPLETE
TEXTS.TASKS.START_PROJECT

// Funções utilitárias
buildText.setupComplete(projectName)
buildText.startingProject(projectName)
```

### 🔄 Fluxo de configuração
1. Detecção → Verifica se é um projeto Angular
2. Validação → Analisa package.json e angular.json
3. Coleta → Solicita informações ao usuário
4. Geração → Cria arquivos de configuração
5. Instalação → Copia scripts globais
6. Finalização → Configura o workspace

---

## 🔧 Desenvolvimento

### 📋 Pré-requisitos
- Node.js 18+
- npm 8+
- VS Code 1.103.0+
- TypeScript 5.0+
- PowerShell (Windows)

### 🚀 Setup de desenvolvimento
```bash
# 1. Clone o repositório
git clone https://github.com/ViniciusSilvaSouza/angular-assist-automation.git
cd angular-assist-automation

# 2. Instale as dependências
npm install

# 3. Compile em modo watch
npm run watch

# 4. Teste a extensão
# Pressione F5 no VS Code para abrir o Development Host
```

### 🔍 Scripts disponíveis
```bash
npm run compile       # Compilar TypeScript
npm run watch         # Watch mode para desenvolvimento
npm run lint          # Lint com ESLint
npm run package       # Gerar .vsix
npm run publish       # Publicar no marketplace
```

### 🧪 Testes
```bash
# Testar com um projeto Angular local
# 1. Inicie a extensão (F5)
# 2. Abra um projeto Angular na nova janela
# 3. Exercite as funcionalidades
```

### 📦 Releases
```bash
# Para criar uma nova release:
# 1. Atualize a versão no package.json
# 2. Compile e gere o VSIX
npm run compile
npm run package

# 3. Crie a tag
git tag v1.0.2
git push origin v1.0.2

# 4. Crie a release no GitHub com o .vsix
```

---

## 🤝 Contribuição

### 🎯 Como contribuir
1. Faça um fork do repositório
2. Crie uma branch de feature (`git checkout -b feature/AmazingFeature`)
3. Faça commits (`git commit -m 'feat: add AmazingFeature'`)
4. Faça push (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### 📝 Diretrizes
- Siga o padrão de código existente
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits semânticos (feat:, fix:, docs:)

### 🐛 Reporte bugs
Use o [GitHub Issues](https://github.com/ViniciusSilvaSouza/angular-assist-automation/issues) com:
- Descrição clara do problema
- Passos para reproduzir
- Versões do VS Code e da extensão
- Logs de erro (se houver)

---

## 📊 Roadmap

### 🎯 v1.0.2
- [ ] Publicação no VS Code Marketplace
- [ ] Melhorias de documentação baseadas em feedback
- [ ] Correções de bugs reportados pela comunidade

### 🚀 v1.1.0 (Futuro próximo)
- [ ] Suporte a workspace multi-root
- [ ] Configurações por projeto via UI
- [ ] Templates de projeto customizáveis
- [ ] Integração com Git hooks

### 🌟 v1.2.0 (Futuro)
- [ ] Suporte a outros frameworks (React, Vue)
- [ ] Dashboard de status dos projetos
- [ ] Métricas de desenvolvimento
- [ ] Sincronização em nuvem

### 💡 Ideias em avaliação
- [ ] Suporte a Docker
- [ ] Integração com CI/CD
- [ ] Plugins para outros editores
- [ ] Modo colaborativo

---

## 📝 Changelog

### v1.0.0 (2025-09-03)
#### ✨ Funcionalidades
- ✅ Detecção automática de projetos Angular
- ✅ Configuração completa do ambiente VS Code
- ✅ Scripts PowerShell otimizados e reutilizáveis
- ✅ Sistema centralizado de textos
- ✅ Leitura dinâmica de configurações
- ✅ Normalização automática de rotas
- ✅ 6 tasks pré-configuradas
- ✅ Debug integrado com o Chrome
- ✅ Atalhos de teclado personalizados

#### 🏗️ Arquitetura
- ✅ Estrutura modular em TypeScript
- ✅ Sistema de tipos organizado
- ✅ Templates reutilizáveis
- ✅ Constantes centralizadas

---

## 🛡️ Licença

Este projeto está licenciado sob a **MIT License** — veja [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Vinícius Silva Souza**
- GitHub: [@ViniciusSilvaSouza](https://github.com/ViniciusSilvaSouza)
- Email: viniciussss@outlook.com.br

---

## 🙏 Agradecimentos

- Comunidade Angular pela inspiração
- Equipe do VS Code pelas APIs extensíveis
- Colegas pelos feedbacks valiosos

---

### ⭐ Se este projeto te ajudou, considere deixar uma estrela!

**[⬆ Voltar ao topo](#angular-assist---automação-de-ambiente)**
