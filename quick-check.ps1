Write-Host "🔧 CONTROLLO RAPIDO SISTEMA" -ForegroundColor Cyan

# Verifica Node.js
Write-Host "`nVerifica Node.js..." -ForegroundColor Yellow
node --version
npm --version

# Verifica struttura
Write-Host "`nVerifica struttura progetto..." -ForegroundColor Yellow
if (Test-Path "Backend") { Write-Host "✅ Backend OK" -ForegroundColor Green } else { Write-Host "❌ Backend mancante" -ForegroundColor Red }
if (Test-Path "Frontend") { Write-Host "✅ Frontend OK" -ForegroundColor Green } else { Write-Host "❌ Frontend mancante" -ForegroundColor Red }

# Verifica dipendenze
Write-Host "`nVerifica dipendenze..." -ForegroundColor Yellow
if (Test-Path "Backend\node_modules") { Write-Host "✅ Backend deps OK" -ForegroundColor Green } else { Write-Host "⚠️ Backend deps mancanti" -ForegroundColor Yellow }
if (Test-Path "Frontend\node_modules") { Write-Host "✅ Frontend deps OK" -ForegroundColor Green } else { Write-Host "⚠️ Frontend deps mancanti" -ForegroundColor Yellow }

Write-Host "`n🎉 Controllo completato!" -ForegroundColor Cyan