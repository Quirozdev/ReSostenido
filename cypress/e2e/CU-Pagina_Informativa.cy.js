describe('Pagina principal', () => {
    it('Ingresar al sitio', () => {
      cy.visit('localhost:3000')
    })
    
    it('Encontrar el boton de menu', () =>{
        cy.get('.navbar-toggler-icon').click()  
    })

    it('Encontrar el boton de servicios y darle click', () =>{
        cy.get(':nth-child(1) > :nth-child(2) > .nav-link > .d-flex').click()
    })

    it('Encontrar la descripción general del servicio de calibración:', () =>{
        cy.get(':nth-child(2) > small').should('be.visible')
    })

    it('Descripción detallada del servicio', () =>{
        cy.get(':nth-child(4) > small').should('be.visible')
    })

    // SECCIÓN DE GUITARRAS
    it('Encontrar costo de Guitarra Acustica', () =>{
        cy.get(':nth-child(2) > :nth-child(1) > .card > .card-body').should('contain.text', 'Guitarra acústica')
        //Ecnotrar precio
        cy.get(':nth-child(2) > :nth-child(1) > .card > .card-body').should('contain.text', '$350')
        //Boton para agendar servicio
        cy.get(':nth-child(2) > :nth-child(1) > .card > .card-body > .btn').should('be.visible')
    })

    it('Encontrar costo de Guitarra Electrica de 6 cuerdas', () =>{
        cy.get(':nth-child(2) > :nth-child(2) > .card > .card-body').should('contain.text', 'Guitarra eléctrica 6 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(2) > :nth-child(2) > .card > .card-body').should('contain.text', '$350')
        //Boton para agendar servicio
        cy.get(':nth-child(2) > :nth-child(2) > .card > .card-body > .btn').should('be.visible')
    })
    
    it('Encontrar costo de Guitarra Electrica de 7 cuerdas', () =>{
        cy.get(':nth-child(2) > :nth-child(3) > .card > .card-body').should('contain.text', 'Guitarra eléctrica 7 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(2) > :nth-child(3) > .card > .card-body').should('contain.text', '$400')
        //Boton para agendar servicio
        cy.get(':nth-child(2) > :nth-child(3) > .card > .card-body > .btn').should('be.visible')
    })

    it('Encontrar costo de Guitarra Electrica de 8 cuerdas', () =>{
        cy.get(':nth-child(2) > :nth-child(4) > .card > .card-body').should('contain.text', 'Guitarra eléctrica 8 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(2) > :nth-child(4) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(2) > :nth-child(4) > .card > .card-body > .btn').should('be.visible')
    })

    it('Encontrar costo de Guitarra Electrica con Floyd Rose', () =>{
        cy.get(':nth-child(2) > :nth-child(5) > .card > .card-body').should('contain.text', 'Floyd Rose o Kahler')
        //Ecnotrar precio
        cy.get(':nth-child(2) > :nth-child(5) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(2) > :nth-child(5) > .card > .card-body > .btn').should('be.visible')
    })

    //SECCIÓN DE BAJOS

    it('Encontrar costo de bajo de 4 cuerdas', () =>{
        cy.get(':nth-child(4) > :nth-child(1) > .card > .card-body').should('contain.text', 'Bajo 4 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(4) > :nth-child(1) > .card > .card-body').should('contain.text', '$350')
        //Boton para agendar servicio
        cy.get(':nth-child(4) > :nth-child(1) > .card > .card-body > .btn').should('be.visible')
    })

    it('Encontrar costo de bajo de 5 cuerdas', () =>{
        cy.get(':nth-child(4) > :nth-child(2) > .card > .card-body').should('contain.text', 'Bajo 5 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(4) > :nth-child(2) > .card > .card-body').should('contain.text', '$400')
        //Boton para agendar servicio
        cy.get(':nth-child(4) > :nth-child(2) > .card > .card-body > .btn').should('be.visible')
    })

    it('Encontrar costo de bajo de 6 cuerdas', () =>{
        cy.get(':nth-child(4) > :nth-child(3) > .card > .card-body').should('contain.text', 'Bajo 6 cuerdas')
        //Ecnotrar precio
        cy.get(':nth-child(4) > :nth-child(3) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(4) > :nth-child(3) > .card > .card-body > .btn').should('be.visible')
    })

    //SECCIÓN DE REGIONAL
    it('Encontrar costo de Bajo quinto', () =>{
        cy.get(':nth-child(6) > :nth-child(1) > .card > .card-body').should('contain.text', 'Bajo quinto')
        //Ecnotrar precio
        cy.get(':nth-child(6) > :nth-child(1) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(6) > :nth-child(1) > .card > .card-body > .btn').should('be.visible')
    })

    it('Encontrar costo de Docerola', () =>{
        cy.get(':nth-child(6) > :nth-child(2) > .card > .card-body').should('contain.text', 'Docerola')
        //Ecnotrar precio
        cy.get(':nth-child(6) > :nth-child(2) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(6) > :nth-child(2) > .card > .card-body > .btn').should('be.visible')
    })

    it('Encontrar costo de Bajo sexto', () =>{
        cy.get(':nth-child(6) > :nth-child(3) > .card > .card-body').should('contain.text', 'Bajo sexto')
        //Ecnotrar precio
        cy.get(':nth-child(6) > :nth-child(3) > .card > .card-body').should('contain.text', '$450')
        //Boton para agendar servicio
        cy.get(':nth-child(6) > :nth-child(3) > .card > .card-body > .btn').should('be.visible')
    })
 })