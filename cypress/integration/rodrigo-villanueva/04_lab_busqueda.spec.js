describe('Laboratorio QA - Módulo 3: Búsqueda y Filtro de Resultados', () => {
    const BUSQUEDA_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo3_busqueda.html';

    beforeEach(() => {
        cy.visit(BUSQUEDA_URL);
    });

    it('Debe mostrar la barra de búsqueda y el botón buscar', () => {
        cy.get('[data-testid="input-busqueda"]').should('be.visible');
        cy.get('[data-testid="btn-buscar"]').should('be.visible');
        cy.get('[data-testid="div-resultados"]').should('exist');
    });

    it('Debe validar que el término de búsqueda no esté vacío ni sea menor a 2 caracteres', () => {
        // Búsqueda vacía
        cy.get('[data-testid="btn-buscar"]').click();
        cy.get('[data-testid="div-resultados"]').should('contain', 'Escribe algo para buscar');

        // Búsqueda con 1 solo caracter
        cy.get('[data-testid="input-busqueda"]').type('a');
        cy.get('[data-testid="btn-buscar"]').click();
        cy.get('[data-testid="div-resultados"]').should('contain', 'Escribe al menos 2 caracteres');
    });

    it('Debe buscar productos existentes y mostrar la lista coincidente', () => {
        cy.get('[data-testid="input-busqueda"]').clear().type('Laptop');
        cy.get('[data-testid="btn-buscar"]').click();

        cy.get('[data-testid="div-resultados"]').within(() => {
            cy.get('li').should('have.length.at.least', 1);
            cy.contains('Laptop Dell').should('be.visible');
        });
    });

    it('Debe mostrar mensaje cuando no hay resultados para un término inexistente', () => {
        cy.get('[data-testid="input-busqueda"]').clear().type('InexistenteXYZ123');
        cy.get('[data-testid="btn-buscar"]').click();

        cy.get('[data-testid="div-resultados"]').should('contain', 'No se encontraron resultados');
    });
});
