## 🚀 Angular Assist v1.0.2

### Destaques
- Suporte a inglês (en-US) e comando para trocar idioma
- Textos centralizados (i18n) e padrão de locale em toda a extensão
- Remoção de console.* com OutputChannel (logger) e flag angular-assist.debug
- Suporte a múltiplas automações no mesmo workspace (merge não-destrutivo de tasks/launch)
- Comportamento F5/Shift+F5:
	- F5 repetido: ignora novo start se a porta já estiver ocupada (sem prompt do Angular)
	- Shift+F5: encerra servidor, Chrome do projeto e terminais relacionados (postDebugTask)
- Scripts PowerShell aprimorados (kill por porta/Node/webpack/Chrome; correção de variável $PID)
- Documentação atualizada (README.md e README.pt-BR.md)

### Instalação
1. Baixe o arquivo `angular-assist-automation-1.0.2.vsix`
2. No VS Code: Ctrl+Shift+P → Extensions: Install from VSIX...
3. Selecione o arquivo baixado

---

## 🎉 Angular Assist v1.0.0 - Primeira Release!

### 📥 Instalação
1. Baixe o arquivo `angular-assist-automation-1.0.2.vsix` abaixo
2. No VS Code: `Ctrl+Shift+P` → `Extensions: Install from VSIX...`
3. Selecione o arquivo baixado

### ✨ Funcionalidades
- ✅ Detecção automática de projetos Angular
- ✅ Configuração completa de ambiente VS Code  
- ✅ Scripts PowerShell otimizados e reutilizáveis
- ✅ Sistema de textos centralizados
- ✅ Leitura dinâmica de configurações
- ✅ Normalização automática de rotas
- ✅ 6 tarefas pré-configuradas
- ✅ Debug integrado com Chrome
- ✅ Atalhos de teclado personalizados

### 🛠️ Requisitos
- VS Code 1.103.0+
- Node.js 18+
- PowerShell (Windows)

### 📚 Documentação
Veja o [README.md](https://github.com/ViniciusSilvaSouza/angular-assist-automation#readme) para instruções detalhadas de uso.

### 🐛 Reportar Problemas
Use as [Issues](https://github.com/ViniciusSilvaSouza/angular-assist-automation/issues) para reportar bugs ou sugerir melhorias.

### 🏗️ Architecture Highlights
- Estrutura modular TypeScript
- Sistema de tipos organizados  
- Templates reutilizáveis
- Constantes centralizadas

---

**Primeira versão estável da extensão Angular Assist!** 🚀
