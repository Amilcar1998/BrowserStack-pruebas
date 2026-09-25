@echo off
setlocal enabledelayedexpansion
title Suite de Pruebas Automatizadas QA - Rodrigo Villanueva / Cloud

:: Detectar y configurar entorno Node.js / NPM
if exist "C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs\npm.cmd" (
    set "PATH=C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs;!PATH!"
) else if exist "C:\Program Files\nodejs\npm.cmd" (
    set "PATH=C:\Program Files\nodejs;!PATH!"
) else if exist "C:\Program Files\heroku\client\bin\node.exe" (
    set "PATH=C:\Program Files\heroku\client\bin;!PATH!"
)

:MENU
cls
echo =======================================================
echo          SUITE DE PRUEBAS AUTOMATIZADAS QA
echo =======================================================
echo 1. Ejecutar Suite Rodrigo EN VIVO (Chrome + Word + Evidencias)
echo 2. Ejecutar Suite Rodrigo (Headless + Word + Evidencias)
echo 3. Ejecutar en BrowserStack Cloud (Multi-Navegador)
echo 4. Ejecutar en LambdaTest Cloud
echo 5. Abrir Cypress UI Interactivo (cypress open)
echo 6. Abrir Carpeta con todos los Reportes y Evidencias
echo 7. Salir
echo =======================================================
set /p OPCION="Seleccione una opcion (1-7): "

if "%OPCION%"=="1" goto RODRIGO_HEADED
if "%OPCION%"=="2" goto RODRIGO_RUN
if "%OPCION%"=="3" goto BS_RUN
if "%OPCION%"=="4" goto LT_RUN
if "%OPCION%"=="5" goto OPEN_UI
if "%OPCION%"=="6" goto OPEN_REPORTS_FOLDER
if "%OPCION%"=="7" exit /b 0

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
echo.
echo =======================================================
echo  Generando Reportes Ejecutivos y Documentos Word...
echo =======================================================
node scripts/traducir_reporte.js
node scripts/generar_dashboard_moderno.js
node scripts/generar_dossier_evidencias.js
node scripts/generar_reporte_word.js
if exist ".\cypress\results\dashboard_ejecutivo.html" (
    start "" ".\cypress\results\dashboard_ejecutivo.html"
)
if exist ".\cypress\results\reportes_word_por_cp" (
    start "" ".\cypress\results\reportes_word_por_cp"
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
echo.
echo =======================================================
echo  Generando Reportes Ejecutivos y Documentos Word...
echo =======================================================
node scripts/traducir_reporte.js
node scripts/generar_dashboard_moderno.js
node scripts/generar_dossier_evidencias.js
node scripts/generar_reporte_word.js
if exist ".\cypress\results\dashboard_ejecutivo.html" (
    start "" ".\cypress\results\dashboard_ejecutivo.html"
)
if exist ".\cypress\results\reportes_word_por_cp" (
    start "" ".\cypress\results\reportes_word_por_cp"
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
echo Ejecutando pruebas en BrowserStack Cloud (Multi-Navegador)...
if exist ".\node_modules\.bin\browserstack-cypress.cmd" (
    call ".\node_modules\.bin\browserstack-cypress.cmd" run --no-wrap
) else (
    call npx browserstack-cypress run --no-wrap
)
node scripts/generar_dossier_browserstack.js
if exist ".\cypress\results\dossier_browserstack_crossbrowser.html" (
    start "" ".\cypress\results\dossier_browserstack_crossbrowser.html"
)
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
if exist ".\node_modules\.bin\lambdatest-cypress.cmd" (
    call ".\node_modules\.bin\lambdatest-cypress.cmd" run --sync=true --specs="cypress/integration/rodrigo-villanueva/*.spec.js"
) else (
    call npx lambdatest-cypress run --sync=true --specs="cypress/integration/rodrigo-villanueva/*.spec.js"
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

:OPEN_REPORTS_FOLDER
echo.
echo Abriendo carpeta con todos los reportes, Word y evidencias...
if exist ".\cypress\results" (
    start "" ".\cypress\results"
) else (
    echo Aun no existen reportes. Ejecute primero alguna prueba.
)
pause
goto MENU
