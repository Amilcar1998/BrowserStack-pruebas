const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '..', 'cypress', 'results', 'mochawesome', 'index.html');

if (!fs.existsSync(reportPath)) {
  console.log('No se encontró el archivo de reporte:', reportPath);
  process.exit(0);
}

let html = fs.readFileSync(reportPath, 'utf8');

// Inyección de estilos ultra-nítidos (High-DPI / Retinas / Anti-pixelación)
const customStyles = `
<style id="custom-qa-theme">
  /* Tipografía y Anti-Aliasing Ultra Nítido */
  *, *::before, *::after {
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    text-rendering: optimizeLegibility !important;
  }

  body, html {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
    background-color: #0b0f19 !important;
    color: #f1f5f9 !important;
    margin: 0;
    padding: 0;
  }
  
  /* Barra superior / Navbar */
  header, nav, [class*="navbar"], [class*="header"] {
    background: #111827 !important;
    border-bottom: 1px solid #1f2937 !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
  }

  /* Tarjetas y Contenedores con bordes limpios y sin distorsión */
  [class*="summary"], [class*="statusbar"], [class*="card"], [class*="suite-"] {
    background-color: #111827 !important;
    border: 1px solid #1f2937 !important;
    border-radius: 10px !important;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3) !important;
    color: #f9fafb !important;
    transform: none !important;
    filter: none !important;
  }

  /* Asegurar que los gráficos Canvas se rendericen al 100% de nitidez */
  canvas {
    image-rendering: auto !important;
    max-width: 100% !important;
  }

  /* Estados y Colores Vibrantes */
  [class*="passed"], [class*="pass"] {
    color: #10b981 !important;
    font-weight: 600 !important;
  }
  [class*="failed"], [class*="fail"] {
    color: #ef4444 !important;
    font-weight: 600 !important;
  }
  [class*="pending"] {
    color: #38bdf8 !important;
  }

  /* Capturas de pantalla e imágenes nítidas */
  img {
    image-rendering: -webkit-optimize-contrast !important;
    image-rendering: crisp-edges !important;
    border-radius: 6px !important;
    border: 1px solid #374151 !important;
  }

  /* Botones estilizados */
  button, input, select {
    border-radius: 6px !important;
  }
</style>

<script id="custom-qa-translator">
  document.addEventListener('DOMContentLoaded', () => {
    function translateNode(el) {
      if (el.nodeType === Node.TEXT_NODE) {
        let txt = el.nodeValue;
        txt = txt.replace(/\\bPassed\\b/gi, 'Aprobadas')
                 .replace(/\\bFailed\\b/gi, 'Fallidas')
                 .replace(/\\bPending\\b/gi, 'Pendientes')
                 .replace(/\\bSkipped\\b/gi, 'Omitidas')
                 .replace(/\\bDuration\\b/gi, 'Duración')
                 .replace(/\\bSuites\\b/gi, 'Suites')
                 .replace(/\\bTests\\b/gi, 'Pruebas')
                 .replace(/\\bFilter Tests\\b/gi, 'Filtrar Pruebas')
                 .replace(/\\bShow Hooks\\b/gi, 'Mostrar Hooks')
                 .replace(/\\bShow Code\\b/gi, 'Ver Código')
                 .replace(/\\bAll Tests\\b/gi, 'Todas las Pruebas')
                 .replace(/\\bPass Percentage\\b/gi, '% de Éxito');
        el.nodeValue = txt;
      } else {
        el.childNodes.forEach(translateNode);
      }
    }
    
    setTimeout(() => {
      translateNode(document.body);
    }, 400);
  });
</script>
`;

// Eliminar inyecciones previas si existían
html = html.replace(/<style id="custom-qa-theme">[\s\S]*?<\/style>/gi, '');
html = html.replace(/<script id="custom-qa-translator">[\s\S]*?<\/script>/gi, '');

// Insertar al final del head
html = html.replace('</head>', `${customStyles}</head>`);

fs.writeFileSync(reportPath, html, 'utf8');
console.log('✅ Reporte Mochawesome optimizado en alta definición y español exitosamente.');
