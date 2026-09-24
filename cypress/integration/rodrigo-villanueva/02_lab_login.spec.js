describe('Laboratorio QA - Módulo 1: Login y Validaciones', () => {
    const LOGIN_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo1_login.html';

    beforeEach(() => {
        cy.visit(LOGIN_URL);
    });

    it('Debe mostrar la interfaz del formulario de Login con los campos requeridos', () => {
        cy.get('[data-testid="form-login"]').should('be.visible');
        cy.get('[data-testid="input-usuario"]').should('be.visible');
        cy.get('[data-testid="input-password"]').should('be.visible');
        cy.get('[data-testid="btn-login"]').should('be.visible');
    });

    it('Debe mostrar mensajes de error cuando se envían campos vacíos', () => {
        cy.get('[data-testid="btn-login"]').click();
        cy.get('#error-usuario').should('be.visible').and('contain', 'Falta ingresar el usuario');
        cy.get('#error-password').should('be.visible').and('contain', 'Falta ingresar la contraseña');
        cy.get('[data-testid="input-usuario"]').should('have.class', 'input-error');
        cy.get('[data-testid="input-password"]').should('have.class', 'input-error');
    });

    it('Debe mostrar error con credenciales incorrectas', () => {
        cy.get('[data-testid="input-usuario"]').type('usuario_invalido');
        cy.get('[data-testid="input-password"]').type('password_invalido');
        cy.get('[data-testid="btn-login"]').click();
        
        cy.get('#error-password').should('be.visible').and('contain', 'Usuario o contraseña incorrectos');
    });

    it('Debe iniciar sesión exitosamente con credenciales válidas', () => {
        cy.get('[data-testid="input-usuario"]').type('admin');
        cy.get('[data-testid="input-password"]').type('1234');
        cy.get('[data-testid="btn-login"]').click();

        cy.get('#error-password').should('be.visible').and('contain', 'Login exitoso');
    });
});
