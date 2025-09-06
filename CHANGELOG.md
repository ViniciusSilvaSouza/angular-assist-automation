# CHANGELOG

## [1.0.2] - 2025-09-06

### Added
- Command: Angular Assist: Change Language (`angular-assist.changeLanguage`)
- Configuration setting: `angular-assist.language` (default `en-US`)
- en-US locale texts and runtime language switching via command and settings
- Diagnostics logger using VS Code Output Channel ("Angular Assist").
- Configuration setting: `angular-assist.debug` (boolean, default `false`) to enable diagnostic logs.

### Changed
- Default extension language switched to English (en-US)
- TypeScript config updated: `module` and `moduleResolution` set to `Node16` for stable imports
- Removed all `console.*` from source and eliminated `eslint-disable no-console` usage in `src/`.
- Commands now run inside `try/catch`; on failure, the user sees a `showErrorMessage` and details are written to the logger.
- Activation and locale-change messages no longer use console logs; info is routed to the Output Channel when appropriate.

### Docs
- README fully translated to English (default)
- Added `README.pt-BR.md` with full documentation in Portuguese

### Improvements
- Simplified script copying to always use base `templates/scripts` (stable names)
- Centralized i18n usage in `changeLanguage.ts` and commands
- i18n types extracted to `src/types/i18n.ts` for better organization
- Clearer error strategy: throw on irrecoverable situations and surface user messages only at command entry points.
- Detection/setup flows quietly handle non-critical JSON read errors (e.g., `package.json`, `.vscode/settings.json`) without noisy developer logs.

### Fixes
- Minor PowerShell message normalization (ASCII) to avoid encoding issues
- Packaging and template visibility polish
- Resolved ESLint issues (no-console, unused imports, unused catch parameters) and ensured clean TypeScript build.
- Verified successful compilation via `npm run compile`.

## [1.0.0] - 2025-09-03

### Rebrand para Angular Assist - Environment Automation
- **Nome atualizado** de "EducaDF Automation" para "Angular Assist - Environment Automation"
- **Identidade ampliada** para atender toda comunidade Angular
- **Repositório migrado** para organização Angular Assist
- **Publisher atualizado** para "AngularAssist"

### Adicionado
- **Detecção automática** de projetos Angular
- **Configuração completa** do ambiente de desenvolvimento VS Code
- **Scripts PowerShell parametrizados** para automação
- **Sistema de textos centralizados** para fácil manutenção
- **Leitura dinâmica de configurações** do angular.json
- **Normalização automática** de rotas
- **Tipagem TypeScript** completa e rigorosa
- **Suporte a ESLint** com configurações adequadas

### Funcionalidades Principais
- Configuração automática de tasks.json, launch.json, settings.json e keybindings.json
- Scripts globais compartilhados entre projetos
- Tarefas pré-configuradas para start, restart, stop e clean Chrome
- Configurações de debug para Chrome
- Atalhos de teclado otimizados

### Tecnologias
- TypeScript com tipagem rigorosa
- VS Code Extension API
- PowerShell para automação
- ESLint para qualidade de código
- JSON para templates de configuração

### Melhorias de Qualidade
- Zero erros ESLint
- Tipagem TypeScript completa
- Funções com tipos de retorno explícitos
- Tratamento adequado de erros
- Documentação completa
- Estrutura modular e organizada
