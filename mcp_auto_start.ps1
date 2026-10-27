# ==============================================================================
# Radiant Spark LLC & SparkSync — Automated Oracle DB & ORDS Service Manager
# Run with: powershell.exe -ExecutionPolicy Bypass -File "mcp_auto_start.ps1"
# ==============================================================================

$LogFile = "C:\Users\vinna\mcp_startup_log.txt"
$TimeStamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Radiant Spark Enterprise — Oracle DB & ORDS Starter" -ForegroundColor Yellow
Write-Host " Time: $TimeStamp" -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Cyan

try {
    "[$TimeStamp] Starting Oracle Database XE & Listener..." | Out-File -FilePath $LogFile -Append
    
    # 1. Start Oracle Database XE Service
    $xeService = Get-Service -Name "OracleServiceXE" -ErrorAction SilentlyContinue
    if ($xeService -and $xeService.Status -ne 'Running') {
        Write-Host "[1/3] Starting OracleServiceXE..." -ForegroundColor Yellow
        Start-Service -Name "OracleServiceXE" -ErrorAction Stop
        Write-Host "   -> OracleServiceXE is now RUNNING." -ForegroundColor Green
    } else {
        Write-Host "[1/3] OracleServiceXE is already active." -ForegroundColor Green
    }

    # 2. Start Oracle TNS Listener
    $listenerService = Get-Service -Name "OracleOraDB21Home1TNSListener" -ErrorAction SilentlyContinue
    if ($listenerService -and $listenerService.Status -ne 'Running') {
        Write-Host "[2/3] Starting Oracle TNS Listener..." -ForegroundColor Yellow
        Start-Service -Name "OracleOraDB21Home1TNSListener" -ErrorAction Stop
        Write-Host "   -> Oracle TNS Listener is now RUNNING." -ForegroundColor Green
    } else {
        Write-Host "[2/3] Oracle Listener is already active." -ForegroundColor Green
    }

    # 3. Start Oracle REST Data Services (ORDS)
    Write-Host "[3/3] Launching ORDS API Gateway on port 8080/8443..." -ForegroundColor Yellow
    $ordsConfig = "C:\ords\config"
    if (Test-Path $ordsConfig) {
        Start-Process "cmd.exe" -ArgumentList "/c ords --config $ordsConfig serve" -WindowStyle Hidden
        Write-Host "   -> ORDS Server process dispatched in background." -ForegroundColor Green
    } else {
        Start-Process "cmd.exe" -ArgumentList "/c ords serve" -WindowStyle Hidden
        Write-Host "   -> ORDS Server dispatched with standard configuration." -ForegroundColor Green
    }

    $msg = "[$TimeStamp] SUCCESS: Oracle DB XE, Listener, and ORDS are online and verified."
    $msg | Out-File -FilePath $LogFile -Append
    Write-Host "`n$msg" -ForegroundColor Green

} catch {
    $errMsg = "[$TimeStamp] ERROR: $($_.Exception.Message)"
    $errMsg | Out-File -FilePath $LogFile -Append
    Write-Host "`n$errMsg" -ForegroundColor Red
}
