Write-Host "CONTROLLO SISTEMA RENT A BIKE" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

Write-Host "`nVerifica Node.js..." -ForegroundColor Yellow
try {
    $nodeVer = node --version
    Write-Host "Node.js: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "Node.js non trovato!" -ForegroundColor Red
}

Write-Host "`nVerifica struttura..." -ForegroundColor Yellow
if (Test-Path "Backend") { 
    Write-Host "Backend: OK" -ForegroundColor Green 
} else { 
    Write-Host "Backend: MANCANTE" -ForegroundColor Red 
}

if (Test-Path "Frontend") { 
    Write-Host "Frontend: OK" -ForegroundColor Green 
} else { 
    Write-Host "Frontend: MANCANTE" -ForegroundColor Red 
}

Write-Host "`nVerifica dipendenze..." -ForegroundColor Yellow
if (Test-Path "Backend\node_modules") { 
    Write-Host "Backend deps: OK" -ForegroundColor Green 
} else { 
    Write-Host "Backend deps: MANCANTI" -ForegroundColor Yellow 
}

if (Test-Path "Frontend\node_modules") { 
    Write-Host "Frontend deps: OK" -ForegroundColor Green 
} else { 
    Write-Host "Frontend deps: MANCANTI" -ForegroundColor Yellow 
}

Write-Host "`nControllo completato!" -ForegroundColor Cyan