#!/bin/bash

# Parameters
PROJECT_NAME="$1"
PORT="$2"

echo -e "\033[0;31mFinalizando todos os processos do projeto $PROJECT_NAME...\033[0m"
echo ""

# Para processos na porta específica
echo -e "\033[0;33mVerificando porta $PORT...\033[0m"
PIDS=$(lsof -ti :$PORT)

if [ -n "$PIDS" ]; then
    kill -9 $PIDS
    echo -e "\033[0;31mProcessos na porta $PORT finalizados.\033[0m"
else
    echo -e "\033[0;32mNenhum processo encontrado na porta $PORT\033[0m"
fi

# Para processos Node.js relacionados ao Angular
echo -e "\033[0;33mFinalizando processos Node.js...\033[0m"
pkill -f "ng serve"
pkill -f "angular"
pkill -f "webpack"

# Para processos Chrome específicos do projeto (se identificáveis)
echo -e "\033[0;33mFinalizando processos Chrome do projeto...\033[0m"
# Isso é mais difícil no Linux/Mac sem flags específicas, mas tentamos pelo nome do projeto se estiver na cmdline
pkill -f "$PROJECT_NAME"

echo ""
echo -e "\033[0;32mTodos os processos do projeto $PROJECT_NAME foram finalizados!\033[0m"
echo ""
