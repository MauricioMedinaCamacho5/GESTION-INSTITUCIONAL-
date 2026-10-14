@echo off
chcp 65001 >nul
echo ==============================================================================
echo SGI ACCESO - SERVIDOR LOCAL RÁPIDO DE DESARROLLO (PHP 8.2)
echo ==============================================================================
echo.

set "PHP_BIN=C:\xamppp\php\php.exe"
if not exist "%PHP_BIN%" (
    if exist "C:\xampp\php\php.exe" (
        set "PHP_BIN=C:\xampp\php\php.exe"
    ) else (
        set "PHP_BIN=php"
    )
)

echo Iniciando servidor en http://localhost:8000 ...
echo Presione Ctrl+C en esta consola para detener el servidor.
echo.
start http://localhost:8000
"%PHP_BIN%" -S localhost:8000
