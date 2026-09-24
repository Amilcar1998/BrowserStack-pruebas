import './commands'
import 'cypress-mochawesome-reporter/register'

Cypress.on('uncaught:exception', (err, runnable) => {
  // Evitar que errores no controlados en la aplicación bajo prueba rompan los tests
  return false
})
