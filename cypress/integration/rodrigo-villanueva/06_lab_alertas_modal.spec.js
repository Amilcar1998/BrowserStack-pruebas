describe('Laboratorio QA - Módulo 6: Alertas Nativas y Modal CRUD', () => {
    const ALERTAS_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo6_alertas.html';

    beforeEach(() => {
        cy.visit(ALERTAS_URL);
    });

    it('Debe interactuar con la Alerta nativa (window:alert)', () => {
        const stub = cy.stub();
        cy.on('window:alert', stub);

        cy.get('[data-testid="btn-alert"]').click();

        cy.get('[data-testid="estado-alerta"]').should('contain', 'Se mostró y aceptó la alerta');
    });

    it('Debe interactuar con la ventana Confirm (window:confirm)', () => {
        cy.on('window:confirm', () => true);
        cy.get('[data-testid="btn-confirm"]').click();
        cy.get('[data-testid="estado-confirm"]').should('contain', 'Se aceptó la confirmación');
    });

    it('Debe interactuar con el Prompt nativo (window:prompt)', () => {
        cy.window().then((win) => {
            cy.stub(win, 'prompt').returns('Cypress Automation User');
        });
        cy.get('[data-testid="btn-prompt"]').click();
        cy.get('[data-testid="estado-prompt"]').should('contain', 'Hola, Cypress Automation User');
    });

    it('Debe abrir el Modal, registrar un nuevo contacto y visualizarlo en la tabla CRUD', () => {
        // Abrir modal
        cy.get('[data-testid="btn-open-crud"]').click();
        cy.get('[data-testid="wrap-modal-form"]').should('have.attr', 'aria-hidden', 'false');

        // Llenar datos en el modal
        cy.get('[data-testid="inp-nombre"]').type('Rodrigo QA Specialist');
        cy.get('[data-testid="inp-direccion"]').type('Av. Automatización 100');
        cy.get('[data-testid="inp-telefono"]').type('5551234567');

        // Guardar
        cy.get('[data-testid="btn-guardar"]').click();

        // Verificar que el modal se cierra y el registro aparece en la tabla
        cy.get('[data-testid="wrap-modal-form"]').should('have.attr', 'aria-hidden', 'true');
        cy.get('[data-testid="crud-rows"]').within(() => {
            cy.contains('Rodrigo QA Specialist').should('be.visible');
            cy.contains('Av. Automatización 100').should('be.visible');
            cy.contains('5551234567').should('be.visible');
        });
        cy.get('[data-testid="crud-empty"]').should('not.be.visible');
    });
});
