@echo off
chcp 65001 >nul
echo ==============================================================================
echo SGI ACCESO - PUBLICADOR AUTOMÁTICO PARA XAMPP
echo ==============================================================================
echo.

set "SOURCE_DIR=%~dp0"
set "TARGET_DIR=C:\xamppp\htdocs\gestion-institucional"

if not exist "C:\xamppp\htdocs" (
    if exist "C:\xampp\htdocs" (
        set "TARGET_DIR=C:\xampp\htdocs\gestion-institucional"
    ) else (
        echo [ERROR] No se encontró la carpeta htdocs en C:\xamppp ni en C:\xampp.
        echo Por favor verifique la ruta de instalación de su XAMPP.
        pause
        exit /b 1
    )
)

echo [1/3] Creando directorio en XAMPP htdocs:
echo Destino: %TARGET_DIR%
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

echo [2/3] Sincronizando archivos del proyecto...
robocopy "%SOURCE_DIR%\" "%TARGET_DIR%\" /E /XD .git node_modules dist .gemini /XF .env.example /NFL /NDL /NJH /NJS

echo [3/3] Despliegue completado con éxito.
echo.
echo ==============================================================================
echo ¡APLICACIÓN PUBLICADA EN XAMPP!
echo URL de acceso local: http://localhost/gestion-institucional/
echo ==============================================================================
echo.
echo Abriendo navegador en http://localhost/gestion-institucional/ ...
start http://localhost/gestion-institucional/
echo.
pause
