import './commands'
import 'cypress-mochawesome-reporter/register'

// Manejo global de excepciones no controladas de la aplicación web
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

// Hook global para capturar evidencia visual (Screenshot) de cada Caso de Prueba
afterEach(function() {
  const specName = Cypress.spec.name.replace(/\.spec\.js$/i, '')
  // Limpiar caracteres inválidos para nombres de archivo en Windows
  const cleanTitle = Cypress.currentTest.title.replace(/[/\\?%*:|"<>]/g, '_').substring(0, 100)
  const screenshotName = `${specName}/${cleanTitle}`
  
  cy.screenshot(screenshotName, { capture: 'viewport', overwrite: true })
})
