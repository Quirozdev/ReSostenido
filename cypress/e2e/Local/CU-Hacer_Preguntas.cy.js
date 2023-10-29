describe('Pagina principal', () => {
    before(() => {
        cy.visit('localhost:3000')
    })

    it('Encontrar link Foro menu', () => {
        //Abrir menu de navegación
        cy.get('.navbar-toggler-icon').click()
        //Click en link a Foro en el menu
        cy.get(':nth-child(2) > .nav-link > #citas').click()
        // Validar titulo en la pagina de Foro
        cy.get('#titulo').should('contain.text', '¿En qué podemos ayudarte?')      
    })

    it('Sesión no iniciada', () =>{
        // Generar pregunta
        cy.get('#hacer_pregunta').type("Pregunta...")
        // click en el boton 
        cy.get('#question-button').click()
        // debe mostrar la alerta de que debe de iniciar sesion
        cy.get('.alert').should('contain.text', 'No tienes acceso a esta página')
    })

    it('Sesión iniciada', () =>{
        //Click en el menu de navegación
        cy.get('.navbar-toggler-icon').should('be.visible').click()  
        //Click en iniciar sesión
        cy.get('.nav-link > #iniciarSesion').should('be.visible').click()
        //Rellenar formulario
        cy.get('#email').should('be.visible').type('juliosanchezd26@gmail.com', { force: true })
        cy.get('#contrasenia').should('be.visible').type('Julio123', { force: true })
        cy.get('#login').should('be.visible').click()
        
        //Abrir menu de navegación
        cy.get('.navbar-toggler-icon').click()
        //Click en link a Foro en el menu
        cy.get(':nth-child(2) > .nav-link > #citas').click()
//13    // Generar pregunta
        cy.get('#hacer_pregunta').type("Pregunta...")
        // click en el boton
        cy.get('#question-button').click()
        // debe mostrar la alerta de que debe de iniciar sesion
        cy.get('.alert').should('contain.text', 'La pregunta ha sido enviada y sera respondida en breve')
    })

    it('Solicitud de preguntas', () =>{
        // Abrir menú
        cy.get('.navbar-toggler-icon').click()
        // Entrar a la sección de solicitud de preguntas
        cy.get(':nth-child(4) > .nav-link > #adminServicios').click()
        // Tiene que estar una sesión iniciada de un administrador
        //Rellenar formulario
        cy.get('#email').should('be.visible').type('juliosanchezd26@gmail.com', { force: true })
        cy.get('#contrasenia').should('be.visible').type('Julio123', { force: true })
        cy.get('#login').should('be.visible').click()
        // Abrir menú
        cy.get('.navbar-toggler-icon').click()
        // Entrar a la sección de solicitud de preguntas
        cy.get(':nth-child(4) > .nav-link > #adminServicios').click()
        // verificar que estemos en la pagina de solicitudes de preguntas
        cy.get(':nth-child(4) > .nav-link > #adminServicios').should('contain.text', 'Solicitudes de preguntas')

//16    Responder primera pregunta
        cy.get('#respuesta_1').click().type("Respuesta...")
        // darle click en boton responder
        cy.get('.d-flex > .btn').click()
        // aceptar
        cy.get('.modal-footer > .botones').click()
        // texto sin preguntas pendientes
        cy.get('#errordepagina > .text-center').should('contain.text', 'Sin preguntas pendientes')

//12    Ver preguntas aceptadas en el foro
        cy.get('.navbar-toggler-icon').click()
        cy.get(':nth-child(2) > .nav-link > #citas').click()
        // debe contener 1 respuesta a la pregunta
        cy.get('#numero-respuestas').should('contain.text', '1 Respuesta')
        
//14    Eliminar pregunta
        cy.get('#btn-eliminar-pregunta').click()
        // aceptar
        cy.get('#btn-aceptar').click()
    })

    it('Rechazar solicitud de pregunta', () => {
        //Abrir menu de navegación
        cy.get('.navbar-toggler-icon').click()
        //Click en link a Foro en el menu
        cy.get(':nth-child(2) > .nav-link > #citas').click()
        // Generar pregunta
        cy.get('#hacer_pregunta').type("Pregunta a rechazada...")
        // click en el boton
        cy.get('#question-button').click()

        //Rellenar formulario
        cy.get('#email').should('be.visible').type('juliosanchezd26@gmail.com', { force: true })
        cy.get('#contrasenia').should('be.visible').type('Julio123', { force: true })
        cy.get('#login').should('be.visible').click()

        //Abrir menu de navegación
        cy.get('.navbar-toggler-icon').click()
         //Click en link a Foro en el menu
        cy.get(':nth-child(2) > .nav-link > #citas').click()
         // Generar pregunta
        cy.get('#hacer_pregunta').type("Pregunta a rechazada...")
         // click en el boton
        cy.get('#question-button').click()

        //Abrir menu de navegación
        cy.get('.navbar-toggler-icon').click()
        // solicitud de preguntas
        cy.get(':nth-child(4) > .nav-link > #adminServicios').click()

//15    rechazar pregunta
        cy.get('[action="/rechazar_solicitud_pregunta"] > [data-bs-toggle="modal"]').click()
        // aceptar
        cy.get('.btn-delete').click()
    })
})