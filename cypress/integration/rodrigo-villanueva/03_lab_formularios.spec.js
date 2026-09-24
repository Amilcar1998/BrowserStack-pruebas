describe('Laboratorio QA - Módulo 2: Formularios con Validaciones Avanzadas', () => {
    const FORM_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo2_formularios.html';

    beforeEach(() => {
        cy.visit(FORM_URL);
    });

    it('Debe mostrar el formulario de registro y todos sus controles', () => {
        cy.get('#registroForm').should('be.visible');
        cy.get('[data-testid="input-nombre"]').should('be.visible');
        cy.get('[data-testid="input-correo"]').should('be.visible');
        cy.get('[data-testid="input-telefono"]').should('be.visible');
        cy.get('[data-testid="select-pais"]').should('be.visible');
        cy.get('[data-testid="select-ciudad"]').should('be.visible');
        cy.get('[data-testid="btn-enviar"]').should('be.visible');
    });

    it('Debe validar campos requeridos y mostrar alertas de error cuando está vacío', () => {
        cy.get('[data-testid="btn-enviar"]').click();

        cy.get('#error-nombre').should('contain', 'El nombre es obligatorio');
        cy.get('#error-correo').should('contain', 'El correo es obligatorio');
        cy.get('#error-telefono').should('contain', 'El teléfono es obligatorio');
        cy.get('#error-fecha').should('contain', 'La fecha de nacimiento es obligatoria');
        cy.get('#error-pais').should('contain', 'Selecciona un país');
        cy.get('#error-ciudad').should('contain', 'Selecciona una ciudad');
        cy.get('#error-genero').should('contain', 'Selecciona un género');
        cy.get('#error-terminos').should('contain', 'Debes aceptar los términos');
    });

    it('Debe cargar dinámicamente las ciudades según el país seleccionado', () => {
        // Seleccionar México y validar opciones
        cy.get('[data-testid="select-pais"]').select('mexico');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'CDMX');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'Guadalajara');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'Monterrey');

        // Cambiar a Colombia y validar opciones
        cy.get('[data-testid="select-pais"]').select('colombia');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'Bogotá');
        cy.get('[data-testid="select-ciudad"]').should('contain', 'Medellín');
    });

    it('Debe completar el formulario exitosamente con datos válidos', () => {
        // Llenar campos de texto
        cy.get('[data-testid="input-nombre"]').type('Ana Hernandez');
        cy.get('[data-testid="input-correo"]').type('ana.hernandez.qa@ejemplo.com');
        cy.get('[data-testid="input-telefono"]').type('5598765432');
        
        // Asignar fecha con force para superar el atributo readonly de flatpickr
        cy.get('#fecha').type('10/10/1996', { force: true });

        // Seleccionar país y ciudad dependiente
        cy.get('[data-testid="select-pais"]').select('mexico');
        cy.get('[data-testid="select-ciudad"]').select('CDMX');

        // Seleccionar género
        cy.get('[data-testid="radio-femenino"]').check();

        // Adjuntar archivos usando selectFile
        cy.get('[data-testid="file-imagen"]').selectFile('cypress/fixtures/sample_img.png');
        cy.get('[data-testid="file-cv"]').selectFile('cypress/fixtures/sample_doc.pdf');

        // Aceptar términos
        cy.get('[data-testid="check-terminos"]').check();

        // Enviar formulario
        cy.get('[data-testid="btn-enviar"]').click();

        // Validar mensaje de éxito
        cy.get('#mensaje')
            .should('be.visible')
            .and('contain', 'Registro exitoso. Todos los datos son válidos.');
    });
});
