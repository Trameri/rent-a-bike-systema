@echo off
title Rent a Bike - Sistema di Gestione
color 0A

echo.
echo ========================================
echo   🚴 Rent a Bike v2.0.0 - Avvio Sistema
echo ========================================
echo.

REM Verifica Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js non trovato. Installa Node.js prima di continuare.
    pause
    exit /b 1
)

echo ✅ Node.js trovato
echo.

REM Avvia Backend
echo 🚀 Avvio Backend...
cd Backend
if not exist node_modules (
    echo 📦 Installazione dipendenze Backend...
    call npm install
)
start "Rent a Bike - Backend" cmd /k "npm run dev"
cd ..
echo ✅ Backend avviato su http://localhost:4000
echo.

REM Attendi un po'
timeout /t 3 /nobreak >nul

REM Avvia Frontend
echo 🎨 Avvio Frontend...
cd Frontend
if not exist node_modules (
    echo 📦 Installazione dipendenze Frontend...
    call npm install
)
start "Rent a Bike - Frontend" cmd /k "npm run dev"
cd ..
echo ✅ Frontend avviato su http://localhost:5173
echo.

echo 🎉 Sistema avviato con successo!
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:4000
echo.
echo 💡 Per fermare i servizi, chiudi le finestre del terminale.
echo 📖 Consulta README.md per maggiori informazioni.
echo.

REM Attendi e apri il browser
echo 🌐 Apertura browser in 5 secondi...
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo ✨ Buon lavoro con Rent a Bike! 🚴‍♂️
echo.
pause