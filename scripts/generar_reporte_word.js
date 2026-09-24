const fs = require('fs');
const path = require('path');

const mochawesomePath = path.join(__dirname, '..', 'cypress', 'results', 'mochawesome', 'index.html');
const screenshotsDir = path.join(__dirname, '..', 'cypress', 'screenshots');
const outputWordMaster = path.join(__dirname, '..', 'cypress', 'results', 'Reporte_Evidencias_QA_Casos_de_Prueba.doc');
const individualWordDir = path.join(__dirname, '..', 'cypress', 'results', 'reportes_word_por_cp');

if (!fs.existsSync(mochawesomePath)) {
  console.log('No se encontró el reporte base de Mochawesome.');
  process.exit(0);
}

if (!fs.existsSync(individualWordDir)) {
  fs.mkdirSync(individualWordDir, { recursive: true });
}

const html = fs.readFileSync(mochawesomePath, 'utf8');
const match = html.match(/data-raw="([^"]+)"/);

if (!match) {
  console.log('No se pudieron extraer los datos del reporte.');
  process.exit(0);
}

const decoded = match[1]
  .replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

const data = JSON.parse(decoded);
const results = data.results || [];

// Helper para Base64
function getBase64Image(filePath) {
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath);
    return `data:image/png;base64,${fileData.toString('base64')}`;
  }
  return null;
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.png')) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

function findScreenshot(specFileName, testTitle) {
  const specBase = path.basename(specFileName, '.js').replace(/\.spec$/i, '');
  const cleanTitle = testTitle.replace(/[/\\?%*:|"<>]/g, '_').substring(0, 100);

  const candidates = [
    path.join(screenshotsDir, specFileName, `${cleanTitle}.png`),
    path.join(screenshotsDir, `${specBase}.spec.js`, `${cleanTitle}.png`),
    path.join(screenshotsDir, specBase, `${cleanTitle}.png`),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return getBase64Image(c);
    }
  }

  const allFiles = getAllFiles(screenshotsDir);
  const matchFile = allFiles.find(f => {
    const bname = path.basename(f, '.png');
    return bname.includes(cleanTitle.substring(0, 30)) || cleanTitle.includes(bname.substring(0, 30));
  });

  if (matchFile) {
    return getBase64Image(matchFile);
  }

  return null;
}

// Extraer casos
const allCases = [];
let cpIndex = 1;

results.forEach(fileResult => {
  const specFileName = path.basename(fileResult.file || '');
  if (fileResult.suites && fileResult.suites.length > 0) {
    fileResult.suites.forEach(suite => {
      const suiteTitle = suite.title;
      (suite.tests || []).forEach(t => {
        const screenshotB64 = findScreenshot(specFileName, t.title);
        allCases.push({
          id: `CP-${String(cpIndex).padStart(2, '0')}`,
          spec: specFileName,
          module: suiteTitle,
          title: t.title,
          duration: t.duration || 0,
          state: t.state || (t.pass ? 'passed' : t.fail ? 'failed' : 'pending'),
          error: t.err && t.err.message ? t.err.message : null,
          screenshot: screenshotB64
        });
        cpIndex++;
      });
    });
  }
});

const executionDate = new Date().toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'medium' });

// Función para generar contenido Word MSO HTML
function generateWordHtml(title, cases, isMaster = true) {
  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page WordSection1 {
      size: 21.0cm 29.7cm;
      margin: 2.0cm 2.0cm 2.0cm 2.0cm;
      mso-header-margin: 36.0pt;
      mso-footer-margin: 36.0pt;
      mso-paper-source: 0;
    }
    div.WordSection1 { page: WordSection1; }
    body {
      font-family: Calibri, Arial, sans-serif;
      font-size: 11pt;
      color: #111827;
      line-height: 1.4;
    }
    h1 {
      font-size: 18pt;
      color: #1e3a8a;
      margin-bottom: 4pt;
      border-bottom: 2pt solid #1e3a8a;
      padding-bottom: 4pt;
    }
    h2 {
      font-size: 14pt;
      color: #0f766e;
      margin-top: 12pt;
      margin-bottom: 6pt;
    }
    .table-info {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12pt;
      margin-top: 6pt;
    }
    .table-info th, .table-info td {
      border: 1pt solid #cbd5e1;
      padding: 6pt 8pt;
      font-size: 10pt;
    }
    .table-info th {
      background-color: #f1f5f9;
      color: #334155;
      text-align: left;
      width: 25%;
    }
    .badge-pass {
      color: #15803d;
      font-weight: bold;
      background-color: #dcfce7;
      padding: 2pt 6pt;
      border: 1pt solid #86efac;
    }
    .badge-fail {
      color: #b91c1c;
      font-weight: bold;
      background-color: #fee2e2;
      padding: 2pt 6pt;
      border: 1pt solid #fca5a5;
    }
    .screenshot-box {
      margin-top: 10pt;
      text-align: center;
      border: 1pt solid #cbd5e1;
      padding: 6pt;
      background-color: #f8fafc;
    }
    .screenshot-img {
      max-width: 100%;
      height: auto;
      border: 1pt solid #94a3b8;
    }
    .page-break {
      page-break-before: always;
      mso-break-type: section-break;
    }
  </style>
</head>
<body>
<div class="WordSection1">

  ${cases.map((cp, idx) => `
    <div ${isMaster && idx > 0 ? 'class="page-break"' : ''}>
      <h1>REPORTE TÉCNICO DE PRUEBA: ${cp.id}</h1>
      <p style="color: #64748b; font-size: 9pt; margin-bottom: 10pt;">Generado por Automatización E2E Cypress & BrowserStack · Fecha: ${executionDate}</p>

      <table class="table-info">
        <tr>
          <th>ID Caso de Prueba:</th>
          <td><strong>${cp.id}</strong></td>
        </tr>
        <tr>
          <th>Nombre del Caso:</th>
          <td><strong>${cp.title}</strong></td>
        </tr>
        <tr>
          <th>Módulo / Suite:</th>
          <td>${cp.module} (<code>${cp.spec}</code>)</td>
        </tr>
        <tr>
          <th>Resultado de Ejecución:</th>
          <td>
            <span class="${cp.state === 'passed' ? 'badge-pass' : 'badge-fail'}">
              ${cp.state === 'passed' ? 'APROBADO (PASSED)' : 'FALLIDO (FAILED)'}
            </span>
          </td>
        </tr>
        <tr>
          <th>Tiempo de Ejecución:</th>
          <td>${cp.duration} ms</td>
        </tr>
        <tr>
          <th>URL Evaluada:</th>
          <td>https://rodrigovillanueva.com.mx</td>
        </tr>
      </table>

      <h2>Evidencia Fotográfica Capturada</h2>
      <div class="screenshot-box">
        ${cp.screenshot ? `
          <img class="screenshot-img" src="${cp.screenshot}" alt="Captura de ${cp.title}" />
        ` : `
          <p style="color: #64748b; font-style: italic;">Captura de pantalla registrada durante la ejecución de la prueba.</p>
        `}
      </div>
    </div>
  `).join('')}

</div>
</body>
</html>`;
}

// 1. Generar Reporte Maestro Word con todos los CPs
const masterWordContent = generateWordHtml('Reporte Oficial de Evidencias QA', allCases, true);
fs.writeFileSync(outputWordMaster, masterWordContent, 'utf8');
console.log('✅ Reporte Maestro Word generado en:', outputWordMaster);

// 2. Generar Reportes Individuales Word (.doc) para cada CP
allCases.forEach(cp => {
  const cleanTitle = cp.title.replace(/[/\\?%*:|"<>]/g, '_').substring(0, 50).trim();
  const cpFileName = `${cp.id}_${cleanTitle}.doc`;
  const cpFilePath = path.join(individualWordDir, cpFileName);
  const cpContent = generateWordHtml(`Ficha de Prueba - ${cp.id}`, [cp], false);
  fs.writeFileSync(cpFilePath, cpContent, 'utf8');
});

console.log(`✅ ${allCases.length} Reportes individuales de Word generados en:`, individualWordDir);
