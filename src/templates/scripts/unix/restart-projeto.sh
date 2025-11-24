#!/bin/bash

# Parameters
PROJECT_NAME="$1"
PORT="$2"
DEBUG_PORT="$3"
ROUTE="$4"

echo -e "\033[0;36mReiniciando projeto $PROJECT_NAME - Angular Assist...\033[0m"
echo ""

# Para todos os processos relacionados
echo -e "\033[0;33mFinalizando processos...\033[0m"

# Mata processos na porta especificada
PIDS=$(lsof -ti :$PORT)
if [ -n "$PIDS" ]; then
    kill -9 $PIDS
    echo -e "\033[0;33mProcessos na porta $PORT finalizados.\033[0m"
fi

# Mata processos na porta de debug
PIDS_DEBUG=$(lsof -ti :$DEBUG_PORT)
if [ -n "$PIDS_DEBUG" ]; then
    kill -9 $PIDS_DEBUG
fi

# Tenta matar processos node ng serve se ainda existirem
pkill -f "ng serve"

echo -e "\033[0;33mAguardando 3 segundos...\033[0m"
sleep 3

# Executa o script principal passando os parametros
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
"$DIR/start-projeto.sh" "$PROJECT_NAME" "$PORT" "$DEBUG_PORT" "$ROUTE"
