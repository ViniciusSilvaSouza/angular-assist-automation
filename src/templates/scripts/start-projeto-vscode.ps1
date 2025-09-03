param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,
    
    [Parameter(Mandatory=$true)]
    [string]$Port,
    
    [Parameter(Mandatory=$true)]
    [string]$DebugPort,
    
    [Parameter(Mandatory=$true)]
    [string]$Route
)

Write-Host "Iniciando o projeto $ProjectName - Angular Assist..." -ForegroundColor Green
Write-Host ""

# Verifica se o Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Node.js não encontrado. Por favor, instale o Node.js primeiro." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verifica se o Angular CLI está instalado
try {
    $ngVersion = ng version --skip-git 2>$null
    Write-Host "Angular CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "Angular CLI não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g @angular/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO: Falha ao instalar Angular CLI" -ForegroundColor Red
        exit 1
    }
}

# Verifica se as dependências estão instaladas
if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependências do projeto..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO: Falha ao instalar dependências" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Dependências já instaladas" -ForegroundColor Green
}

# Mata processos na porta especificada se existirem
Write-Host "Verificando processos na porta $Port..." -ForegroundColor Yellow
$processesOnPort = netstat -ano | findstr ":$Port"
if ($processesOnPort) {
    Write-Host "Finalizando processos na porta $Port..." -ForegroundColor Yellow
    $pids = ($processesOnPort | ForEach-Object { ($_ -split '\s+')[-1] }) | Sort-Object -Unique
    foreach ($pid in $pids) {
        if ($pid -and $pid -ne "0") {
            try {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Write-Host "Processo $pid finalizado." -ForegroundColor Yellow
            } catch {
                # Ignora erros de processos que já foram finalizados
            }
        }
    }
    Start-Sleep -Seconds 2
}

# Inicia o servidor de desenvolvimento
Write-Host "Iniciando servidor de desenvolvimento na porta $Port..." -ForegroundColor Green
Write-Host "O projeto será acessível em: http://localhost:$Port$Route" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

# Executa ng serve
ng serve --host localhost --port $Port
