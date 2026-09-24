const { defineConfig } = require('cypress')
const { downloadFile } = require('cypress-downloadfile/lib/addPlugin')

module.exports = defineConfig({
  projectId: '72ch4c',
  chromeWebSecurity: false,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/results/mochawesome',
    charts: true,
    reportPageTitle: 'Reporte de Pruebas Automatizadas QA',
    reportTitle: '📊 Panel de Pruebas Automatizadas Cypress',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    code: false,
    autoOpen: false,
  },
  e2e: {
    specPattern: 'cypress/integration/**/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      on('task', { downloadFile })
      return config
    },
  },
})
