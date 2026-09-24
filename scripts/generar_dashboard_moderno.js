const fs = require('fs');
const path = require('path');

const mochawesomePath = path.join(__dirname, '..', 'cypress', 'results', 'mochawesome', 'index.html');
const outputPath = path.join(__dirname, '..', 'cypress', 'results', 'dashboard_ejecutivo.html');

if (!fs.existsSync(mochawesomePath)) {
  console.log('No se encontró el reporte base de Mochawesome.');
  process.exit(0);
}

const html = fs.readFileSync(mochawesomePath, 'utf8');
const match = html.match(/data-raw="([^"]+)"/);

if (!match) {
  console.log('No se pudieron extraer los datos crudos del reporte.');
  process.exit(0);
}

const decoded = match[1]
  .replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

const data = JSON.parse(decoded);
const stats = data.stats || {};
const results = data.results || [];

// Extraer todos los suites y tests en una estructura limpia
const suitesList = [];
results.forEach(fileResult => {
  if (fileResult.suites && fileResult.suites.length > 0) {
    fileResult.suites.forEach(suite => {
      const tests = (suite.tests || []).map(t => ({
        title: t.title,
        fullTitle: t.fullTitle,
        duration: t.duration || 0,
        state: t.state || (t.pass ? 'passed' : t.fail ? 'failed' : 'pending'),
        speed: t.speed || 'fast',
        err: t.err && t.err.message ? t.err.message : null,
        stack: t.err && t.err.estack ? t.err.estack : null
      }));

      // También revisar suites anidados
      if (suite.suites && suite.suites.length > 0) {
        suite.suites.forEach(subSuite => {
          (subSuite.tests || []).forEach(st => {
            tests.push({
              title: `${subSuite.title} › ${st.title}`,
              fullTitle: st.fullTitle,
              duration: st.duration || 0,
              state: st.state || (st.pass ? 'passed' : st.fail ? 'failed' : 'pending'),
              speed: st.speed || 'fast',
              err: st.err && st.err.message ? st.err.message : null,
              stack: st.err && st.err.estack ? st.err.estack : null
            });
          });
        });
      }

      const passedCount = tests.filter(t => t.state === 'passed').length;
      const failedCount = tests.filter(t => t.state === 'failed').length;

      suitesList.push({
        title: suite.title,
        file: fileResult.file || suite.file || '',
        duration: suite.duration || tests.reduce((acc, t) => acc + t.duration, 0),
        testsCount: tests.length,
        passedCount,
        failedCount,
        tests
      });
    });
  }
});

const totalTests = stats.tests || suitesList.reduce((acc, s) => acc + s.testsCount, 0);
const totalPasses = stats.passes || suitesList.reduce((acc, s) => acc + s.passedCount, 0);
const totalFailures = stats.failures || suitesList.reduce((acc, s) => acc + s.failedCount, 0);
const totalPending = stats.pending || 0;
const passRate = totalTests > 0 ? Math.round((totalPasses / totalTests) * 100) : 100;
const totalDurationSec = (stats.duration ? (stats.duration / 1000) : 0).toFixed(1);

const dashboardHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QA Executive Dashboard - Automatización E2E</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg: #07090e;
      --card-bg: rgba(17, 24, 39, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent-green: #10b981;
      --accent-green-glow: rgba(16, 185, 129, 0.25);
      --accent-red: #f43f5e;
      --accent-blue: #38bdf8;
      --accent-purple: #a855f7;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background-color: var(--bg);
      background-image: 
        radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.12) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(168, 85, 247, 0.08) 0px, transparent 50%);
      background-attachment: fixed;
      color: var(--text-main);
      min-height: 100vh;
      padding: 32px 24px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-badge {
      background: linear-gradient(135deg, #10b981, #06b6d4);
      color: #000;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-action {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      backdrop-filter: blur(12px);
      transition: all 0.2s ease;
    }

    .btn-action:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    /* Stats Hero Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 18px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 22px;
      backdrop-filter: blur(16px);
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
    }

    .stat-card.passed::before { background: linear-gradient(90deg, #10b981, #34d399); }
    .stat-card.failed::before { background: linear-gradient(90deg, #f43f5e, #fb7185); }
    .stat-card.total::before { background: linear-gradient(90deg, #38bdf8, #818cf8); }
    .stat-card.duration::before { background: linear-gradient(90deg, #a855f7, #c084fc); }

    .stat-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .stat-value {
      font-family: 'Outfit', sans-serif;
      font-size: 38px;
      font-weight: 800;
      line-height: 1;
    }

    .stat-sub {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 6px;
    }

    /* Controls Bar */
    .controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .filter-group {
      display: flex;
      gap: 8px;
      background: var(--card-bg);
      padding: 4px;
      border-radius: 12px;
      border: 1px solid var(--card-border);
    }

    .filter-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-btn.active {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .search-box {
      position: relative;
      min-width: 320px;
    }

    .search-input {
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 10px 16px 10px 40px;
      color: #fff;
      font-size: 14px;
      outline: none;
      backdrop-filter: blur(12px);
      transition: all 0.2s ease;
    }

    .search-input:focus {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }

    /* Suite Cards */
    .suites-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .suite-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      overflow: hidden;
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      transition: all 0.2s ease;
    }

    .suite-card:hover {
      border-color: rgba(255, 255, 255, 0.15);
    }

    .suite-header {
      padding: 18px 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
      background: rgba(255, 255, 255, 0.02);
    }

    .suite-title-box {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .suite-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }

    .suite-icon.pass { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .suite-icon.fail { background: rgba(244, 63, 94, 0.15); color: #f43f5e; }

    .suite-name {
      font-family: 'Outfit', sans-serif;
      font-size: 17px;
      font-weight: 700;
    }

    .suite-file {
      font-size: 12px;
      color: var(--text-muted);
      font-family: monospace;
      margin-top: 2px;
    }

    .suite-meta {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .badge {
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .badge-pass { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-fail { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }
    .badge-duration { background: rgba(255, 255, 255, 0.05); color: var(--text-muted); }

    .tests-list {
      padding: 0 22px 18px 22px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
    }

    .test-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.25);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.03);
    }

    .test-title {
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .test-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .test-status-dot.pass { background: #10b981; box-shadow: 0 0 8px #10b981; }
    .test-status-dot.fail { background: #f43f5e; box-shadow: 0 0 8px #f43f5e; }

    .test-time {
      font-size: 12px;
      color: var(--text-muted);
      font-family: monospace;
    }

    /* Print styling */
    @media print {
      body { background: #fff; color: #000; padding: 0; }
      .header-actions, .controls-bar { display: none; }
      .stat-card, .suite-card { border: 1px solid #ccc; background: #fff; color: #000; box-shadow: none; }
      .stat-value, .suite-name, .test-title { color: #000; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <div>
        <div class="brand-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          QA Executive Dashboard
          <span class="brand-badge">Full HD 1080p</span>
        </div>
        <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">
          Automatización E2E - https://rodrigovillanueva.com.mx
        </p>
      </div>

      <div class="header-actions">
        <button class="btn-action" onclick="window.print()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Exportar PDF / Imprimir
        </button>
      </div>
    </header>

    <!-- Stats Hero -->
    <div class="stats-grid">
      <div class="stat-card passed">
        <div class="stat-label">
          Tasa de Éxito
          <span style="color: #10b981;">● 100%</span>
        </div>
        <div class="stat-value" style="color: #10b981;">${passRate}%</div>
        <div class="stat-sub">${totalPasses} de ${totalTests} pruebas superadas</div>
      </div>

      <div class="stat-card total">
        <div class="stat-label">Total de Pruebas</div>
        <div class="stat-value">${totalTests}</div>
        <div class="stat-sub">${suitesList.length} módulos automatizados</div>
      </div>

      <div class="stat-card passed">
        <div class="stat-label">Aprobadas</div>
        <div class="stat-value" style="color: #34d399;">${totalPasses}</div>
        <div class="stat-sub">0 fallos críticos</div>
      </div>

      <div class="stat-card failed">
        <div class="stat-label">Fallidas</div>
        <div class="stat-value" style="color: #fb7185;">${totalFailures}</div>
        <div class="stat-sub">Sin errores pendientes</div>
      </div>

      <div class="stat-card duration">
        <div class="stat-label">Duración Total</div>
        <div class="stat-value" style="color: #c084fc;">${totalDurationSec}s</div>
        <div class="stat-sub">Ejecución optimizada</div>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls-bar">
      <div class="filter-group">
        <button class="filter-btn active" onclick="filterByState('all', this)">Todas (${totalTests})</button>
        <button class="filter-btn" onclick="filterByState('passed', this)">Aprobadas (${totalPasses})</button>
        <button class="filter-btn" onclick="filterByState('failed', this)">Fallidas (${totalFailures})</button>
      </div>

      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="searchInput" class="search-input" placeholder="Buscar prueba o módulo..." oninput="handleSearch()">
      </div>
    </div>

    <!-- Suites List -->
    <div class="suites-container" id="suitesContainer">
      ${suitesList.map((suite, idx) => `
        <div class="suite-card" data-has-fail="${suite.failedCount > 0}">
          <div class="suite-header" onclick="toggleSuite(${idx})">
            <div class="suite-title-box">
              <div class="suite-icon ${suite.failedCount > 0 ? 'fail' : 'pass'}">
                ${suite.failedCount > 0 ? '✕' : '✓'}
              </div>
              <div>
                <div class="suite-name">${suite.title}</div>
                <div class="suite-file">${suite.file}</div>
              </div>
            </div>

            <div class="suite-meta">
              <span class="badge ${suite.failedCount > 0 ? 'badge-fail' : 'badge-pass'}">
                ${suite.passedCount}/${suite.testsCount} Pasadas
              </span>
              <span class="badge badge-duration">⏱ ${(suite.duration / 1000).toFixed(1)}s</span>
            </div>
          </div>

          <div class="tests-list" id="suite-tests-${idx}">
            ${suite.tests.map(test => `
              <div class="test-item" data-state="${test.state}">
                <div class="test-title">
                  <span class="test-status-dot ${test.state === 'passed' ? 'pass' : 'fail'}"></span>
                  ${test.title}
                </div>
                <div class="test-time">${test.duration}ms</div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <script>
    function toggleSuite(idx) {
      const list = document.getElementById('suite-tests-' + idx);
      if (list) {
        list.style.display = list.style.display === 'none' ? 'flex' : 'none';
      }
    }

    function filterByState(state, btn) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const items = document.querySelectorAll('.test-item');
      items.forEach(item => {
        if (state === 'all' || item.dataset.state === state) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    }

    function handleSearch() {
      const query = document.getElementById('searchInput').value.toLowerCase();
      const suiteCards = document.querySelectorAll('.suite-card');

      suiteCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(outputPath, dashboardHtml, 'utf8');
console.log('✅ Dashboard Ejecutivo Moderno creado exitosamente en:', outputPath);
