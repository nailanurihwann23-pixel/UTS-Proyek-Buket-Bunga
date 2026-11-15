@echo off
title RIBINKKOCH - Buket Bunga App
color 0b
echo ========================================================
echo     SISTEM INFORMASI BUKET BUNGA - RIBINKKOCH
echo ========================================================
echo.
echo [1/2] Memulai Backend API (port 3001)...
start "Backend Buket Bunga" cmd /k "cd /d "%~dp0backend" && node server.js"

echo Menunggu backend siap...
timeout /t 2 /nobreak >nul

echo [2/2] Memulai Frontend Web (port 5173)...
start "Frontend Buket Bunga" cmd /k "cd /d "%~dp0buket-bunga-app" && npm run dev"

echo.
echo Membuka browser ke http://localhost:5173 ...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================================
echo  Aplikasi sedang berjalan!
echo  - Frontend : http://localhost:5173
echo  - Backend  : http://localhost:3001
echo ========================================================
