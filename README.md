# 🚀 QA Automation Framework con Cypress, BrowserStack y LambdaTest

[![Cypress Version](https://img.shields.io/badge/Cypress-v16.1.0-00BF88?style=for-the-badge&logo=cypress&logoColor=white)](https://www.cypress.io/)
[![Node Version](https://img.shields.io/badge/Node.js-16%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![BrowserStack Supported](https://img.shields.io/badge/BrowserStack-Cloud_Testing-FF8000?style=for-the-badge&logo=browserstack&logoColor=white)](https://www.browserstack.com/)
[![LambdaTest Supported](https://img.shields.io/badge/LambdaTest-Cross_Browser-0084FF?style=for-the-badge&logo=lambdatest&logoColor=white)](https://www.lambdatest.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

Framework robusto y modular de **Automatización de Pruebas End-to-End (E2E)** desarrollado con **Cypress**. Integra ejecución local (Headed / Headless), ejecución distribuida en la nube (**BrowserStack** y **LambdaTest**), y un sistema avanzado de **generación de evidencias y reportería ejecutiva** (Dashboards HTML interactivos, Dossier Cross-Browser y Documentos Word por caso de prueba).

---

## 📑 Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Stack Tecnológico y Versiones](#️-stack-tecnológico-y-versiones)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Suite de Casos de Prueba](#-suite-de-casos-de-prueba)
5. [Requisitos Previos](#-requisitos-previos)
6. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
7. [Configuración de Credenciales Cloud](#-configuración-de-credenciales-cloud)
8. [Modos de Ejecución](#-modos-de-ejecución)
   - [A. Menú Interactivo en Windows (`ejecutar_pruebas.bat`)](#a-menú-interactivo-en-windows-ejecutar_pruebasbat)
   - [B. Comandos de Terminal (CLI)](#b-comandos-de-terminal-cli)
9. [Sistema de Reportería y Evidencias](#-sistema-de-reportería-y-evidencias)
10. [Scripts de Automatización y Utilidades](#-scripts-de-automatización-y-utilidades)
11. [Buenas Prácticas y Seguridad](#-buenas-prácticas-y-seguridad)
12. [Contribución y Contacto](#-contribución-y-contacto)

---

## ✨ Características Principales

- **Multi-Entorno & Cross-Browser**: Ejecución simultánea en Google Chrome, Mozilla Firefox, Microsoft Edge y Electron sobre plataformas Windows, macOS y Linux.
- **Integración Cloud**: Conectores listos para pruebas en paralelo a gran escala con [BrowserStack Automate](https://www.browserstack.com/) y [LambdaTest Automation](https://www.lambdatest.com/).
- **Reportería Multinivel**:
  - 📊 **Mochawesome Report**: Reporte HTML visual con métricas, duración y detalles de assertions.
  - 📈 **Dashboard Ejecutivo Moderno**: Interfaz web con gráficos de estado, tasa de éxito y métricas de rendimiento.
  - 📸 **Dossier de Evidencias HTML**: Visor centralizado de capturas de pantalla automáticas paso a paso.
  - 🌐 **Dossier Cross-Browser**: Comparativa de compatibilidad entre navegadores y sistemas operativos.
  - 📄 **Reportes en Microsoft Word (`.doc`)**: Generación automática de documentos individuales por Caso de Prueba (CP) con capturas embebidas para auditoría y entregables.
- **Automatización en 1-Clic**: Scripts batch (`.bat`) interactivos que simplifican la instalación y ejecución sin necesidad de memorizar comandos.

---

## 📂 Estructura del Proyecto

```text
BrowserStack-pruebas/
├── .github/
│   └── dependabot.yml           # Actualizaciones automáticas de seguridad
├── cypress/
│   ├── fixtures/                # Datos de prueba estáticos (JSON / Mock data)
│   ├── integration/             # Especificaciones de prueba (*.spec.js)
│   │   ├── rodrigo-villanueva/  # Suite principal de pruebas E2E por módulos
│   │   ├── 1-getting-started/   # Ejemplos base de Cypress
│   │   └── 2-advanced-examples/ # Pruebas avanzadas de referencia
│   ├── screenshots/             # Capturas de pantalla tomadas durante la ejecución
│   ├── support/                 # Comandos personalizados y configuración global
│   │   ├── commands.js          # Custom commands de Cypress (login, esperas, etc.)
│   │   └── e2e.js               # Eventos globales y hooks del ciclo de vida
│   └── videos/                  # Grabaciones de video de las pruebas
├── results/                     # Directorio de salida de reportes generados
│   ├── mochawesome/             # Reportes HTML y JSON de Mochawesome
│   ├── reportes_word_por_cp/    # Documentos Word generados por caso de prueba
│   ├── dashboard_ejecutivo.html # Dashboard analítico interactivo
│   ├── dossier_evidencias.html  # Dossier fotográfico de evidencias
│   └── dossier_browserstack...  # Reporte de matriz de navegadores en la nube
├── scripts/                     # Scripts Node.js para procesamiento y reportes
│   ├── traducir_reporte.js            # Normalización y traducción de resultados
│   ├── generar_dashboard_moderno.js   # Generador del Dashboard HTML
│   ├── generar_dossier_evidencias.js  # Compilador de screenshots y evidencias
│   ├── generar_reporte_word.js        # Generador de reportes Word (.doc)
│   └── generar_dossier_browserstack.js# Compilador de métricas en BrowserStack
├── browserstack.json            # Configuración para BrowserStack Cloud
├── lambdatest-config.json       # Configuración para LambdaTest Cloud
├── cypress.config.js            # Configuración principal de Cypress (v16+)
├── package.json                 # Dependencias npm y scripts del proyecto
├── install.bat                  # Instalador interactivo automático para Windows
└── ejecutar_pruebas.bat         # Panel interactivo de ejecución de pruebas
```

---

## 🧪 Suite de Casos de Prueba

La suite ubicada en [`cypress/integration/rodrigo-villanueva/`](file:///c:/Users/amilc/BrowserStack-pruebas/cypress/integration/rodrigo-villanueva) cubre flujos de usuario reales y componentes web complejos:

| Archivo de Prueba | Módulo / Funcionalidad Evaluada |
| :--- | :--- |
| `01_home_portal.spec.js` | Navegación inicial, validación de cabeceras, enlaces y layout principal. |
| `02_lab_login.spec.js` | Autenticación, validación de credenciales válidas/inválidas y manejo de sesiones. |
| `03_lab_formularios.spec.js` | Campos de texto, checkboxes, radio buttons, selects dinámicos y validaciones. |
| `04_lab_busqueda.spec.js` | Motores de búsqueda interna, filtros interactivos y listados de resultados. |
| `05_lab_ecommerce.spec.js` | Carrito de compras, selección de productos y flujo de checkout. |
| `06_lab_alertas_modal.spec.js` | Diálogos JavaScript (`alert`, `confirm`, `prompt`), modales y ventanas emergentes. |
| `07_lab_upload.spec.js` | Carga y descarga de archivos de diferentes extensiones. |
| `08_lab_tablas_dinamicas.spec.js` | Lectura de tablas de datos, paginación y ordenamiento por columnas. |
| `09_lab_formulario_multipaso.spec.js` | Asistentes de registro por etapas (Wizards multi-step). |

---

## 🛠️ Stack Tecnológico y Versiones

El proyecto está configurado y probado con las siguientes versiones oficiales de herramientas y librerías:

| Componente / Librería | Versión Exacta | Rol en el Framework |
| :--- | :---: | :--- |
| **[Cypress](https://www.cypress.io/)** | `v16.1.0` *(Última)* | Framework principal de ejecución de pruebas E2E |
| **[BrowserStack Cypress CLI](https://www.npmjs.com/package/browserstack-cypress-cli)** | `v1.37.1` | Cliente CLI para orquestación de pruebas en BrowserStack Cloud |
| **[LambdaTest Cypress CLI](https://www.npmjs.com/package/lambdatest-cypress-cli)** | `v3.0.50` | Cliente CLI para ejecución de pruebas en LambdaTest Cloud |
| **[cypress-mochawesome-reporter](https://www.npmjs.com/package/cypress-mochawesome-reporter)** | `v5.0.0` | Generación de reportes HTML interactivos con capturas |
| **[cypress-downloadfile](https://www.npmjs.com/package/cypress-downloadfile)** | `v1.2.4` | Plugin para gestión y descarga de archivos de prueba |
| **[Node.js](https://nodejs.org/)** | `16.x` / `18.x` / `20.x` / `22.x`+ | Entorno de ejecución JavaScript |
| **[npm](https://www.npmjs.com/)** | `8.x` / `9.x` / `10.x` / `11.x` | Gestor de paquetes y dependencias |

---

## ⚙️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de contar con:

- **[Node.js](https://nodejs.org/)**: Versión `16.x` o superior (Compatible hasta `Node 24.x`).
- **[npm](https://www.npmjs.com/)**: Versión `8.x` o superior.
- **Navegador**: Google Chrome, Mozilla Firefox, Microsoft Edge o Electron instalados en el sistema local.
- **Git**: Para clonar y versionar el repositorio.

---

## 📥 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/Amilcar1998/BrowserStack-pruebas.git
cd BrowserStack-pruebas
```

### 2. Instalación Rápida

#### Opción A: En Windows con el instalador automático
Haz doble clic sobre:
```text
install.bat
```
*Este instalador detecta automáticamente el entorno Node.js, resuelve dependencias (`npm install`) y valida la instalación del binario de Cypress (`npx cypress install`).*

#### Opción B: Mediante terminal
```bash
# Instalar dependencias de Node.js
npm install

# Verificar e instalar el binario nativo de Cypress
npx cypress install
```

---

## 🔐 Configuración de Credenciales Cloud

Para ejecutar pruebas en la nube ([BrowserStack](https://www.browserstack.com/) o [LambdaTest](https://www.lambdatest.com/)):

> [!IMPORTANT]
> **Seguridad:** Nunca subas tus claves o tokens de acceso a repositorios públicos. Puedes definir tus credenciales en los archivos JSON correspondientes o mediante variables de entorno del sistema.

### Configurar BrowserStack
Edita la sección `auth` en `browserstack.json`:
```json
{
  "auth": {
    "username": "TU_USUARIO_BROWSERSTACK",
    "access_key": "TU_ACCESS_KEY_BROWSERSTACK"
  }
}
```
*O mediante variables de entorno:*
- `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_ACCESS_KEY`

### Configurar LambdaTest
Edita la sección `lambdatest_auth` en `lambdatest-config.json`:
```json
{
  "lambdatest_auth": {
    "username": "TU_USUARIO_LAMBDATEST",
    "access_key": "TU_ACCESS_KEY_LAMBDATEST"
  }
}
```
*O mediante variables de entorno:*
- `LT_USERNAME`
- `LT_ACCESS_KEY`

---

## 🎮 Modos de Ejecución

### A. Menú Interactivo en Windows (`ejecutar_pruebas.bat`)

Ejecuta con doble clic el archivo `ejecutar_pruebas.bat` para acceder al panel de control:

```text
=======================================================
          SUITE DE PRUEBAS AUTOMATIZADAS QA
=======================================================
1. Ejecutar Suite Rodrigo EN VIVO (Chrome + Word + Evidencias)
2. Ejecutar Suite Rodrigo (Headless + Word + Evidencias)
3. Ejecutar en BrowserStack Cloud (Multi-Navegador)
4. Ejecutar en LambdaTest Cloud
5. Abrir Cypress UI Interactivo (cypress open)
6. Abrir Carpeta con todos los Reportes y Evidencias
7. Salir
=======================================================
```

- **Opción 1 (Headed)**: Abre Chrome visiblemente, corre los 9 módulos de prueba, genera automáticamente el Dashboard HTML, Dossier de Evidencias y los Reportes Word individuales, abriéndolos al finalizar.
- **Opción 2 (Headless)**: Ejecuta las pruebas en segundo plano a máxima velocidad y compila los reportes.
- **Opción 3 (BrowserStack Cloud)**: Despliega la ejecución paralela en BrowserStack en múltiples combinaciones de navegadores y SO (Windows 11 / macOS Sonoma).
- **Opción 4 (LambdaTest Cloud)**: Lanza la ejecución en la red de LambdaTest.
- **Opción 5 (Cypress UI)**: Inicia el Test Runner gráfico oficial de Cypress para depuración en tiempo real.
- **Opción 6 (Abrir Reportes)**: Abre el explorador de archivos directamente en `cypress/results/`.

---

### B. Comandos de Terminal (CLI)

#### 1. Ejecución Local (Headless)
```bash
# Ejecutar toda la suite de Rodrigo Villanueva
npx cypress run --spec "cypress/integration/rodrigo-villanueva/*.spec.js"

# Ejecutar un archivo de prueba específico
npx cypress run --spec "cypress/integration/rodrigo-villanueva/02_lab_login.spec.js"
```

#### 2. Ejecución Local con Navegador Visible (Headed)
```bash
npx cypress run --headed --browser chrome --spec "cypress/integration/rodrigo-villanueva/*.spec.js"
```

#### 3. Abrir la Interfaz Gráfica (Test Runner)
```bash
npx cypress open
```

#### 4. Ejecución en BrowserStack Cloud
```bash
npx browserstack-cypress run --no-wrap
```

#### 5. Ejecución en LambdaTest Cloud
```bash
npx lambdatest-cypress run --sync=true --specs="cypress/integration/rodrigo-villanueva/*.spec.js"
```

#### 6. Generar Todos los Reportes Manualmente
```bash
node scripts/traducir_reporte.js
node scripts/generar_dashboard_moderno.js
node scripts/generar_dossier_evidencias.js
node scripts/generar_reporte_word.js
```

---

## 📊 Sistema de Reportería y Evidencias

Una vez finalizadas las pruebas, los resultados se compilan en `cypress/results/`:

```text
cypress/results/
├── dashboard_ejecutivo.html              # Dashboard visual interactivo con KPIs
├── dossier_evidencias.html               # Dossier completo con capturas de pantalla
├── dossier_browserstack_crossbrowser.html# Reporte de compatibilidad en la nube
├── mochawesome/                          # Reporte estándar Mochawesome
└── reportes_word_por_cp/                 # Documentos .doc listos para auditoría
    ├── CP01_Home_Portal.doc
    ├── CP02_Lab_Login.doc
    ├── CP03_Lab_Formularios.doc
    └── ...
```

### Tipos de Reportes Incluidos:
1. **Dashboard Ejecutivo Moderno**: Proporciona métricas clave (Total de pruebas, % de aprobación, tiempos medios de respuesta, desglose por suite).
2. **Dossier de Evidencias**: Galería paso a paso de cada acción ejecutada, con trazabilidad visual de assertions e inspección de elementos.
3. **Reportes Word (.doc) por Caso de Prueba**: Archivos individuales formateados profesionalmente con tabla de detalles del caso, datos de entrada, estado de ejecución y capturas de pantalla integradas.

---

## 🛠️ Scripts de Automatización y Utilidades

El directorio [`scripts/`](file:///c:/Users/amilc/BrowserStack-pruebas/scripts) contiene utilidades construidas en Node.js que potencian el flujo de trabajo:

- **[`traducir_reporte.js`](file:///c:/Users/amilc/BrowserStack-pruebas/scripts/traducir_reporte.js)**: Normaliza la salida JSON de Mochawesome traduciendo estados y mensajes de error al español.
- **[`generar_dashboard_moderno.js`](file:///c:/Users/amilc/BrowserStack-pruebas/scripts/generar_dashboard_moderno.js)**: Construye una interfaz HTML moderna y responsiva con gráficos estadísticos.
- **[`generar_dossier_evidencias.js`](file:///c:/Users/amilc/BrowserStack-pruebas/scripts/generar_dossier_evidencias.js)**: Mapea capturas de pantalla y videos generados durante la prueba con sus respectivos pasos.
- **[`generar_reporte_word.js`](file:///c:/Users/amilc/BrowserStack-pruebas/scripts/generar_reporte_word.js)**: Exporta informes individuales en formato Microsoft Word estructurados para entrega a clientes o QA Leads.
- **[`generar_dossier_browserstack.js`](file:///c:/Users/amilc/BrowserStack-pruebas/scripts/generar_dossier_browserstack.js)**: Consolida los logs de la API de BrowserStack y genera un resumen de compatibilidad cross-platform.

---

## 🛡️ Buenas Prácticas y Seguridad

- **Exclusión de Secretos**: Los archivos con credenciales reales (`browserstack.json`, `lambdatest-config.json`, `.env`) no deben incluirse en commits con datos de producción.
- **Dependencias Seguras**: Monitoreadas periódicamente con `npm audit` y GitHub Dependabot.
- **Selectores Robustos**: Pruebas diseñadas utilizando atributos semánticos y buenas prácticas recomendadas por Cypress para evitar falsos positivos por cambios en el DOM.

---

## 👥 Contribución y Contacto

Las contribuciones, mejoras y sugerencias son bienvenidas.

1. Haz un Fork del proyecto.
2. Crea tu rama de características (`git checkout -b feature/NuevaCaracteristica`).
3. Realiza tus cambios y haz commit (`git commit -m 'feat: Agregada nueva caracteristica'`).
4. Haz Push a la rama (`git push origin feature/NuevaCaracteristica`).
5. Abre un **Pull Request**.

---

Desarrollado para la automatización y aseguramiento de calidad de software (QA).
