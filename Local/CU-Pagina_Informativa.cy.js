describe('Pagina de servicios', () => {
    before(() => {
        // Deshabilitar la detección de errores no atrapados
        Cypress.on('uncaught:exception', (err, runnable) => {
        // evita que Cypress falle por errores no atrapados
        return false;
        });

        cy.visit('localhost:3000')
    })
    
    it('Encontrar el boton de menu', () =>{
        //Click en servicios
        cy.get('#serviciosNavItem > .nav-link').should('be.visible').click();
        //Titulo sección de Servicios
        cy.get('#titulo').should('be.visible')
        //Encontrar descripción del servicio de calibración
        cy.get('#informacion').should('be.visible')
    
        //Sección de Servicios Disponibles
        
        //SECCIÓN DE GUITARRAS:
        cy.get('.container-xl > .container > :nth-child(1)').should('contain.text', 'Guitarras')
        
        //SECCIÓN DE BAJOS
        cy.get('.container-xl > .container > :nth-child(3)').should('contain.text', 'Bajos')
        
        //SECCIÓN DE REGIONAL
        cy.get('.container > :nth-child(5)').should('contain.text', 'Otros')
        
    })
 })