describe('Búsqueda automatizada en Google', () => {
  beforeEach(() => {
    // Evitar que errores no capturados de scripts de terceros fallen la prueba
    cy.on('uncaught:exception', () => false)
  })

  it('Validar búsqueda de un término en Google y comprobar los resultados cargados', () => {
    // 1. Visitar Google
    cy.visit('https://www.google.com')

    // 2. Manejar posible diálogo de cookies / consentimiento si aparece
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Aceptar todo"), button:contains("Accept all")').length > 0) {
        cy.contains(/Aceptar todo|Accept all/i).click()
      }
    })

    // 3. Localizar la barra de búsqueda y escribir el término
    const terminoBusqueda = 'Cypress Testing BrowserStack'
    cy.get('textarea[name="q"], input[name="q"]')
      .should('be.visible')
      .clear()
      .type(`${terminoBusqueda}{enter}`)

    // 4. Validar que la URL cambió y que los resultados se cargaron
    cy.url().should('include', 'search')
    cy.get('#search, #rso')
      .should('be.visible')
      .and('contain.text', 'Cypress')

    // 5. Capturar screenshot de los resultados
    cy.screenshot('google-search-results')
  })
})
