@echo off
setlocal enabledelayedexpansion
title Instalador de Dependencias y Cypress

echo =======================================================
echo          INSTALADOR DE DEPENDENCIAS Y CYPRESS
echo =======================================================
echo.

:: 1. Detectar Node.js y npm en el sistema o rutas conocidas
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js detectado en PATH.
) else (
    echo [INFO] Buscando rutas alternativas de Node.js...
    if exist "C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs\node.exe" (
        set "PATH=C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs;!PATH!"
        echo [OK] Node.js encontrado en Visual Studio.
    ) else if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=C:\Program Files\nodejs;!PATH!"
        echo [OK] Node.js encontrado en Program Files.
    ) else if exist "C:\Program Files\heroku\client\bin\node.exe" (
        set "PATH=C:\Program Files\heroku\client\bin;!PATH!"
        echo [OK] Node.js encontrado en Heroku bin.
    ) else (
        echo [ERROR] No se encontro Node.js en su sistema.
        echo Por favor instale Node.js desde https://nodejs.org/
        pause
        exit /b 1
    )
)

echo.
echo [1/3] Limpiando cache e instalando dependencias (npm install)...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ADVERTENCIA] npm install retorno un codigo de salida distinto de 0.
)

echo.
echo [2/3] Verificando e instalando el binario de Cypress...
call npx cypress install
if %ERRORLEVEL% NEQ 0 (
    if exist ".\node_modules\.bin\cypress.cmd" (
        call ".\node_modules\.bin\cypress.cmd" install
    )
)

echo.
echo [3/3] Verificando version de Cypress...
if exist ".\node_modules\.bin\cypress.cmd" (
    call ".\node_modules\.bin\cypress.cmd" --version
) else (
    call npx cypress --version
)

echo.
echo =======================================================
echo   INSTALACION COMPLETADA CORRECTAMENTE
echo =======================================================
echo.
pause
