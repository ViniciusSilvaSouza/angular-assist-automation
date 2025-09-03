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
}

# Verifica se as dependências estão instaladas
if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependências do projeto..." -ForegroundColor Yellow
    npm install
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
            } catch {
                # Ignora erros
            }
        }
    }
    Start-Sleep -Seconds 2
}

# Inicia o servidor de desenvolvimento
Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host "O projeto será aberto em: http://localhost:$Port$Route" -ForegroundColor Cyan
Write-Host ""

# Inicia job para abrir navegador após 8 segundos
$portVar = $Port
$routeVar = $Route
Start-Job -ScriptBlock {
    param($port, $route)
    Start-Sleep -Seconds 8
    Start-Process "http://localhost:$port$route"
} -ArgumentList $portVar, $routeVar | Out-Null

# Executa ng serve
ng serve --host localhost --port $Port
