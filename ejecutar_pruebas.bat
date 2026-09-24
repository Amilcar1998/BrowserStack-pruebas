@echo off
setlocal enabledelayedexpansion
title Ejecutor de Pruebas Cypress / BrowserStack

:: Detectar Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Program Files\heroku\client\bin\node.exe" (
        set "PATH=C:\Program Files\heroku\client\bin;!PATH!"
    ) else if exist "C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs\node.exe" (
        set "PATH=C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs;!PATH!"
    ) else if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=C:\Program Files\nodejs;!PATH!"
    )
)

:MENU
cls
echo =======================================================
echo          EJECUCION DE PRUEBAS DE AUTOMATIZACION
echo =======================================================
echo 1. Ejecutar Suite Rodrigo EN VIVO (Navegador Visible / Headed)
echo 2. Ejecutar Suite Rodrigo (Modo Silencioso / Headless)
echo 3. Abrir Cypress UI Interactivo (cypress open)
echo 4. Ejecutar todas las pruebas Cypress locales
echo 5. Ejecutar en BrowserStack Cloud (browserstack-cypress run)
echo 6. Ejecutar en LambdaTest Cloud (lambdatest-cypress run)
echo 7. Ver reporte HTML personalizado en el navegador (Mochawesome)
echo 8. Ver reporte de vulnerabilidades (npm audit)
echo 9. Salir
echo =======================================================
set /p OPCION="Seleccione una opcion (1-9): "

if "%OPCION%"=="1" goto RODRIGO_HEADED
if "%OPCION%"=="2" goto RODRIGO_RUN
if "%OPCION%"=="3" goto OPEN_UI
if "%OPCION%"=="4" goto LOCAL_RUN
if "%OPCION%"=="5" goto BS_RUN
if "%OPCION%"=="6" goto LT_RUN
if "%OPCION%"=="7" goto VIEW_REPORT
if "%OPCION%"=="8" goto AUDIT_RUN
if "%OPCION%"=="9" exit /b 0

echo Opcion no valida.
pause
goto MENU

:RODRIGO_HEADED
echo.
echo =======================================================
echo  Ejecutando Suite Rodrigo Villanueva EN VIVO (Headed)...
echo =======================================================
if exist ".\node_modules\.bin\cypress.cmd" (
    call ".\node_modules\.bin\cypress.cmd" run --headed --browser chrome --spec "cypress/integration/rodrigo-villanueva/*.spec.js"
) else (
    call npx cypress run --headed --browser chrome --spec "cypress/integration/rodrigo-villanueva/*.spec.js"
)
node scripts/traducir_reporte.js
if exist ".\cypress\results\mochawesome\index.html" (
    start "" ".\cypress\results\mochawesome\index.html"
)
pause
goto MENU

:RODRIGO_RUN
echo.
echo =======================================================
echo  Ejecutando Suite Rodrigo Villanueva en Modo Headless...
echo =======================================================
if exist ".\node_modules\.bin\cypress.cmd" (
    call ".\node_modules\.bin\cypress.cmd" run --spec "cypress/integration/rodrigo-villanueva/*.spec.js"
) else (
    call npx cypress run --spec "cypress/integration/rodrigo-villanueva/*.spec.js"
)
node scripts/traducir_reporte.js
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
call npx browserstack-cypress run
pause
goto MENU

:LT_RUN
echo.
echo =======================================================
echo  Abriendo el Dashboard de LambdaTest en el navegador...
echo =======================================================
start https://automation.lambdatest.com/build
echo.
echo Ejecutando pruebas en LambdaTest Cloud...
call npx lambdatest-cypress run --sync=true --specs="cypress/integration/rodrigo-villanueva/*.spec.js"
pause
goto MENU

:AUDIT_RUN
echo.
echo Ejecutando analisis de vulnerabilidades...
call npm audit
pause
goto MENU
