describe('Laboratorio QA - Módulo 3: Búsqueda y Filtro de Resultados Exhaustivo', () => {
    const BUSQUEDA_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo3_busqueda.html';

    beforeEach(() => {
        cy.visit(BUSQUEDA_URL);
    });

    it('1. Debe mostrar la interfaz de búsqueda con campo de entrada y botón de acción', () => {
        cy.get('[data-testid="input-busqueda"]')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Escribe el nombre de un producto...');
        cy.get('[data-testid="btn-buscar"]').should('be.visible').and('contain', 'Buscar');
        cy.get('[data-testid="div-resultados"]').should('exist');
    });

    it('2. Debe validar mensaje de error cuando el campo de búsqueda está vacío', () => {
        cy.get('[data-testid="btn-buscar"]').click();
        cy.get('[data-testid="div-resultados"]')
            .should('be.visible')
            .and('contain', 'Escribe algo para buscar');
        cy.get('[data-testid="input-busqueda"]').should('have.class', 'input-error');
    });

    it('3. Debe validar que no se permitan búsquedas menores a 2 caracteres', () => {
        cy.get('[data-testid="input-busqueda"]').type('a');
        cy.get('[data-testid="btn-buscar"]').click();
        cy.get('[data-testid="div-resultados"]')
            .should('be.visible')
            .and('contain', 'Escribe al menos 2 caracteres');
    });

    it('4. Debe realizar búsqueda insensible a mayúsculas y minúsculas (case insensitive)', () => {
        cy.get('[data-testid="input-busqueda"]').clear().type('LAPTOP');
        cy.get('[data-testid="btn-buscar"]').click();

        cy.get('[data-testid="div-resultados"]').within(() => {
            cy.get('li').should('have.length', 2);
            cy.contains('Laptop Dell').should('be.visible');
            cy.contains('Laptop HP').should('be.visible');
        });
    });

    it('5. Debe validar búsqueda con caracteres especiales o productos no existentes', () => {
        cy.get('[data-testid="input-busqueda"]').clear().type('!@#$%^&*()_Inexistente');
        cy.get('[data-testid="btn-buscar"]').click();

        cy.get('[data-testid="div-resultados"]')
            .should('be.visible')
            .and('contain', 'No se encontraron resultados');
    });
});
