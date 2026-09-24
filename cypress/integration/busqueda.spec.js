describe('Automatización de Búsqueda Web con Cypress', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
  })

  it('Validar búsqueda de un término en Wikipedia y verificar los resultados encontrados', () => {
    // 1. Visitar el buscador de Wikipedia
    cy.visit('https://es.wikipedia.org/wiki/Especial:Buscar')

    // 2. Ingresar el término de búsqueda
    const termino = 'Automatización de software'
    cy.get('input[name="search"]')
      .first()
      .should('exist')
      .type(`${termino}{enter}`, { force: true })

    // 3. Validar que la página de resultados se cargó correctamente
    cy.get('.mw-search-results, .mw-search-result, #mw-content-text')
      .should('be.visible')
      .and('contain.text', 'Automatización')

    // 4. Hacer clic en el primer resultado de la búsqueda
    cy.get('.mw-search-result-heading a, .mw-search-results a')
      .first()
      .click({ force: true })

    // 5. Validar que abrió el artículo
    cy.get('#firstHeading, h1')
      .should('be.visible')

    // 6. Capturar screenshot como evidencia
    cy.screenshot('wikipedia-articulo-encontrado')
  })

  it('Validar búsqueda interactiva en el portal Cypress Kitchensink', () => {
    // 1. Visitar la web de pruebas oficial de Cypress
    cy.visit('https://example.cypress.io/commands/actions')

    // 2. Localizar el campo de texto y escribir término de prueba
    cy.get('.action-email')
      .should('be.visible')
      .type('usuario.qa@browserstack.com')
      .should('have.value', 'usuario.qa@browserstack.com')

    // 3. Probar envío de búsqueda con tecla {enter}
    cy.get('.action-focus')
      .type('Prueba automatizada de búsqueda{enter}')
      .should('have.value', 'Prueba automatizada de búsqueda')

    // 4. Tomar captura de pantalla
    cy.screenshot('cypress-kitchensink-busqueda-exitosa')
  })
})
