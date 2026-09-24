describe('Laboratorio QA - Módulo 7: Tablas Dinámicas y CRUD', () => {
    const TABLAS_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo7_tablas.html';

    beforeEach(() => {
        cy.visit(TABLAS_URL);
    });

    it('Validar campos obligatorios (nombre y correo) al intentar agregar usuario vacío', () => {
        cy.get('[data-testid="btn-agregar"]').click();
        cy.get('#error-nombre').should('contain', 'El nombre es obligatorio');
        cy.get('#error-correo').should('contain', 'El correo es obligatorio');
    });

    it('Validar formato de correo electrónico inválido en la tabla', () => {
        cy.get('[data-testid="input-nombre"]').type('Mariana Rios');
        cy.get('[data-testid="input-correo"]').type('correo_invalido');
        cy.get('[data-testid="btn-agregar"]').click();
        cy.get('#error-correo').should('contain', 'Ingresa un correo válido');
    });

    it('Validar inserción exitosa de un nuevo usuario en la tabla dinámica', () => {
        cy.get('[data-testid="input-nombre"]').type('Mariana Rios QA');
        cy.get('[data-testid="input-correo"]').type('mariana.rios@test.com');
        cy.get('[data-testid="btn-agregar"]').click();

        cy.get('[data-testid="tabla-usuarios"]').within(() => {
            cy.contains('Mariana Rios QA').should('be.visible');
            cy.contains('mariana.rios@test.com').should('be.visible');
        });
    });

    it('Validar búsqueda y filtrado de registros dentro de la tabla', () => {
        cy.get('[data-testid="input-buscar"]').type('Mariana');
        cy.get('[data-testid="btn-buscar"]').click();

        cy.get('[data-testid="tabla-usuarios"]').should('be.visible');
    });
});
