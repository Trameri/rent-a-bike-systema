# Script PowerShell per avviare il sistema Rent a Bike
# Esegui con: .\start.ps1

Write-Host "🚴 Avvio Sistema Rent a Bike v2.0.0" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Verifica che Node.js sia installato
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js versione: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js non trovato. Installa Node.js prima di continuare." -ForegroundColor Red
    exit 1
}

# Verifica che MongoDB sia in esecuzione (opzionale)
Write-Host "🔍 Verifica MongoDB..." -ForegroundColor Yellow

# Funzione per avviare il backend
function Start-Backend {
    Write-Host "🚀 Avvio Backend..." -ForegroundColor Cyan
    Set-Location "Backend"
    
    # Verifica se node_modules esiste
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installazione dipendenze Backend..." -ForegroundColor Yellow
        npm install
    }
    
    # Avvia il server in background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Minimized
    Set-Location ".."
    Write-Host "✅ Backend avviato su http://localhost:4000" -ForegroundColor Green
}

# Funzione per avviare il frontend
function Start-Frontend {
    Write-Host "🎨 Avvio Frontend..." -ForegroundColor Cyan
    Set-Location "Frontend"
    
    # Verifica se node_modules esiste
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installazione dipendenze Frontend..." -ForegroundColor Yellow
        npm install
    }
    
    # Avvia il server in background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Minimized
    Set-Location ".."
    Write-Host "✅ Frontend avviato su http://localhost:5173" -ForegroundColor Green
}

# Avvia i servizi
Start-Backend
Start-Sleep -Seconds 3
Start-Frontend

Write-Host ""
Write-Host "🎉 Sistema avviato con successo!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:4000" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Per fermare i servizi, chiudi le finestre PowerShell aperte." -ForegroundColor Yellow
Write-Host "📖 Consulta README.md per maggiori informazioni." -ForegroundColor Yellow

# Attendi un po' e poi apri il browser
Start-Sleep -Seconds 5
Write-Host "🌐 Apertura browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✨ Buon lavoro con Rent a Bike! 🚴‍♂️" -ForegroundColor Green