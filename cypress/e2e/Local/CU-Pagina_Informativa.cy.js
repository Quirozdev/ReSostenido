describe('Pagina de servicios', () => {
    before(() => {
        cy.visit('localhost:3000')
    })
    
    it('Encontrar el boton de menu', () =>{
        //Click en menu de navegación
        cy.get('.navbar-toggler-icon').click() 
        //Click en servicios
        cy.get(':nth-child(1) > :nth-child(2) > .nav-link > .d-flex').click()
        //Titulo sección de Servicios
        cy.get('.text-container > #servicios').should('be.visible')
        //Encontrar descripción del servicio de calibración
        cy.get(':nth-child(2) > small').should('be.visible')
        //Descripción de que incluye el servicio
        cy.get('#serviciosIncluye').should('be.visible')
        //Descripción de lo que no incluye
        cy.get('#serviciosNoIncluye').should('be.visible') 
        //Sección de Servicios Disponibles
        cy.get('#serviciosDisponibles8').should('be.visible')
        

        //SECCIÓN DE GUITARRAS:

        //Guitarra acustica:
        cy.get(':nth-child(2) > :nth-child(1) > .card > .card-body').should('contain.text', 'Guitarra acústica')
        //Ecnotrar precio
        cy.get(':nth-child(2) > :nth-child(1) > .card > .card-body').should('contain.text', '$350')
        //Boton para agendar servicio
        cy.get(':nth-child(2) > :nth-child(1) > .card > .card-body > .btn').should('be.visible')

        //Guitarra Electrica de 6 cuerdas
        cy.get(':nth-child(2) > :nth-child(2) > .card > .card-body').should('contain.text', 'Guitarra eléctrica 6 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(2) > :nth-child(2) > .card > .card-body').should('contain.text', '$350')
        //Boton para agendar servicio
        cy.get(':nth-child(2) > :nth-child(2) > .card > .card-body > .btn').should('be.visible')
    
        //Guitarra electrica de 7 cuerdas
        cy.get(':nth-child(2) > :nth-child(3) > .card > .card-body').should('contain.text', 'Guitarra eléctrica 7 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(2) > :nth-child(3) > .card > .card-body').should('contain.text', '$400')
        //Boton para agendar servicio
        cy.get(':nth-child(2) > :nth-child(3) > .card > .card-body > .btn').should('be.visible')

        //Guitarra electrica de 8 cuerdas
        cy.get(':nth-child(2) > :nth-child(4) > .card > .card-body').should('contain.text', 'Guitarra eléctrica 8 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(2) > :nth-child(4) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(2) > :nth-child(4) > .card > .card-body > .btn').should('be.visible')

        //Guitarra Electrica con Floyd Rose
        cy.get(':nth-child(2) > :nth-child(5) > .card > .card-body').should('contain.text', 'Floyd Rose o Kahler')
        //Ecnotrar precio
        cy.get(':nth-child(2) > :nth-child(5) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(2) > :nth-child(5) > .card > .card-body > .btn').should('be.visible')

        //SECCIÓN DE BAJOS
        
        //Bajo de 4 cuerdas
        cy.get(':nth-child(4) > :nth-child(1) > .card > .card-body').should('contain.text', 'Bajo 4 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(4) > :nth-child(1) > .card > .card-body').should('contain.text', '$350')
        //Boton para agendar servicio
        cy.get(':nth-child(4) > :nth-child(1) > .card > .card-body > .btn').should('be.visible')

        //Bajo de 5 cuerdas
        cy.get(':nth-child(4) > :nth-child(2) > .card > .card-body').should('contain.text', 'Bajo 5 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(4) > :nth-child(2) > .card > .card-body').should('contain.text', '$400')
        //Boton para agendar servicio
        cy.get(':nth-child(4) > :nth-child(2) > .card > .card-body > .btn').should('be.visible')

        //Bajo de 6 cuerdas
        cy.get(':nth-child(4) > :nth-child(3) > .card > .card-body').should('contain.text', 'Bajo 6 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(4) > :nth-child(3) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(4) > :nth-child(3) > .card > .card-body > .btn').should('be.visible')

        //SECCIÓN DE REGIONAL

        //Bajo quinto
        cy.get(':nth-child(6) > :nth-child(1) > .card > .card-body').should('contain.text', 'Bajo quinto')
        //Ecnotrar precio
        cy.get(':nth-child(6) > :nth-child(1) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(6) > :nth-child(1) > .card > .card-body > .btn').should('be.visible')
    
        //Docerola
        cy.get(':nth-child(6) > :nth-child(2) > .card > .card-body').should('contain.text', 'Docerola')
        //Ecnotrar precio
        cy.get(':nth-child(6) > :nth-child(2) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(6) > :nth-child(2) > .card > .card-body > .btn').should('be.visible')
    
        //Bajo sexto
        cy.get(':nth-child(6) > :nth-child(3) > .card > .card-body').should('contain.text', 'Bajo sexto')
        //Ecnotrar precio
        cy.get(':nth-child(6) > :nth-child(3) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(6) > :nth-child(3) > .card > .card-body > .btn').should('be.visible')
    })
 })