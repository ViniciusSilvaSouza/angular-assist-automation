param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,
    
    [Parameter(Mandatory=$true)]
    [string]$Port
)

Write-Host "Finalizando todos os processos do projeto $ProjectName..." -ForegroundColor Red
Write-Host ""

# Para processos na porta específica
Write-Host "Verificando porta $Port..." -ForegroundColor Yellow
$processesOnPort = netstat -ano | findstr ":$Port"
if ($processesOnPort) {
    $pids = ($processesOnPort | ForEach-Object { ($_ -split '\s+')[-1] }) | Sort-Object -Unique
    foreach ($pid in $pids) {
        if ($pid -and $pid -ne "0") {
            try {
                $processName = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Write-Host "Processo finalizado: $processName (PID: $pid)" -ForegroundColor Red
            } catch {
                # Ignora erros de processos que já foram finalizados
            }
        }
    }
} else {
    Write-Host "Nenhum processo encontrado na porta $Port" -ForegroundColor Green
}

# Para processos Node.js relacionados ao Angular
Write-Host "Finalizando processos Node.js..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*ng serve*" -or 
    $_.CommandLine -like "*angular*" -or 
    $_.CommandLine -like "*webpack*"
} | ForEach-Object {
    try {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Processo Node.js finalizado (PID: $($_.Id))" -ForegroundColor Red
    } catch {
        # Ignora erros
    }
}

# Para processos Chrome específicos do projeto
Write-Host "Finalizando processos Chrome do projeto..." -ForegroundColor Yellow
Get-Process -Name "chrome" -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*$ProjectName*" -or 
    $_.CommandLine -like "*chrome-debug-$ProjectName*"
} | ForEach-Object {
    try {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Chrome do projeto finalizado (PID: $($_.Id))" -ForegroundColor Red
    } catch {
        # Ignora erros
    }
}

Write-Host ""
Write-Host "Todos os processos do projeto $ProjectName foram finalizados!" -ForegroundColor Green
Write-Host ""
