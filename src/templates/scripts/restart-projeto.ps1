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

Write-Host "Reiniciando projeto $ProjectName - Angular Assist..." -ForegroundColor Cyan
Write-Host ""

# Para todos os processos relacionados
Write-Host "Finalizando processos..." -ForegroundColor Yellow

# Mata processos na porta especificada
$processesOnPort = netstat -ano | findstr ":$Port"
if ($processesOnPort) {
    $pids = ($processesOnPort | ForEach-Object { ($_ -split '\s+')[-1] }) | Sort-Object -Unique
    foreach ($pid in $pids) {
        if ($pid -and $pid -ne "0") {
            try {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Write-Host "Processo na porta $Port (PID: $pid) finalizado." -ForegroundColor Yellow
            } catch {
                # Ignora erros
            }
        }
    }
}

# Para processos do Node.js relacionados ao projeto
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*ng serve*" -or $_.CommandLine -like "*angular*" 
} | ForEach-Object {
    try {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Processo Node.js finalizado (PID: $($_.Id))" -ForegroundColor Yellow
    } catch {
        # Ignora erros
    }
}

Write-Host "Aguardando 3 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Executa o script principal passando os parâmetros
& "$PSScriptRoot\start-projeto.ps1" -ProjectName $ProjectName -Port $Port -DebugPort $DebugPort -Route $Route
