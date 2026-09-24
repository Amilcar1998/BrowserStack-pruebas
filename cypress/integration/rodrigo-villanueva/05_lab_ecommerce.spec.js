describe('Laboratorio QA - Módulo 4: E-Commerce y Carrito de Compras', () => {
    const ECOMMERCE_URL = 'https://rodrigovillanueva.com.mx/laboratorio/modulo4_ecommerce.html';

    beforeEach(() => {
        cy.visit(ECOMMERCE_URL);
    });

    it('Debe renderizar la lista de productos disponibles en el catálogo', () => {
        cy.get('#productos .producto-card').should('have.length.at.least', 4);
        cy.get('#mensajeCarrito').should('be.visible').and('contain', 'Tu carrito está vacío');
        cy.get('#total').should('contain', '0');
    });

    it('Debe agregar productos al carrito y actualizar el contador total', () => {
        // Agregar primer producto
        cy.get('#productos .producto-card').first().find('button').click();
        
        // Verificar que el mensaje de carrito vacío desaparece
        cy.get('#mensajeCarrito').should('not.be.visible');
        cy.get('#carrito li').should('have.length', 1);
        cy.get('#total').should('contain', '1');

        // Agregar segundo producto
        cy.get('#productos .producto-card').eq(1).find('button').click();
        cy.get('#carrito li').should('have.length', 2);
        cy.get('#total').should('contain', '2');
    });
});
