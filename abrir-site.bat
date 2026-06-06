@echo off
cd /d "%~dp0"
start "CCC CAR - servidor local" /min powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\serve-local.ps1" -Port 8080
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8080/index.html"
