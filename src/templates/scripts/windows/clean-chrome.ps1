param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,
    
    [Parameter(Mandatory=$true)]
    [string]$Route
)

Write-Host "Limpando processos Chrome do projeto $ProjectName..." -ForegroundColor Cyan
Write-Host ""

# Finaliza processos Chrome específicos do projeto
$chromeClosed = $false

Get-Process -Name "chrome" -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*$ProjectName*" -or 
    $_.CommandLine -like "*chrome-debug-$ProjectName*" -or
    $_.CommandLine -like "*$Route*"
} | ForEach-Object {
    try {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Chrome do projeto finalizado (PID: $($_.Id))" -ForegroundColor Yellow
        $chromeClosed = $true
    } catch {
        # Ignora erros de processos que já foram finalizados
    }
}

if (-not $chromeClosed) {
    Write-Host "Nenhum processo Chrome especifico do projeto encontrado." -ForegroundColor Green
}

# Limpa diretórios de dados do Chrome se existirem
$chromeDataDir = ".vscode\chrome-debug-$ProjectName"
if (Test-Path $chromeDataDir) {
    try {
        Write-Host "Limpando dados do Chrome..." -ForegroundColor Yellow
        Remove-Item -Path $chromeDataDir -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Dados do Chrome limpos." -ForegroundColor Green
    } catch {
        Write-Host "Aviso: Nao foi possivel limpar todos os dados do Chrome." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Limpeza de Chrome do projeto $ProjectName concluida!" -ForegroundColor Green
Write-Host ""
