#!/bin/bash

# Parameters
PROJECT_NAME="$1"
ROUTE="$2"

echo -e "\033[0;36mLimpando processos Chrome do projeto $PROJECT_NAME...\033[0m"
echo ""

# Finaliza processos Chrome específicos do projeto
# Tenta fechar Chrome/Chromium
pkill -f "$PROJECT_NAME"

echo -e "\033[0;33mLimpando dados do Chrome...\033[0m"

# Limpa diretórios de dados do Chrome se existirem
CHROME_DATA_DIR=".vscode/chrome-debug-$PROJECT_NAME"

if [ -d "$CHROME_DATA_DIR" ]; then
    rm -rf "$CHROME_DATA_DIR"
    echo -e "\033[0;32mDados do Chrome limpos.\033[0m"
else
    echo -e "\033[0;32mNenhum dado temporario do Chrome encontrado para limpar.\033[0m"
fi

echo ""
echo -e "\033[0;32mLimpeza de Chrome do projeto $PROJECT_NAME concluida!\033[0m"
echo ""
