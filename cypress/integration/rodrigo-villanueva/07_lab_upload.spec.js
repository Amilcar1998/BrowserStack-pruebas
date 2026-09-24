describe('Laboratorio QA - Módulo 5: Subida de Archivos', () => {
    const UPLOAD_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo5_upload.html';

    beforeEach(() => {
        cy.visit(UPLOAD_URL);
    });

    it('Validar mensaje de error al enviar formulario sin archivo seleccionado', () => {
        cy.get('#formUpload').submit();
        cy.get('#mensajeUpload')
            .should('be.visible')
            .and('contain', 'Debes seleccionar un archivo antes de subir')
            .and('have.css', 'color', 'rgb(255, 0, 0)');
    });

    it('Validar subida de archivo físico desde computadora con selectFile', () => {
        cy.get('#inputFile').selectFile('cypress/fixtures/sample_img.png');
        cy.get('#formUpload').submit();

        cy.get('#mensajeUpload')
            .should('be.visible')
            .and('contain', 'Archivo "sample_img.png" subido correctamente')
            .and('have.css', 'color', 'rgb(0, 128, 0)');
    });

    it('Validar selección y carga de archivo de ejemplo desde la lista desplegable', () => {
        cy.get('#selectFile').select('ejemplo2.pdf');
        cy.get('#formUpload').submit();

        cy.get('#mensajeUpload')
            .should('be.visible')
            .and('contain', 'Archivo "ejemplo2.pdf" subido correctamente')
            .and('have.css', 'color', 'rgb(0, 128, 0)');
    });
});
