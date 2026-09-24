describe('Laboratorio QA - Módulo 2: Formularios con Validaciones y Casos de Borde', () => {
    const FORM_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo2_formularios.html';

    beforeEach(() => {
        cy.visit(FORM_URL);
    });

    it('1. Debe validar campos obligatorios cuando se envía el formulario vacío', () => {
        cy.get('[data-testid="btn-enviar"]').click();

        cy.get('#error-nombre').should('contain', 'El nombre es obligatorio');
        cy.get('#error-correo').should('contain', 'El correo es obligatorio');
        cy.get('#error-telefono').should('contain', 'El teléfono es obligatorio');
        cy.get('#error-fecha').should('contain', 'La fecha de nacimiento es obligatoria');
        cy.get('#error-pais').should('contain', 'Selecciona un país');
        cy.get('#error-ciudad').should('contain', 'Selecciona una ciudad');
        cy.get('#error-genero').should('contain', 'Selecciona un género');
        cy.get('#error-imagen').should('contain', 'Debes subir una imagen');
        cy.get('#error-archivo').should('contain', 'Debes subir un archivo');
        cy.get('#error-terminos').should('contain', 'Debes aceptar los términos');
    });

    it('2. Campo Nombre: Debe validar longitud mínima (<4 caracteres)', () => {
        cy.get('[data-testid="input-nombre"]').type('Ana');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-nombre').should('contain', 'El nombre debe tener al menos 4 caracteres');
    });

    it('3. Campo Nombre: Debe rechazar números y caracteres especiales no permitidos', () => {
        cy.get('[data-testid="input-nombre"]').clear().type('Carlos123#$');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-nombre').should('contain', 'El nombre solo puede contener letras y espacios');
    });

    it('4. Campo Nombre: Debe rechazar nombres ya registrados en base de datos', () => {
        cy.get('[data-testid="input-nombre"]').clear().type('Juan Pérez');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-nombre').should('contain', 'Este nombre ya está registrado');
    });

    it('5. Campo Correo: Debe rechazar formatos inválidos de correo electrónico', () => {
        cy.get('[data-testid="input-correo"]').type('correo-invalido-sin-arroba');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-correo').should('contain', 'Ingresa un correo válido');
    });

    it('6. Campo Correo: Debe rechazar correos ya registrados', () => {
        cy.get('[data-testid="input-correo"]').clear().type('test@correo.com');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-correo').should('contain', 'Este correo ya está registrado');
    });

    it('7. Campo Teléfono: Debe rechazar letras, símbolos o longitud diferente a 10 dígitos', () => {
        // Con letras/símbolos
        cy.get('[data-testid="input-telefono"]').type('55-1234-AB');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-telefono').should('contain', 'El teléfono solo debe contener números');

        // Con longitud menor a 10
        cy.get('[data-testid="input-telefono"]').clear().type('12345');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-telefono').should('contain', 'El teléfono debe tener exactamente 10 dígitos');
    });

    it('8. Selects Dependientes: Debe poblar dinámicamente las ciudades según el país seleccionado', () => {
        // México
        cy.get('[data-testid="select-pais"]').select('mexico');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'CDMX');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'Guadalajara');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'Monterrey');

        // Colombia
        cy.get('[data-testid="select-pais"]').select('colombia');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'Bogotá');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'Medellín');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'Cali');

        // Argentina
        cy.get('[data-testid="select-pais"]').select('argentina');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'Buenos Aires');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'Córdoba');
    });

    it('9. Formulario Completo: Debe enviar exitosamente el formulario con todos los datos válidos', () => {
        cy.get('[data-testid="input-nombre"]').type('Valeria Morales');
        cy.get('[data-testid="input-correo"]').type('valeria.morales.qa@ejemplo.com');
        cy.get('[data-testid="input-telefono"]').type('5512349876');
        
        // Fecha Flatpickr
        cy.get('#fecha').type('15/08/1994', { force: true });

        // País y Ciudad
        cy.get('[data-testid="select-pais"]').select('mexico');
        cy.get('[data-testid="select-ciudad"]').select('Guadalajara');

        // Género
        cy.get('[data-testid="radio-femenino"]').check();

        // Archivos adjuntos
        cy.get('[data-testid="file-imagen"]').selectFile('cypress/fixtures/sample_img.png');
        cy.get('[data-testid="file-cv"]').selectFile('cypress/fixtures/sample_doc.pdf');

        // Aceptar términos
        cy.get('[data-testid="check-terminos"]').check();

        // Enviar
        cy.get('[data-testid="btn-enviar"]').click();

        // Validación de éxito
        cy.get('#mensaje')
            .should('be.visible')
            .and('contain', 'Registro exitoso. Todos los datos son válidos.')
            .and('have.css', 'color', 'rgb(0, 128, 0)');
    });
});
