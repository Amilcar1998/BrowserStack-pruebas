# Framework de Automatización de Pruebas con Cypress, BrowserStack y LambdaTest

Este repositorio contiene la infraestructura de pruebas automatizadas End-to-End (E2E) desarrolladas con **Cypress**, configuradas para ejecutarse tanto de forma **local** como en plataformas en la nube (**BrowserStack** y **LambdaTest**).

---

## 📋 Tabla de Contenidos
1. [Estructura del Proyecto](#-estructura-del-proyecto)
2. [Requisitos Previos](#-requisitos-previos)
3. [Instalación Rápida](#-instalación-rápida)
4. [Ejecución de Pruebas](#-ejecución-de-pruebas)
   - [Usando el Script Interactivo (`ejecutar_pruebas.bat`)](#opción-1-script-interactivo-ejecutar_pruebasbat)
   - [Comandos de Consola](#opción-2-comandos-de-consola)
5. [Configuraciones de la Nube](#-configuraciones-de-la-nube)
   - [BrowserStack (`browserstack.json`)](#browserstack-browserstackjson)
   - [LambdaTest (`lambdatest-config.json`)](#lambdatest-lambdatest-configjson)
6. [Reportes y Evidencias](#-reportes-y-evidencias)
7. [Seguridad y Gestión de Vulnerabilidades](#-seguridad-y-gestión-de-vulnerabilidades)

---

## 📂 Estructura del Proyecto

```text
BrowserStack-pruebas/
├── .git/
├── cypress/
│   ├── fixtures/               # Datos de prueba (JSON estáticos)
│   ├── integration/            # Casos de prueba automatizados (*.spec.js)
│   │   ├── 1-getting-started/  # Pruebas básicas (ej. todo.spec.js)
│   │   └── 2-advanced-examples/# Pruebas avanzadas de Cypress
│   ├── screenshots/            # Capturas de pantalla de fallos
│   ├── support/                # Comandos personalizados y soporte global
│   │   ├── commands.js
│   │   └── e2e.js              # Soporte global y registro de reportería
│   └── videos/                 # Grabaciones en video de las ejecuciones
├── browserstack.json           # Configuración de ejecución en BrowserStack Cloud
├── cypress.config.js           # Configuración moderna de Cypress (v16+)
├── ejecutar_pruebas.bat        # Menú interactivo en Windows para lanzar ejecuciones
├── install.bat                 # Script de instalación automática de paquetes y Cypress
├── lambdatest-config.json      # Configuración de ejecución en LambdaTest Cloud
├── package.json                # Dependencias del proyecto y scripts npm
└── results/                    # Reportes generados (HTML y JSON)
```

---

## ⚙️ Requisitos Previos

- **Node.js**: Versión 16+ instalada (el instalador `.bat` también detecta instalaciones estándar de Visual Studio y Heroku).
- **Navegador**: Google Chrome, Mozilla Firefox, Microsoft Edge o Electron (incluido con Cypress).
- **Credenciales Cloud** (Opcional para ejecuciones remotas):
  - Usuario y Access Key de [BrowserStack](https://www.browserstack.com/).
  - Usuario y Access Key de [LambdaTest](https://www.lambdatest.com/).

---

## 🚀 Instalación Rápida

### Opción 1: Con el instalador automático en Windows
Haz doble clic sobre el archivo:
```text
install.bat
```
Este script:
1. Detecta automáticamente las rutas de Node.js y npm.
2. Instala todas las dependencias del proyecto (`npm install`).
3. Descarga y verifica el binario nativo de Cypress (`cypress install`).

### Opción 2: Desde la terminal
```bash
# 1. Instalar dependencias de Node
npm install

# 2. Instalar y verificar el binario de Cypress
npx cypress install
```

---

## 🧪 Ejecución de Pruebas

### Opción 1: Script interactivo (`ejecutar_pruebas.bat`)
Haz doble clic sobre `ejecutar_pruebas.bat` para acceder al menú interactivo:

```text
=======================================================
          EJECUCION DE PRUEBAS DE AUTOMATIZACION
=======================================================
1. Ejecutar Cypress localmente (Modo Headless / CLI)
2. Abrir Cypress UI interactivo (cypress open)
3. Ejecutar en BrowserStack Cloud (browserstack-cypress run)
4. Ejecutar en LambdaTest Cloud (lambdatest-cypress run)
5. Ver reporte de vulnerabilidades (npm audit)
6. Salir
=======================================================
```

---

### Opción 2: Comandos de Consola

#### 1. Ejecución Local (Modo Headless)
Ejecuta todas las pruebas en segundo plano en la consola:
```bash
npx cypress run
```
*Para ejecutar una prueba específica:*
```bash
npx cypress run --spec "cypress/integration/1-getting-started/todo.spec.js"
```

#### 2. Ejecución Local Interactiva (Cypress Test Runner)
Abre la interfaz gráfica de Cypress para depuración en vivo:
```bash
npx cypress open
```

#### 3. Ejecución en BrowserStack Cloud
Ejecuta las pruebas en paralelo en múltiples navegadores y sistemas operativos en la nube de BrowserStack:
```bash
npx browserstack-cypress-cli run
```

#### 4. Ejecución en LambdaTest Cloud
Ejecuta la suite en la infraestructura distribuida de LambdaTest:
```bash
npx lambdatest-cypress run
```

---

## ☁️ Configuraciones de la Nube

### BrowserStack (`browserstack.json`)
El archivo `browserstack.json` define:
- **`auth`**: `username` y `access_key` para la API de BrowserStack.
- **`browsers`**: Matriz de navegadores y sistemas operativos a probar:
  - Google Chrome (Windows 10, versiones `latest`, `latest - 1`)
  - Mozilla Firefox (OS X Mojave, versiones `latest`, `latest - 1`)
- **`run_settings`**:
  - `parallels`: `4` (hilos en paralelo).
  - `cypress_version`: `9.7.0`.
  - `project_name` y `build_name`: Nombres descriptivos para el dashboard.

### LambdaTest (`lambdatest-config.json`)
Define la integración con LambdaTest:
- `lambdatest_auth`: Credenciales de acceso.
- `browsers`: Dispositivos y navegadores objetivo.
- `run_settings`: Configuración de artefactos, reportes y paralelismo (`parallels: 1`).

---

## 📊 Reportes y Evidencias

- **Capturas de pantalla (`screenshots`)**: Se guardan automáticamente en caso de error en `cypress/screenshots/`.
- **Videos (`videos`)**: Grabación completa de la ejecución de cada archivo de prueba en `cypress/videos/`.
- **Mochawesome Report**: Reporte HTML y JSON consolidado en `cypress/results/` según las directivas de `base_reporter_config.json`.

---

## 🛡️ Seguridad y Gestión de Vulnerabilidades

El proyecto utiliza Cypress versión `9.7.0`. Al auditar mediante `npm audit`, se detectan dependencias subyacentes con reportes de seguridad comunes en versiones legadas (como `extract-zip`, `form-data`, `minimatch`, `lodash`, `serialize-javascript`).

- **Para entornos locales/QA**: No comprometen la integridad de las pruebas E2E ya que no se exponen servicios públicos.
- **Correcciones automáticas no destructivas**:
  ```bash
  npm audit fix
  ```
- **Migración mayor a Cypress 13+ / 14+**:
  ```bash
  npm audit fix --force
  ```
  *(Nota: Requiere migrar `cypress.json` a `cypress.config.js` y ajustar la estructura de carpetas `cypress/e2e`).*
