# Contribuindo para Angular Assist - Environment Automation

Obrigado por considerar contribuir para o projeto Angular Assist - Environment Automation! Este documento fornece diretrizes para contribuições.

## Como Contribuir

### 1. Reportando Bugs
- Use o [GitHub Issues](https://github.com/ViniciusSilvaSouza/angular-assist-automation/issues)
- Descreva o problema detalhadamente
- Inclua passos para reproduzir
- Especifique versão do VS Code e sistema operacional

### 2. Sugerindo Melhorias
- Abra uma issue com tag "enhancement"
- Descreva claramente a funcionalidade desejada
- Explique por que seria útil para outros usuários

### 3. Enviando Pull Requests

#### Configuração do Ambiente
```bash
git clone https://github.com/ViniciusSilvaSouza/angular-assist-automation.git
cd angular-assist-automation
npm install
```

#### Padrões de Código
- Use TypeScript com tipagem rigorosa
- Siga as configurações do ESLint
- Todos os arquivos devem passar no `npm run lint`
- Mantenha cobertura de tipos em 100%

#### Estrutura de Commits
```
tipo(escopo): descrição

Descrição mais detalhada se necessário

Fixes #123
```

Tipos válidos:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação de código
- `refactor`: Refatoração sem mudança funcional
- `test`: Adição/modificação de testes
- `chore`: Tarefas de manutenção

#### Checklist antes do PR
- [ ] Código compila sem erros (`npm run compile`)
- [ ] Passa no lint (`npm run lint`)
- [ ] Documentação atualizada
- [ ] Changelog atualizado
- [ ] Testes passando (quando aplicável)

### 4. Padrões de Desenvolvimento

#### Estrutura de Arquivos
```
src/
├── commands/           # Comandos da extensão
├── constants/          # Textos e constantes
├── types/             # Definições TypeScript
└── templates/         # Templates de configuração
```

#### Nomenclatura
- **Arquivos**: kebab-case (`setup-automation.ts`)
- **Classes/Interfaces**: PascalCase (`ProjectData`)
- **Funções/Variáveis**: camelCase (`collectProjectData`)
- **Constantes**: UPPER_SNAKE_CASE (`TEXTS.ERRORS`)

#### Tipagem
- Sempre use tipos explícitos
- Evite `any` - use `unknown` se necessário
- Defina interfaces para objetos complexos
- Use union types quando apropriado

#### Tratamento de Erros
```typescript
try {
    // código
} catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // tratamento
}
```

### 5. Testes

#### Executando Testes
```bash
npm test
```

#### Testando a Extensão
1. Abra o projeto no VS Code
2. Pressione F5 para abrir nova janela com extensão carregada
3. Teste funcionalidades manualmente
4. Verifique logs de erro no Developer Tools

### 6. Documentação

#### README.md
- Mantenha instruções atualizadas
- Inclua exemplos de uso
- Documente novas funcionalidades

#### Comentários no Código
- Use JSDoc para funções públicas
- Explique lógica complexa
- Documente parâmetros e retornos

### 7. Versionamento

Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs

### 8. Processo de Review

1. **Automated Checks**: CI verifica lint, build e testes
2. **Code Review**: Pelo menos 1 reviewer aprovado
3. **Manual Testing**: Testar funcionalidades afetadas
4. **Documentation**: Verificar se documentação está atualizada

### 9. Configuração de Desenvolvimento

#### Extensões Recomendadas
- TypeScript Importer
- ESLint
- Prettier
- GitLens

#### Settings VS Code
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 10. Dúvidas?

- Abra uma Discussion no GitHub
- Entre em contato: suporte@educadf.com.br
- Consulte a documentação do VS Code Extension API

## Código de Conduta

- Seja respeitoso e construtivo
- Foque no problema, não na pessoa
- Aceite feedback construtivo
- Mantenha discussões profissionais

Obrigado por contribuir! 🚀
