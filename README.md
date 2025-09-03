# Angular Assist - Environment Automation

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.103.0+-007ACC.svg)](https://code.visualstudio.com/)

> **Extensão do VS Code para automatizar completamente o ambiente de desenvolvimento de projetos Angular**

Uma solução robusta que resolve os desafios de configuração e gerenciamento de múltiplos projetos Angular em ambientes corporativos, oferecendo automação inteligente, scripts compartilhados e configurações padronizadas.

---

## 🎯 Por que esta extensão?

### O Problema
Em ambientes corporativos com múltiplos projetos Angular executando separadamente, desenvolvedores enfrentam:

- **Configuração repetitiva** de tarefas, debug e scripts para cada projeto
- **Inconsistência** nas configurações entre projetos e desenvolvedores
- **Perda de tempo** configurando ambiente a cada novo projeto ou workspace
- **Dificuldade de padronização** de processos de desenvolvimento
- **Scripts dispersos** e não reutilizáveis entre projetos

### A Solução
Angular Assist automatiza completamente a configuração do ambiente, criando:
- ✅ **Configuração única** que se adapta a qualquer projeto Angular
- ✅ **Scripts globais reutilizáveis** entre todos os projetos
- ✅ **Padronização automática** de tarefas, debug e keybindings
- ✅ **Detecção inteligente** de configurações existentes
- ✅ **Workflow otimizado** para desenvolvimento e debug

---

## 🚀 Funcionalidades

### 🔍 **Detecção Inteligente**
- Detecção automática de projetos Angular ao abrir workspace
- Leitura dinâmica do `angular.json` para configurações padrão
- Validação de dependências e estrutura do projeto

### ⚡ **Configuração Instantânea**
- Setup completo em menos de 30 segundos
- Configuração automática de tasks, launch configs e keybindings
- Scripts PowerShell otimizados para desenvolvimento

### 🔄 **Scripts Compartilhados**
- Scripts globais reutilizáveis entre todos os projetos
- Gerenciamento inteligente de processos Node.js
- Limpeza automática de cache e dados temporários

### 🎛️ **Controle Completo**
- Tasks integradas ao VS Code com atalhos configurados
- Debug Chrome com configuração automática
- Restart de projetos sem perder contexto

---

## 📥 Instalação

### 📦 **Opção 1: Download Direto (Recomendado)**

1. **Baixe a extensão**:
   - Acesse a [página de releases](https://github.com/ViniciusSilvaSouza/angular-assist-automation/releases)
   - Baixe o arquivo `angular-assist-automation-1.0.0.vsix` da versão mais recente

2. **Instale no VS Code**:
   ```bash
   # Via linha de comando
   code --install-extension angular-assist-automation-1.0.0.vsix
   ```
   
   **OU**
   
   - Abra o VS Code
   - Pressione `Ctrl+Shift+P`
   - Digite: `Extensions: Install from VSIX...`
   - Selecione o arquivo `.vsix` baixado
   - Reinicie o VS Code se solicitado

### 🔧 **Opção 2: Compilação Local**

```bash
# 1. Clone o repositório
git clone https://github.com/ViniciusSilvaSouza/angular-assist-automation.git
cd angular-assist-automation

# 2. Instale dependências
npm install

# 3. Compile o projeto
npm run compile

# 4. Gere o pacote VSIX
npm run package

# 5. Instale a extensão gerada
code --install-extension angular-assist-automation-1.0.0.vsix
```

### ✅ **Verificar Instalação**
Após a instalação:
1. Abra um projeto Angular no VS Code
2. A extensão deve detectar automaticamente e oferecer configuração
3. Ou use `Ctrl+Shift+P` → `Angular Assist: Configurar Automação`

> 💡 **Dicas Importantes:**
> - Mantenha o arquivo `.vsix` salvo para reinstalações futuras
> - A extensão funciona offline após instalada
> - Para atualizar, baixe a nova versão e reinstale pelo mesmo processo
> - Verifique as [releases](https://github.com/ViniciusSilvaSouza/angular-assist-automation/releases) regularmente para atualizações

---

## 🎮 Como Usar

### 🔧 **Setup Automático**
1. **Abra qualquer projeto Angular** no VS Code
2. **Aceite a configuração** quando a extensão detectar o projeto
3. **Preencha as informações** solicitadas (nome, porta, rota)
4. **Pronto!** Ambiente configurado e pronto para uso

### 🎯 **Setup Manual**
```
Ctrl+Shift+P → "Angular Assist: Configurar Automação"
```

### ⌨️ **Atalhos Configurados**
- **F5** - Iniciar projeto (com debug)
- **Ctrl+Shift+F5** - Restart projeto
- **Ctrl+Alt+S** - Stop todos os processos

---

## 📋 Configuração

Durante o setup, você configura:

| Campo | Descrição | Exemplo | Padrão |
|-------|-----------|---------|--------|
| **Nome do Projeto** | Identificador único | `meu-projeto-angular` | - |
| **Porta** | Porta do servidor dev | `4200` | `4200` |
| **Porta Debug** | Porta do Chrome debug | `9222` | `9222` |
| **Rota** | Rota base da aplicação | `/estudantes` | auto-detectado |

> 💡 **Dica**: A rota é automaticamente lida do `angular.json` quando disponível

---

## 📁 Estrutura Criada

### 🏠 **No Projeto (Workspace)**
```
.vscode/
├── tasks.json            # 6 tarefas otimizadas para Angular
├── launch.json           # Configuração de debug Chrome
├── keybindings.json      # Atalhos personalizados
└── settings.json         # Configurações específicas do projeto
```

### 🌐 **Global (Sistema)**
```
%APPDATA%/Code/User/globalStorage/angular-assist-automation/
└── scripts/              # Scripts PowerShell compartilhados
    ├── start-projeto-vscode.ps1    # Iniciar com debug integrado
    ├── start-projeto.ps1           # Iniciar standalone
    ├── restart-projeto.ps1         # Restart inteligente
    ├── stop-all-processes.ps1      # Stop completo e limpeza
    └── clean-chrome.ps1            # Limpeza de dados Chrome
```

---

## 🛠️ Tarefas Disponíveis

| Tarefa | Atalho | Descrição |
|--------|--------|-----------|
| **Start Projeto** | `F5` | Inicia o projeto com debug automático |
| **🔄 Restart Projeto** | `Ctrl+Shift+F5` | Restart sem perder contexto |
| **🛑 Stop All Processes** | `Ctrl+Alt+S` | Para todos os processos relacionados |
| **🌐 Clean Chrome** | - | Limpa dados específicos do projeto |
| **ng serve** | - | Comando Angular CLI padrão |
| **ng build** | - | Build de produção |

---

## ⚙️ Configurações

### 📝 **settings.json**
```json
{
  "angular-assist.automation": {
    "meu-projeto": {
      "projectName": "meu-projeto",
      "port": "4200",
      "debugPort": "9222", 
      "route": "/estudantes",
      "workspacePath": "C:\\Dev\\meu-projeto",
      "globalScriptsPath": "C:\\Users\\user\\AppData\\...\\scripts"
    }
  }
}
```

### 🎛️ **tasks.json (gerado)**
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

### 📦 **Estrutura do Código**
```
src/
├── commands/                 # Comandos da extensão
│   ├── detectProject.ts     # Detecção de projetos Angular
│   └── setupAutomation.ts   # Configuração automática
├── constants/               # Constantes e textos
│   └── texts.ts            # Sistema centralizado de textos
├── templates/              # Templates de configuração
│   ├── tasks.json          # Template de tarefas
│   ├── launch.json         # Template de debug
│   ├── settings.json       # Template de settings
│   ├── keybindings.json    # Template de atalhos
│   └── scripts/            # Scripts PowerShell
└── types/                  # Definições TypeScript
    ├── index.ts           # Re-exports centralizados
    ├── project.ts         # Tipos de projeto
    ├── vscode.ts          # Tipos VS Code
    └── packageAndAngular.ts # Tipos package.json/angular.json
```

### 🧩 **Sistema de Textos**
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

### 🔄 **Fluxo de Configuração**
1. **Detecção** → Verifica se é projeto Angular
2. **Validação** → Analisa package.json e angular.json  
3. **Coleta** → Solicita informações do usuário
4. **Geração** → Cria arquivos de configuração
5. **Instalação** → Copia scripts globais
6. **Finalização** → Configura workspace

---

## 🔧 Desenvolvimento

### 📋 **Pré-requisitos**
- **Node.js** 18+ 
- **npm** 8+
- **VS Code** 1.103.0+
- **TypeScript** 5.0+
- **PowerShell** (Windows)

### 🚀 **Setup de Desenvolvimento**
```bash
# 1. Clone o repositório
git clone https://github.com/ViniciusSilvaSouza/angular-assist-automation.git
cd angular-assist-automation

# 2. Instale dependências
npm install

# 3. Compile em modo watch
npm run watch

# 4. Teste a extensão
# Pressione F5 no VS Code para abrir instância de desenvolvimento
```

### 🔍 **Scripts Disponíveis**
```bash
npm run compile       # Compilar TypeScript
npm run watch         # Watch mode para desenvolvimento
npm run lint          # Verificar código com ESLint
npm run package       # Gerar arquivo .vsix
npm run publish       # Publicar no marketplace
```

### 🧪 **Testing**
```bash
# Testar em projeto Angular local
# 1. Abra a extensão em development (F5)
# 2. Abra um projeto Angular na nova janela
# 3. Teste as funcionalidades
```

### 📦 **Criando Releases**
```bash
# Para criar uma nova release:
# 1. Atualize a versão no package.json
# 2. Compile e gere o VSIX
npm run compile
npm run package

# 3. Crie uma tag no Git
git tag v1.0.0
git push origin v1.0.0

# 4. Crie uma release no GitHub com o arquivo .vsix
```

---

## 🤝 Contribuição

### 🎯 **Como Contribuir**

1. **🍴 Fork** o repositório
2. **🌿 Branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **💾 Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **🚀 Push** para a branch (`git push origin feature/AmazingFeature`)
5. **🔀 Pull Request** para revisão

### 📝 **Diretrizes**

- ✅ Siga o padrão de código existente
- ✅ Adicione testes para novas funcionalidades  
- ✅ Atualize documentação quando necessário
- ✅ Use commits semânticos (feat:, fix:, docs:)

### 🐛 **Reportar Bugs**

Use o [GitHub Issues](https://github.com/ViniciusSilvaSouza/angular-assist-automation/issues) com:
- Descrição clara do problema
- Passos para reproduzir
- Versão do VS Code e da extensão
- Logs de erro (se houver)

---

## 📊 Roadmap

### 🎯 **v1.0.1** (Próxima versão)
- [ ] **Publicação no VS Code Marketplace** para instalação direta
- [ ] Melhorias na documentação baseadas em feedback
- [ ] Correções de bugs reportados pela comunidade

### 🚀 **v1.1.0** (Futuro próximo)
- [ ] Suporte para workspace multi-root
- [ ] Configurações por projeto via UI
- [ ] Templates de projeto customizáveis
- [ ] Integração com Git hooks

### 🌟 **v1.2.0** (Futuro)
- [ ] Suporte para outros frameworks (React, Vue)
- [ ] Dashboard de status de projetos
- [ ] Métricas de desenvolvimento
- [ ] Sincronização em nuvem

### 💡 **Ideias em Avaliação**
- [ ] Suporte para Docker
- [ ] Integração com CI/CD
- [ ] Plugin para outros editores
- [ ] Modo colaborativo

---

## 📝 Changelog

### v1.0.0 (2025-09-03)
#### ✨ Features
- ✅ Detecção automática de projetos Angular
- ✅ Configuração completa de ambiente VS Code
- ✅ Scripts PowerShell otimizados e reutilizáveis
- ✅ Sistema de textos centralizados
- ✅ Leitura dinâmica de configurações
- ✅ Normalização automática de rotas
- ✅ 6 tarefas pré-configuradas
- ✅ Debug integrado com Chrome
- ✅ Atalhos de teclado personalizados

#### 🏗️ Architecture
- ✅ Estrutura modular TypeScript
- ✅ Sistema de tipos organizados
- ✅ Templates reutilizáveis
- ✅ Constantes centralizadas

---

## 🛡️ Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Vinícius Silva Souza**
- GitHub: [@ViniciusSilvaSouza](https://github.com/ViniciusSilvaSouza)
- Email: viniciussss@outlook.com.br

---

## 🙏 Agradecimentos

- Comunidade Angular pela inspiração
- Equipe do VS Code pelas APIs extensíveis
- Colegas de trabalho pelos feedbacks valiosos

---

<div align="center">

### ⭐ Se este projeto te ajudou, considere dar uma estrela!

**[⬆ Voltar ao topo](#angular-assist---environment-automation)**

</div>
