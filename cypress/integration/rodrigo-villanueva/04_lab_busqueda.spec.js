describe('Laboratorio QA - Módulo 3: Búsqueda y Filtro de Resultados Exhaustivo', () => {
    const BUSQUEDA_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo3_busqueda.html';

    beforeEach(() => {
        cy.visit(BUSQUEDA_URL);
    });

    it('Validar interfaz de búsqueda con campo de entrada, placeholder y botón de acción', () => {
        cy.get('[data-testid="input-busqueda"]')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Escribe el nombre de un producto...');
        cy.get('[data-testid="btn-buscar"]').should('be.visible').and('contain', 'Buscar');
        cy.get('[data-testid="div-resultados"]').should('exist');
    });

    it('Validar mensaje de error cuando el campo de búsqueda se envía vacío', () => {
        cy.get('[data-testid="btn-buscar"]').click();
        cy.get('[data-testid="div-resultados"]')
            .should('be.visible')
            .and('contain', 'Escribe algo para buscar');
        cy.get('[data-testid="input-busqueda"]').should('have.class', 'input-error');
    });

    it('Validar que no se permitan búsquedas menores a 2 caracteres', () => {
        cy.get('[data-testid="input-busqueda"]').type('a');
        cy.get('[data-testid="btn-buscar"]').click();
        cy.get('[data-testid="div-resultados"]')
            .should('be.visible')
            .and('contain', 'Escribe al menos 2 caracteres');
    });

    it('Validar búsqueda insensible a mayúsculas y minúsculas (case insensitive)', () => {
        cy.get('[data-testid="input-busqueda"]').clear().type('LAPTOP');
        cy.get('[data-testid="btn-buscar"]').click();

        cy.get('[data-testid="div-resultados"]').within(() => {
            cy.get('li').should('have.length', 2);
            cy.contains('Laptop Dell').should('be.visible');
            cy.contains('Laptop HP').should('be.visible');
        });
    });

    it('Validar mensaje cuando se buscan caracteres especiales o productos inexistentes', () => {
        cy.get('[data-testid="input-busqueda"]').clear().type('!@#$%^&*()_Inexistente');
        cy.get('[data-testid="btn-buscar"]').click();

        cy.get('[data-testid="div-resultados"]')
            .should('be.visible')
            .and('contain', 'No se encontraron resultados');
    });
});
