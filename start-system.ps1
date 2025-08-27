Write-Host "🚀 AVVIO SISTEMA RENT A BIKE" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Controlla se i server sono già in esecuzione
$backendRunning = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" }
$frontendRunning = netstat -an | Select-String ":5173"

if ($backendRunning) {
    Write-Host "✅ Backend già in esecuzione" -ForegroundColor Green
} else {
    Write-Host "🔄 Avvio Backend..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'c:\Users\nicot\Desktop\Rent a Bike\Backend'; npm run dev"
    Start-Sleep -Seconds 3
}

if ($frontendRunning) {
    Write-Host "✅ Frontend già in esecuzione" -ForegroundColor Green
} else {
    Write-Host "🔄 Avvio Frontend..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'c:\Users\nicot\Desktop\Rent a Bike\Frontend'; npm run dev"
    Start-Sleep -Seconds 5
}

Write-Host "`n🎉 Sistema avviato!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:4000" -ForegroundColor White
Write-Host "🔄 Sostituzioni: http://localhost:5173/bike-swap" -ForegroundColor White
Write-Host "🔧 Diagnostica: http://localhost:5173/system-diagnostic" -ForegroundColor White

# Apri il browser
Start-Sleep -Seconds 2
Write-Host "`n🌐 Apertura browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"