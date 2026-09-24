const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '..', 'cypress', 'results', 'mochawesome', 'index.html');

if (!fs.existsSync(reportPath)) {
  console.log('No se encontró el archivo de reporte:', reportPath);
  process.exit(0);
}

let html = fs.readFileSync(reportPath, 'utf8');

// Inyección de estilos modernos y elegantes
const customStyles = `
<style id="custom-qa-theme">
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  
  body, html {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    background-color: #0f172a !important;
    color: #e2e8f0 !important;
  }
  
  /* Cabecera estilizada */
  header, nav, [class*="navbar"] {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
  }
  
  /* Tarjetas de métricas */
  [class*="summary"], [class*="statusbar"], [class*="card"], [class*="suite-"] {
    background-color: #1e293b !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25) !important;
    color: #f8fafc !important;
    margin-bottom: 16px !important;
  }

  /* Textos secundarios */
  p, span, [class*="text-muted"], [class*="duration"], [class*="small"] {
    color: #cbd5e1 !important;
  }

  /* Badges de estado */
  [class*="passed"], [class*="pass"] {
    color: #4ade80 !important;
  }
  [class*="failed"], [class*="fail"] {
    color: #f87171 !important;
  }
  [class*="pending"] {
    color: #38bdf8 !important;
  }

  /* Botones y filtros */
  button, select, input {
    border-radius: 8px !important;
    transition: all 0.2s ease !important;
  }
  
  /* Mejorar visualización de imágenes/capturas */
  img {
    border-radius: 8px !important;
    border: 2px solid #334155 !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
    transition: transform 0.2s ease !important;
  }
  img:hover {
    transform: scale(1.02);
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
                 .replace(/\\bSuites\\b/gi, 'Módulos')
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
    }, 300);

    // Observer para cambios dinámicos (filtros/clics)
    const observer = new MutationObserver(() => {
      observer.disconnect();
      translateNode(document.body);
      observer.observe(document.body, { childList: true, subtree: true });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
</script>
`;

if (!html.includes('custom-qa-theme')) {
  html = html.replace('</head>', customStyles + '</head>');
  fs.writeFileSync(reportPath, html, 'utf8');
  console.log('✅ Reporte Mochawesome traducido y estilizado en español exitosamente.');
} else {
  console.log('ℹ️ El reporte ya contaba con la personalización en español.');
}
