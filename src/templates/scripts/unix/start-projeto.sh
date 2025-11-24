#!/bin/bash

# Parameters
PROJECT_NAME="$1"
PORT="$2"
DEBUG_PORT="$3"
ROUTE="$4"

echo -e "\033[0;32mIniciando o projeto $PROJECT_NAME - Angular Assist...\033[0m"
echo ""

# Verifica se o Node.js está instalado
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "\033[0;32mNode.js encontrado: $NODE_VERSION\033[0m"
else
    echo -e "\033[0;31mERRO: Node.js não encontrado. Por favor, instale o Node.js primeiro.\033[0m"
    read -p "Pressione Enter para sair"
    exit 1
fi

# Verifica se o Angular CLI está instalado
if command -v ng &> /dev/null; then
    echo -e "\033[0;32mAngular CLI encontrado\033[0m"
else
    echo -e "\033[0;33mAngular CLI nao encontrado. Instalando...\033[0m"
    npm install -g @angular/cli
fi

# Verifica se as dependencias estao instaladas
if [ ! -d "node_modules" ]; then
    echo -e "\033[0;33mInstalando dependencias do projeto...\033[0m"
    npm install
else
    echo -e "\033[0;32mDependencias ja instaladas\033[0m"
fi

# Mata processos na porta especificada se existirem
echo -e "\033[0;33mVerificando processos na porta $PORT...\033[0m"
PIDS=$(lsof -ti :$PORT)

if [ -n "$PIDS" ]; then
    echo -e "\033[0;33mFinalizando processos na porta $PORT...\033[0m"
    kill -9 $PIDS
    sleep 2
fi

# Inicia o servidor de desenvolvimento
echo -e "\033[0;32mIniciando servidor de desenvolvimento...\033[0m"
echo -e "\033[0;36mO projeto sera aberto em: http://localhost:$PORT$ROUTE\033[0m"
echo ""

# Inicia job para abrir navegador apos 8 segundos
(sleep 8 && (open "http://localhost:$PORT$ROUTE" || xdg-open "http://localhost:$PORT$ROUTE" || sensible-browser "http://localhost:$PORT$ROUTE" || gnome-open "http://localhost:$PORT$ROUTE")) &

# Executa ng serve
ng serve --host localhost --port $PORT
