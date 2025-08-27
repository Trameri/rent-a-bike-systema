# Script per avviare automaticamente Backend e Frontend
Write-Host "🚀 Avvio Sistema Rent-a-Bike..." -ForegroundColor Green

# Termina eventuali processi Node esistenti
Write-Host "🔄 Terminando processi esistenti..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null

# Avvia Backend
Write-Host "🔧 Avvio Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\nicot\Desktop\Rent a Bike\Backend'; npm start"

# Aspetta che il backend si avvii
Start-Sleep -Seconds 5

# Avvia Frontend
Write-Host "🎨 Avvio Frontend..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\nicot\Desktop\Rent a Bike\Frontend'; npm run dev"

# Aspetta che il frontend si avvii
Start-Sleep -Seconds 3

Write-Host "✅ Sistema avviato!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:4000" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "👤 Credenziali di accesso:" -ForegroundColor Yellow
Write-Host "   Superadmin: superadmin / admin123" -ForegroundColor White
Write-Host "   Arnoga: arnoga / arnoga123" -ForegroundColor White
Write-Host "   Cancano: cancano / cancano123" -ForegroundColor White
Write-Host "   Campo: campo / campo123" -ForegroundColor White

# Apri automaticamente il browser
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"

Write-Host "🎉 Sistema pronto all'uso!" -ForegroundColor Green