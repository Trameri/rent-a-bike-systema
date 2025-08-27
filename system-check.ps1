# Script di verifica completa del sistema Rent a Bike
Write-Host "🔧 VERIFICA COMPLETA SISTEMA RENT A BIKE" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Verifica Node.js
Write-Host "`n1. Verifica Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js non trovato!" -ForegroundColor Red
    exit 1
}

# Verifica npm
Write-Host "`n2. Verifica npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm non trovato!" -ForegroundColor Red
    exit 1
}

# Verifica MongoDB
Write-Host "`n3. Verifica MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB in esecuzione (PID: $($mongoProcess.Id))" -ForegroundColor Green
    } else {
        Write-Host "⚠️ MongoDB non sembra essere in esecuzione" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Impossibile verificare MongoDB" -ForegroundColor Yellow
}

# Verifica struttura progetto
Write-Host "`n4. Verifica struttura progetto..." -ForegroundColor Yellow
$requiredDirs = @(
    "Backend",
    "Frontend", 
    "Backend\src",
    "Frontend\src",
    "Backend\src\routes",
    "Frontend\src\pages",
    "Frontend\src\Components"
)

foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "✅ Directory $dir presente" -ForegroundColor Green
    } else {
        Write-Host "❌ Directory $dir mancante!" -ForegroundColor Red
    }
}

# Verifica file critici
Write-Host "`n5. Verifica file critici..." -ForegroundColor Yellow
$requiredFiles = @(
    "Backend\package.json",
    "Frontend\package.json",
    "Backend\src\server.js",
    "Frontend\src\App.jsx",
    "Frontend\src\main.jsx"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ File $file presente" -ForegroundColor Green
    } else {
        Write-Host "❌ File $file mancante!" -ForegroundColor Red
    }
}

# Verifica dipendenze Backend
Write-Host "`n6. Verifica dipendenze Backend..." -ForegroundColor Yellow
Set-Location "Backend"
if (Test-Path "node_modules") {
    Write-Host "✅ Dipendenze Backend installate" -ForegroundColor Green
} else {
    Write-Host "⚠️ Dipendenze Backend non installate, installazione in corso..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dipendenze Backend installate con successo" -ForegroundColor Green
    } else {
        Write-Host "❌ Errore installazione dipendenze Backend" -ForegroundColor Red
    }
}
Set-Location ".."

# Verifica dipendenze Frontend
Write-Host "`n7. Verifica dipendenze Frontend..." -ForegroundColor Yellow
Set-Location "Frontend"
if (Test-Path "node_modules") {
    Write-Host "✅ Dipendenze Frontend installate" -ForegroundColor Green
} else {
    Write-Host "⚠️ Dipendenze Frontend non installate, installazione in corso..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dipendenze Frontend installate con successo" -ForegroundColor Green
    } else {
        Write-Host "❌ Errore installazione dipendenze Frontend" -ForegroundColor Red
    }
}
Set-Location ".."

# Verifica porte
Write-Host "`n8. Verifica porte..." -ForegroundColor Yellow
$backendPort = netstat -an | Select-String ":4000"
$frontendPort = netstat -an | Select-String ":5173"

if ($backendPort) {
    Write-Host "✅ Backend in ascolto sulla porta 4000" -ForegroundColor Green
} else {
    Write-Host "⚠️ Backend non in ascolto sulla porta 4000" -ForegroundColor Yellow
}

if ($frontendPort) {
    Write-Host "✅ Frontend in ascolto sulla porta 5173" -ForegroundColor Green
} else {
    Write-Host "⚠️ Frontend non in ascolto sulla porta 5173" -ForegroundColor Yellow
}

# Verifica file di configurazione
Write-Host "`n9. Verifica configurazione..." -ForegroundColor Yellow
if (Test-Path "Backend\.env") {
    Write-Host "✅ File .env Backend presente" -ForegroundColor Green
} else {
    Write-Host "⚠️ File .env Backend mancante" -ForegroundColor Yellow
}

# Test build Frontend
Write-Host "`n10. Test build Frontend..." -ForegroundColor Yellow
Set-Location "Frontend"
try {
    npm run build 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build Frontend completato con successo" -ForegroundColor Green
    } else {
        Write-Host "❌ Errore nel build Frontend" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Errore nel build Frontend" -ForegroundColor Red
}
Set-Location ".."

Write-Host "`n🎉 VERIFICA COMPLETATA!" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "`nPer avviare il sistema:" -ForegroundColor White
Write-Host "1. Backend: cd Backend; npm run dev" -ForegroundColor Gray
Write-Host "2. Frontend: cd Frontend; npm run dev" -ForegroundColor Gray
Write-Host "`nOppure usa: .\start.ps1" -ForegroundColor Gray
Write-Host "`nURL di accesso:" -ForegroundColor White
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "- Backend: http://localhost:4000" -ForegroundColor Gray
Write-Host "- Diagnostica: http://localhost:5173/system-diagnostic" -ForegroundColor Gray