const fs = require('fs');
const path = require('path');

const bstackJsonPath = path.join(__dirname, '..', 'results', 'browserstack-cypress-report.json');
const outputPath = path.join(__dirname, '..', 'cypress', 'results', 'dossier_browserstack_crossbrowser.html');

if (!fs.existsSync(bstackJsonPath)) {
  console.log('No se encontró el archivo de reporte de BrowserStack:', bstackJsonPath);
  console.log('Ejecute primero las pruebas en BrowserStack para generar los datos.');
  process.exit(0);
}

const bstackData = JSON.parse(fs.readFileSync(bstackJsonPath, 'utf8'));

const buildName = bstackData.build_name || 'BrowserStack Automation Build';
const projectName = bstackData.project_name || 'Rodrigo Villanueva QA';
const buildUrl = bstackData.build_url || 'https://automate.browserstack.com/dashboard/v2';
const publicBuildUrl = bstackData.public_build_url || buildUrl;
const durationStats = bstackData.build_duration || {};
const totalDurationSec = durationStats.total_duration || 0;
const startedAt = durationStats.started_at ? new Date(durationStats.started_at).toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'medium' }) : new Date().toLocaleString();

// Procesar filas de specs y navegadores
const specs = bstackData.rows || {};
const browserSummary = {};
const allTestsDetailed = [];

Object.keys(specs).forEach(specName => {
  const specData = specs[specName];
  const sessions = specData.sessions || [];

  sessions.forEach(session => {
    const browserName = session.name || 'Desconocido';
    if (!browserSummary[browserName]) {
      browserSummary[browserName] = {
        name: browserName,
        total: 0,
        passed: 0,
        failed: 0,
        duration: 0,
        sessionsCount: 0
      };
    }

    browserSummary[browserName].sessionsCount++;
    browserSummary[browserName].duration += (session.meta ? session.meta.duration : 0);

    (session.tests || []).forEach(t => {
      browserSummary[browserName].total++;
      if (t.status === 'passed') browserSummary[browserName].passed++;
      if (t.status === 'failed') browserSummary[browserName].failed++;

      allTestsDetailed.push({
        spec: specName,
        browser: browserName,
        testName: t.name,
        status: t.status,
        duration: (t.duration || 0).toFixed(2),
        sessionUrl: session.public_url || session.link || buildUrl
      });
    });
  });
});

const browsersList = Object.values(browserSummary);
const totalTestsCount = allTestsDetailed.length;
const totalPassesCount = allTestsDetailed.filter(t => t.status === 'passed').length;
const totalFailsCount = allTestsDetailed.filter(t => t.status === 'failed').length;
const overallRate = totalTestsCount > 0 ? Math.round((totalPassesCount / totalTestsCount) * 100) : 100;

const crossBrowserHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dossier Cross-Browser Multi-Navegador - BrowserStack Cloud</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: #090d16;
      background-image: 
        radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(56, 189, 248, 0.15) 0px, transparent 50%);
      color: #f8fafc;
      padding: 36px 20px;
      min-height: 100vh;
    }

    .container {
      max-width: 1300px;
      margin: 0 auto;
    }

    /* Header */
    .header {
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 28px 32px;
      margin-bottom: 28px;
      backdrop-filter: blur(16px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bstack-badge {
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-btn {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);
      transition: all 0.2s ease;
    }

    .header-btn:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
    }

    /* Resumen de Navegadores */
    .browsers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .browser-card {
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .browser-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .browser-name {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .browser-stats-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
      padding: 12px;
      border-radius: 10px;
      margin-top: 14px;
    }

    .stat-mini-val {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
    }

    .stat-mini-lbl {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 600;
    }

    /* Tabla Detallada */
    .table-card {
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(16px);
      overflow-x: auto;
    }

    .table-title {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    th {
      text-align: left;
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.03);
      color: #94a3b8;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    td {
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: #f1f5f9;
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .badge-pass {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 11px;
      display: inline-block;
    }

    .badge-fail {
      background: rgba(244, 63, 94, 0.15);
      color: #fb7185;
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 11px;
      display: inline-block;
    }

    .link-cloud {
      color: #38bdf8;
      text-decoration: none;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .link-cloud:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <div>
        <div class="brand-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
          </svg>
          Dossier Cross-Browser Cloud
          <span class="bstack-badge">BrowserStack</span>
        </div>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">
          Proyecto: <strong>${projectName}</strong> · Build: <strong>${buildName}</strong> · ${startedAt}
        </p>
      </div>

      <div>
        <a href="${publicBuildUrl}" target="_blank" class="header-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Ver Videos & Dashboard en BrowserStack Cloud
        </a>
      </div>
    </header>

    <!-- Resumen de Navegadores -->
    <div class="browsers-grid">
      ${browsersList.map(b => `
        <div class="browser-card">
          <div class="browser-header">
            <div class="browser-name">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              ${b.name}
            </div>
            <span class="${b.failed === 0 ? 'badge-pass' : 'badge-fail'}">
              ${b.failed === 0 ? '100% OK' : b.failed + ' Fallos'}
            </span>
          </div>

          <div class="browser-stats-row">
            <div>
              <div class="stat-mini-val" style="color: #38bdf8;">${b.total}</div>
              <div class="stat-mini-lbl">Pruebas</div>
            </div>
            <div>
              <div class="stat-mini-val" style="color: #34d399;">${b.passed}</div>
              <div class="stat-mini-lbl">Aprobadas</div>
            </div>
            <div>
              <div class="stat-mini-val" style="color: #c084fc;">${(b.duration).toFixed(1)}s</div>
              <div class="stat-mini-lbl">Tiempo</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Tabla Detallada por CP -->
    <div class="table-card">
      <div class="table-title">
        <span>Matriz de Ejecución de Casos de Prueba por Navegador</span>
        <span style="font-size: 13px; color: #94a3b8; font-weight: 500;">
          Total: ${totalTestsCount} ejecuciones registradas
        </span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Caso de Prueba (CP)</th>
            <th>Módulo / Spec</th>
            <th>Navegador y OS</th>
            <th>Estado</th>
            <th>Duración</th>
            <th>Evidencia Cloud</th>
          </tr>
        </thead>
        <tbody>
          ${allTestsDetailed.map(t => `
            <tr>
              <td style="font-weight: 600;">${t.testName}</td>
              <td><code>${t.spec}</code></td>
              <td>${t.browser}</td>
              <td>
                <span class="${t.status === 'passed' ? 'badge-pass' : 'badge-fail'}">
                  ${t.status === 'passed' ? '✓ APROBADO' : '✕ FALLIDO'}
                </span>
              </td>
              <td style="font-family: monospace;">${t.duration}s</td>
              <td>
                <a class="link-cloud" href="${t.sessionUrl}" target="_blank">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Ver Video & Logs
                </a>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

  </div>
</body>
</html>
`;

fs.writeFileSync(outputPath, crossBrowserHtml, 'utf8');
console.log('✅ Dossier Cross-Browser de BrowserStack generado en:', outputPath);
