describe('Laboratorio QA - Módulo 13: Formulario Multipaso (Wizard)', () => {
    const MULTIPASO_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo13_formulario_multipaso.html';

    beforeEach(() => {
        cy.visit(MULTIPASO_URL);
    });

    it('Validar campos requeridos en el Paso 1 antes de permitir avanzar', () => {
        cy.get('#nextBtn').click();
        cy.get('#nombre').should('have.class', 'input-error');
        cy.get('#correo').should('have.class', 'input-error');
        cy.get('.form-step').first().should('be.visible');
    });

    it('Validar llenado correcto del Paso 1 y transición interactiva al Paso 2', () => {
        cy.get('#nombre').type('Fernando Castro');
        cy.get('#correo').type('fernando.castro@test.com');
        cy.get('#fechaNac').type('20/04/1992', { force: true });
        cy.get('#genero').select('masculino');

        cy.get('#nextBtn').click();

        // Verificar que estamos en el Paso 2
        cy.get('.form-step').eq(1).should('be.visible');
        cy.get('#prevBtn').should('be.visible');
    });

    it('Validar navegación hacia el paso anterior con el botón Anterior manteniendo los datos', () => {
        // Llenar paso 1
        cy.get('#nombre').type('Fernando Castro');
        cy.get('#correo').type('fernando.castro@test.com');
        cy.get('#fechaNac').type('20/04/1992', { force: true });
        cy.get('#genero').select('masculino');
        cy.get('#nextBtn').click();

        // En paso 2, hacer clic en anterior
        cy.get('#prevBtn').click();
        cy.get('.form-step').first().should('be.visible');
        cy.get('#nombre').should('have.value', 'Fernando Castro');
    });
});
