describe('Laboratorio QA - Módulo 1: Login y Validaciones Exhaustivas', () => {
    const LOGIN_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo1_login.html';

    beforeEach(() => {
        cy.visit(LOGIN_URL);
    });

    it('1. Debe mostrar la interfaz del formulario con todos sus elementos y atributos', () => {
        cy.get('[data-testid="form-login"]').should('be.visible');
        cy.get('[data-testid="input-usuario"]')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Ingresa tu usuario')
            .and('have.attr', 'maxlength', '30');
        cy.get('[data-testid="input-password"]')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Ingresa tu contraseña')
            .and('have.attr', 'minlength', '4');
        cy.get('[data-testid="btn-login"]').should('be.visible').and('contain', 'Ingresar');
    });

    it('2. Debe validar campos requeridos cuando se envían vacíos', () => {
        cy.get('[data-testid="btn-login"]').click();
        cy.get('#error-usuario').should('be.visible').and('contain', 'Falta ingresar el usuario');
        cy.get('#error-password').should('be.visible').and('contain', 'Falta ingresar la contraseña');
        cy.get('[data-testid="input-usuario"]').should('have.class', 'input-error');
        cy.get('[data-testid="input-password"]').should('have.class', 'input-error');
    });

    it('3. Debe validar cuando solo se ingresan espacios en blanco', () => {
        cy.get('[data-testid="input-usuario"]').type('   ');
        cy.get('[data-testid="input-password"]').type('   ');
        cy.get('[data-testid="btn-login"]').click();
        cy.get('#error-usuario').should('contain', 'Falta ingresar el usuario');
        cy.get('#error-password').should('contain', 'Falta ingresar la contraseña');
    });

    it('4. Debe validar error con credenciales no registradas o caracteres especiales no válidos', () => {
        cy.get('[data-testid="input-usuario"]').type('usuario_qa_#$@!');
        cy.get('[data-testid="input-password"]').type('Pass!@#999');
        cy.get('[data-testid="btn-login"]').click();
        
        cy.get('#error-password').should('be.visible').and('contain', 'Usuario o contraseña incorrectos');
    });

    it('5. Debe validar inicio de sesión exitoso con credenciales válidas (admin/1234)', () => {
        cy.get('[data-testid="input-usuario"]').type('admin');
        cy.get('[data-testid="input-password"]').type('1234');
        cy.get('[data-testid="btn-login"]').click();

        cy.get('#error-password')
            .should('be.visible')
            .and('contain', 'Login exitoso')
            .and('have.css', 'color', 'rgb(0, 128, 0)');
    });
});
