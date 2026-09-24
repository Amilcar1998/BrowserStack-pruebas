describe('Portal Rodrigo Villanueva - Pruebas E2E de Inicio y Navegación', () => {
    const BASE_URL = 'https://rodrigovillanueva.com.mx/';

    beforeEach(() => {
        cy.visit(BASE_URL);
    });

    it('Validar la carga correcta de la página principal, encabezado y título', () => {
        cy.title().should('include', 'Rodrigo Igor Villanueva Nieto');
        cy.get('header.header').should('be.visible');
        cy.get('#menu').should('exist');
    });

    it('Validar la presencia y visibilidad de las opciones del menú de navegación', () => {
        cy.get('#menu').within(() => {
            cy.contains('Home').should('be.visible');
            cy.contains('Quiénes Somos').should('be.visible');
            cy.contains('Cursos').should('be.visible');
            cy.contains('Canal YouTube').should('be.visible');
            cy.contains('Laboratorio QA').should('be.visible');
        });
    });

    it('Validar el funcionamiento del Slider Principal interactuando con los botones de cambio de slide', () => {
        cy.get('.hero-slider').should('be.visible');
        cy.get('.slide').should('have.length.at.least', 2);
        
        // Verificar slide activo inicial
        cy.get('.slide.active').should('exist');

        // Hacer clic en el botón siguiente
        cy.get('#nextSlide').should('be.visible').click();
        cy.get('.slide.active').should('be.visible');

        // Hacer clic en el botón anterior
        cy.get('#prevSlide').should('be.visible').click();
        cy.get('.slide.active').should('be.visible');
    });

    it('Validar la existencia y renderizado de las secciones dinámicas (Quiénes Somos, Cursos, Videos)', () => {
        cy.get('#sobre-mi-container').scrollIntoView().should('be.visible');
        cy.get('#cursos-container').scrollIntoView().should('be.visible');
        cy.get('#videos-container').scrollIntoView().should('be.visible');
    });

    it('Validar la navegación interactiva hacia el Laboratorio de Pruebas QA', () => {
        cy.get('#menu').contains('Laboratorio QA').invoke('removeAttr', 'target').click();
        cy.url().should('include', '/laboratorio');
        cy.get('h1').should('contain', 'Laboratorio');
        cy.get('.grid-menu').should('be.visible');
    });
});
