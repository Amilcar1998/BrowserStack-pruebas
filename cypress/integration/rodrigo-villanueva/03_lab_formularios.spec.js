describe('Laboratorio QA - Módulo 2: Formularios con Validaciones y Casos de Borde', () => {
    const FORM_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo2_formularios.html';

    beforeEach(() => {
        cy.visit(FORM_URL);
    });

    it('Validar campos obligatorios al enviar el formulario vacío', () => {
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

    it('Validar longitud mínima requerida en el campo Nombre (<4 caracteres)', () => {
        cy.get('[data-testid="input-nombre"]').type('Ana');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-nombre').should('contain', 'El nombre debe tener al menos 4 caracteres');
    });

    it('Validar rechazo de números y caracteres especiales no permitidos en el campo Nombre', () => {
        cy.get('[data-testid="input-nombre"]').clear().type('Carlos123#$');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-nombre').should('contain', 'El nombre solo puede contener letras y espacios');
    });

    it('Validar rechazo de nombres duplicados ya existentes en la base de datos', () => {
        cy.get('[data-testid="input-nombre"]').clear().type('Juan Pérez');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-nombre').should('contain', 'Este nombre ya está registrado');
    });

    it('Validar rechazo de formatos inválidos de correo electrónico', () => {
        cy.get('[data-testid="input-correo"]').type('correo-invalido-sin-arroba');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-correo').should('contain', 'Ingresa un correo válido');
    });

    it('Validar rechazo de correos electrónicos ya registrados', () => {
        cy.get('[data-testid="input-correo"]').clear().type('test@correo.com');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-correo').should('contain', 'Este correo ya está registrado');
    });

    it('Validar que el campo Teléfono solo admita números y exactamente 10 dígitos', () => {
        // Con letras/símbolos
        cy.get('[data-testid="input-telefono"]').type('55-1234-AB');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-telefono').should('contain', 'El teléfono solo debe contener números');

        // Con longitud menor a 10
        cy.get('[data-testid="input-telefono"]').clear().type('12345');
        cy.get('[data-testid="btn-enviar"]').click();
        cy.get('#error-telefono').should('contain', 'El teléfono debe tener exactamente 10 dígitos');
    });

    it('Validar carga dinámica de ciudades según el país seleccionado en los selects dependientes', () => {
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

    it('Validar registro y envío exitoso con todos los campos válidos, archivos adjuntos y términos aceptados', () => {
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
