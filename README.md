# Angular Assist - Environment Automation

[![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.103.0+-007ACC.svg)](https://code.visualstudio.com/)

> VS Code extension to fully automate Angular development environments

A robust solution that streamlines setup and management of multiple Angular projects in corporate environments by providing smart automation, shared scripts, and standardized configurations.

---

## 🎯 Why this extension?

### The problem
In corporate environments with multiple Angular projects running separately, developers face:

- Repetitive setup of tasks, debug, and scripts per project
- Inconsistent configurations between projects and developers
- Time wasted configuring the environment for each new project/workspace
- Difficulty standardizing development processes
- Scattered, non-reusable scripts across projects

### The solution
Angular Assist fully automates environment setup by creating:
- ✅ A single configuration that adapts to any Angular project
- ✅ Reusable global scripts shared across all projects
- ✅ Automatic standardization of tasks, debug, and keybindings
- ✅ Smart detection of existing configurations
- ✅ An optimized workflow for development and debugging

---

## 🚀 Features

### 🔍 Smart detection
- Automatically detects Angular projects on workspace open
- Dynamically reads `angular.json` to infer defaults
- Validates dependencies and project structure

### ⚡ Instant setup
- Complete setup in under 30 seconds
- Auto-configures tasks, launch configs, and keybindings
- Optimized PowerShell scripts for development

### 🔄 Shared scripts
- Reusable global scripts shared across all projects
- Smart management of Node.js processes
- Automatic cleanup of cache and temporary data

### 🎛️ Full control
- VS Code Tasks integrated with handy shortcuts
- Chrome debugging auto-configured
- Restart projects without losing context

---

## 📥 Installation

### 📦 Option 1: Direct Download (Recommended)

1. Download the extension:
  - Go to the [releases page](https://github.com/ViniciusSilvaSouza/angular-assist-automation/releases)
  - Download the `angular-assist-automation-1.0.2.vsix` from the latest release

2. Install in VS Code:
  ```bash
  code --install-extension angular-assist-automation-1.0.2.vsix
  ```
   
  Or:
  - Open VS Code
  - Press `Ctrl+Shift+P`
  - Type: `Extensions: Install from VSIX...`
  - Select the downloaded `.vsix`
  - Reload if prompted

### 🔧 Option 2: Local Build

```bash
# 1. Clone the repo
git clone https://github.com/ViniciusSilvaSouza/angular-assist-automation.git
cd angular-assist-automation

# 2. Install dependencies
npm install

# 3. Compile the project
npm run compile

# 4. Package VSIX
npm run package

# 5. Install the generated extension
code --install-extension angular-assist-automation-1.0.2.vsix
```

### ✅ Verify Installation
After installing:
1. Open an Angular project in VS Code
2. The extension should auto-detect and offer to configure your environment
3. Or use `Ctrl+Shift+P` → `Angular Assist: Configure Automation`

> Tips:
> - Keep the `.vsix` file for future reinstalls
> - Works offline after installation
> - To update, download the new version and reinstall the `.vsix`
> - Check the [releases](https://github.com/ViniciusSilvaSouza/angular-assist-automation/releases) for updates

---

## 🎮 How to Use

### 🔧 Automatic Setup
1. Open any Angular project in VS Code
2. Accept the configuration prompt when detected
3. Provide the requested info (name, port, route)
4. Done! Your environment is ready

### 🎯 Manual Setup
```
Ctrl+Shift+P → "Angular Assist: Configure Automation"
```

### ⌨️ Keybindings
- **F5** - Start project (with debug)
- **Ctrl+Shift+F5** - Restart project
- **Ctrl+Alt+S** - Stop all processes

---

## 📋 Configuration

During setup, you'll configure:

| Field | Description | Example | Default |
|-------|-------------|---------|---------|
| **Project name** | Unique identifier | `my-angular-project` | - |
| **Port** | Dev server port | `4200` | `4200` |
| **Debug port** | Chrome debug port | `9222` | `9222` |
| **Route** | Application base route | `/students` | auto-detected |

> Tip: The route is auto-read from `angular.json` when available

---

## 📁 Created Structure

### 🏠 In the project (workspace)
```
.vscode/
├── tasks.json            # 6 optimized tasks for Angular
├── launch.json           # Chrome debug configuration
├── keybindings.json      # Custom keybindings
└── settings.json         # Project-specific settings
```

### 🌐 Global (system)
```
%APPDATA%/Code/User/globalStorage/angular-assist-automation/
└── scripts/              # Shared PowerShell scripts
  ├── start-projeto-vscode.ps1    # Start with integrated debug
  ├── start-projeto.ps1           # Standalone start
  ├── restart-projeto.ps1         # Smart restart
  ├── stop-all-processes.ps1      # Complete stop and cleanup
  └── clean-chrome.ps1            # Chrome data cleanup
```

---

## 🛠️ Available Tasks

| Task | Shortcut | Description |
|------|----------|-------------|
| **Start Project** | `F5` | Starts the project with automatic debugging |
| **🔄 Restart Project** | `Ctrl+Shift+F5` | Restart without losing context |
| **🛑 Stop All Processes** | `Ctrl+Alt+S` | Stop all related processes |
| **🌐 Clean Chrome** | - | Clean project-specific data |
| **ng serve** | - | Standard Angular CLI command |
| **ng build** | - | Production build |

---

## ⚙️ Configurações

### 🌐 Extension Language
Default language is English. Change it:

```json
// settings.json (User or Workspace)
{
  "angular-assist.language": "en-US" // or "pt-BR"
}
```

Or via command palette:

```
Ctrl+Shift+P → Angular Assist: Change Language
```

### 📝 settings.json
```json
{
  "angular-assist.automation": {
    "my-project": {
      "projectName": "my-project",
      "port": "4200",
      "debugPort": "9222", 
      "route": "/students",
      "workspacePath": "C:\\Dev\\my-project",
      "globalScriptsPath": "C:\\Users\\user\\AppData\\...\\scripts"
    }
  }
}
```

### 🎛️ tasks.json (generated)
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Project - my-project (Angular Assist)",
      "type": "shell",
      "command": "powershell.exe",
      "args": ["..."],
      "group": { "kind": "build", "isDefault": true },
      "isBackground": true
    }
    // ... other tasks
  ]
}
```

---

## 🏗️ Architecture

### 📦 Code structure
```
src/
├── commands/                 # Extension commands
│   ├── detectProject.ts      # Angular project detection
│   └── setupAutomation.ts    # Automatic setup
├── constants/                # Constants and texts
│   └── texts.ts              # Central text system (i18n)
├── templates/                # Config templates
│   ├── tasks.json            # Tasks template
│   ├── launch.json           # Debug template
│   ├── settings.json         # Settings template
│   ├── keybindings.json      # Keybindings template
│   └── scripts/              # PowerShell scripts
└── types/                    # TypeScript definitions
  ├── index.ts              # Central re-exports
  ├── project.ts            # Project types
  ├── vscode.ts             # VS Code types
  └── packageAndAngular.ts  # package.json/angular.json types
```

### 🧩 Text system
```typescript
// Texts organized by category
TEXTS.ERRORS.PROJECT_NOT_FOUND
TEXTS.PROMPTS.PROJECT_NAME
TEXTS.MESSAGES.SETUP_COMPLETE
TEXTS.TASKS.START_PROJECT

// Helper functions
buildText.setupComplete(projectName)
buildText.startingProject(projectName) 
```

### 🔄 Setup flow
1. Detection → Check if it’s an Angular project
2. Validation → Analyze package.json and angular.json  
3. Input → Ask user for project info
4. Generation → Create configuration files
5. Installation → Copy global scripts
6. Finalization → Configure workspace

---

## 🔧 Development

### 📋 Prerequisites
- Node.js 18+
- npm 8+
- VS Code 1.103.0+
- TypeScript 5.0+
- PowerShell (Windows)

### 🚀 Dev setup
```bash
# 1. Clone the repository
git clone https://github.com/ViniciusSilvaSouza/angular-assist-automation.git
cd angular-assist-automation

# 2. Install dependencies
npm install

# 3. Compile in watch mode
npm run watch

# 4. Test the extension
# Press F5 in VS Code to open the development host
```

### 🔍 Available scripts
```bash
npm run compile       # Compile TypeScript
npm run watch         # Watch mode
npm run lint          # Lint with ESLint
npm run package       # Generate .vsix
npm run publish       # Publish to marketplace
```

### 🧪 Testing
```bash
# Test with a local Angular project
# 1. Launch the extension (F5)
# 2. Open an Angular project in the new window
# 3. Exercise the features
```

### 📦 Creating Releases
```bash
# To create a new release:
# 1. Update the version in package.json
# 2. Compile and generate the VSIX
npm run compile
npm run package

# 3. Create a Git tag
git tag v1.0.2
git push origin v1.0.2

# 4. Create a GitHub release with the .vsix
```

---

## 🤝 Contributing

### 🎯 How to contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 Guidelines

- Follow the existing coding style
- Add tests for new features
- Update docs when necessary
- Use semantic commits (feat:, fix:, docs:)

### 🐛 Reporting bugs

Use [GitHub Issues](https://github.com/ViniciusSilvaSouza/angular-assist-automation/issues) with:
- Clear problem description
- Steps to reproduce
- VS Code and extension version
- Error logs (if any)

---

## 📊 Roadmap

### 🎯 v1.0.2
- [ ] Publish on VS Code Marketplace
- [ ] Documentation improvements based on feedback
- [ ] Bug fixes reported by the community

### 🚀 v1.1.0 (Near future)
- [ ] Multi-root workspace support
- [ ] Per-project settings via UI
- [ ] Customizable project templates
- [ ] Git hooks integration

### 🌟 v1.2.0 (Future)
- [ ] Support for other frameworks (React, Vue)
- [ ] Project status dashboard
- [ ] Development metrics
- [ ] Cloud sync

### 💡 Ideas under consideration
- [ ] Docker support
- [ ] CI/CD integration
- [ ] Plugins for other editors
- [ ] Collaborative mode

---

## 📝 Changelog

### v1.0.0 (2025-09-03)
#### ✨ Features
- ✅ Auto-detection of Angular projects
- ✅ Complete VS Code environment setup
- ✅ Optimized and reusable PowerShell scripts
- ✅ Centralized text system
- ✅ Dynamic configuration reading
- ✅ Automatic route normalization
- ✅ 6 preconfigured tasks
- ✅ Integrated Chrome debug
- ✅ Custom keyboard shortcuts

#### 🏗️ Architecture
- ✅ Modular TypeScript structure
- ✅ Organized type system
- ✅ Reusable templates
- ✅ Centralized constants

---

## 🛡️ License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Vinícius Silva Souza**
- GitHub: [@ViniciusSilvaSouza](https://github.com/ViniciusSilvaSouza)
- Email: viniciussss@outlook.com.br

---

## 🙏 Acknowledgements

- Angular community for the inspiration
- VS Code team for the extensible APIs
- Colleagues for valuable feedback

---

<div align="center">

### ⭐ If this project helped you, please consider giving it a star!

**[⬆ Back to top](#angular-assist---environment-automation)**

</div>
