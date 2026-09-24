@echo off
setlocal enabledelayedexpansion
title Ejecutor de Pruebas Cypress / BrowserStack

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
echo          EJECUCION DE PRUEBAS DE AUTOMATIZACION
echo =======================================================
echo 1. Ejecutar Suite Rodrigo EN VIVO (Chrome + Evidencias)
echo 2. Ejecutar Suite Rodrigo (Modo Silencioso / Headless)
echo 3. Abrir Cypress UI Interactivo (cypress open)
echo 4. Ejecutar todas las pruebas Cypress locales
echo 5. Ejecutar en BrowserStack Cloud (Multi-Navegador)
echo 6. Ejecutar en LambdaTest Cloud (lambdatest-cypress run)
echo 7. Ver Dashboard Ejecutivo Moderno (dashboard_ejecutivo.html)
echo 8. Ver Dossier Oficial de Evidencias QA (HTML / Imprimir PDF)
echo 9. Abrir Carpeta de Reportes Word por cada CP (.doc)
echo 10. Abrir Reporte Maestro Consolidado en Word (.doc)
echo 11. Ver Dossier Cross-Browser de BrowserStack (Cloud)
echo 12. Ver reporte HTML Mochawesome traducido
echo 13. Ver reporte de vulnerabilidades (npm audit)
echo 14. Salir
echo =======================================================
set /p OPCION="Seleccione una opcion (1-14): "

if "%OPCION%"=="1" goto RODRIGO_HEADED
if "%OPCION%"=="2" goto RODRIGO_RUN
if "%OPCION%"=="3" goto OPEN_UI
if "%OPCION%"=="4" goto LOCAL_RUN
if "%OPCION%"=="5" goto BS_RUN
if "%OPCION%"=="6" goto LT_RUN
if "%OPCION%"=="7" goto VIEW_MODERN_DASHBOARD
if "%OPCION%"=="8" goto VIEW_DOSSIER
if "%OPCION%"=="9" goto VIEW_WORD_FOLDER
if "%OPCION%"=="10" goto VIEW_WORD_MASTER
if "%OPCION%"=="11" goto VIEW_BS_DOSSIER
if "%OPCION%"=="12" goto VIEW_REPORT
if "%OPCION%"=="13" goto AUDIT_RUN
if "%OPCION%"=="14" exit /b 0

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
node scripts/generar_dashboard_moderno.js
node scripts/generar_dossier_evidencias.js
node scripts/generar_reporte_word.js
if exist ".\cypress\results\dashboard_ejecutivo.html" (
    start "" ".\cypress\results\dashboard_ejecutivo.html"
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
node scripts/generar_dashboard_moderno.js
node scripts/generar_dossier_evidencias.js
node scripts/generar_reporte_word.js
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
node scripts/generar_dashboard_moderno.js
node scripts/generar_dossier_evidencias.js
node scripts/generar_reporte_word.js
pause
goto MENU

:VIEW_WORD_FOLDER
echo.
echo Abriendo carpeta de reportes Word por cada Caso de Prueba...
node scripts/generar_reporte_word.js
if exist ".\cypress\results\reportes_word_por_cp" (
    start "" ".\cypress\results\reportes_word_por_cp"
) else (
    echo Aun no existen reportes. Ejecute primero alguna prueba.
)
pause
goto MENU

:VIEW_WORD_MASTER
echo.
echo Abriendo Reporte Maestro Consolidado en Word...
node scripts/generar_reporte_word.js
if exist ".\cypress\results\Reporte_Evidencias_QA_Casos_de_Prueba.doc" (
    start "" ".\cypress\results\Reporte_Evidencias_QA_Casos_de_Prueba.doc"
) else (
    echo Aun no existe el archivo. Ejecute primero alguna prueba.
)
pause
goto MENU

:VIEW_DOSSIER
echo.
echo Abriendo Dossier Oficial de Evidencias QA con Capturas por CP...
node scripts/generar_dossier_evidencias.js
if exist ".\cypress\results\dossier_evidencias_qa.html" (
    start "" ".\cypress\results\dossier_evidencias_qa.html"
) else (
    echo Aun no existe el archivo de evidencias. Ejecute primero alguna prueba.
)
pause
goto MENU

:VIEW_BS_DOSSIER
echo.
echo Abriendo Dossier Cross-Browser Multi-Navegador de BrowserStack...
node scripts/generar_dossier_browserstack.js
if exist ".\cypress\results\dossier_browserstack_crossbrowser.html" (
    start "" ".\cypress\results\dossier_browserstack_crossbrowser.html"
) else (
    echo Aun no existe el reporte de BrowserStack. Ejecute primero la opcion 5.
)
pause
goto MENU

:VIEW_MODERN_DASHBOARD
echo.
echo Abriendo Dashboard Ejecutivo Moderno (Alta Definicion)...
node scripts/generar_dashboard_moderno.js
if exist ".\cypress\results\dashboard_ejecutivo.html" (
    start "" ".\cypress\results\dashboard_ejecutivo.html"
) else (
    echo Aun no existe el archivo de dashboard. Ejecute primero alguna prueba.
)
pause
goto MENU

:VIEW_REPORT
echo.
echo Abriendo reporte HTML Mochawesome traducido...
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
echo Ejecutando pruebas en BrowserStack Cloud (Multi-Navegador)...
if exist ".\node_modules\.bin\browserstack-cypress.cmd" (
    call ".\node_modules\.bin\browserstack-cypress.cmd" run
) else (
    call npx browserstack-cypress run
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

:AUDIT_RUN
echo.
echo Ejecutando analisis de vulnerabilidades...
call npm audit
pause
goto MENU
