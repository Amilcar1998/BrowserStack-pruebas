@echo off
setlocal enabledelayedexpansion
title Ejecutor de Pruebas Cypress / BrowserStack

:: Detectar Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs\node.exe" (
        set "PATH=C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs;!PATH!"
    ) else if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=C:\Program Files\nodejs;!PATH!"
    ) else if exist "C:\Program Files\heroku\client\bin\node.exe" (
        set "PATH=C:\Program Files\heroku\client\bin;!PATH!"
    )
)

:MENU
cls
echo =======================================================
echo          EJECUCION DE PRUEBAS DE AUTOMATIZACION
echo =======================================================
echo 1. Ejecutar Cypress localmente (Modo Headless / CLI)
echo 2. Abrir Cypress UI interactivo (cypress open)
echo 3. Ejecutar en BrowserStack Cloud (browserstack-cypress run)
echo 4. Ejecutar en LambdaTest Cloud (lambdatest-cypress run)
echo 5. Ver reporte HTML personalizado en el navegador (Mochawesome)
echo 6. Ver reporte de vulnerabilidades (npm audit)
echo 7. Salir
echo =======================================================
set /p OPCION="Seleccione una opcion (1-7): "

if "%OPCION%"=="1" goto LOCAL_RUN
if "%OPCION%"=="2" goto OPEN_UI
if "%OPCION%"=="3" goto BS_RUN
if "%OPCION%"=="4" goto LT_RUN
if "%OPCION%"=="5" goto VIEW_REPORT
if "%OPCION%"=="6" goto AUDIT_RUN
if "%OPCION%"=="7" exit /b 0

echo Opcion no valida.
pause
goto MENU

:LOCAL_RUN
echo.
echo Ejecutando todas las pruebas Cypress localmente en modo headless...
if exist ".\node_modules\.bin\cypress.cmd" (
    call ".\node_modules\.bin\cypress.cmd" run
) else (
    call npx cypress run
)
node scripts/traducir_reporte.js
pause
goto MENU

:SEARCH_RUN
echo.
echo =======================================================
echo  Ejecutando prueba de Busqueda Web (busqueda.spec.js)...
echo =======================================================
if exist ".\node_modules\.bin\cypress.cmd" (
    call ".\node_modules\.bin\cypress.cmd" run --spec "cypress/integration/busqueda.spec.js"
) else (
    call npx cypress run --spec "cypress/integration/busqueda.spec.js"
)
node scripts/traducir_reporte.js
pause
goto MENU

:VIEW_REPORT
echo.
echo Abriendo reporte HTML personalizado...
node scripts/traducir_reporte.js
if exist ".\cypress\results\mochawesome\index.html" (
    start "" ".\cypress\results\mochawesome\index.html"
) else (
    echo Aun no existe el archivo de reporte. Ejecute primero alguna prueba.
)
pause
goto MENU

:OPEN_UI
echo.
echo Abriendo Cypress UI...
if exist ".\node_modules\.bin\cypress.cmd" (
    call ".\node_modules\.bin\cypress.cmd" open
) else (
    call npx cypress open
)
pause
goto MENU

:BS_RUN
echo.
echo =======================================================
echo  Abriendo el Dashboard de BrowserStack en el navegador...
echo =======================================================
start https://automate.browserstack.com/dashboard/v2
echo.
echo Ejecutando pruebas en BrowserStack Cloud...
if exist ".\node_modules\.bin\browserstack-cypress.cmd" (
    call ".\node_modules\.bin\browserstack-cypress.cmd" run
) else (
    call npx -y browserstack-cypress-cli run
)
pause
goto MENU

:LT_RUN
echo.
echo Ejecutando pruebas en LambdaTest Cloud...
if exist ".\node_modules\.bin\lambdatest-cypress.cmd" (
    call ".\node_modules\.bin\lambdatest-cypress.cmd" run
) else (
    call npx lambdatest-cypress run
)
pause
goto MENU

:AUDIT_RUN
echo.
echo Ejecutando auditoria de paquetes npm...
call npm audit
pause
goto MENU
