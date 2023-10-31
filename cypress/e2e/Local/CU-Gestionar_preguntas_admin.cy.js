describe('Pagina de inicio de sesión', () => {
    before(() => {
        cy.visit('localhost:3000')
    })

    it('Encontrar el botón de menú', () => {
        // Click en el menu de navegación
        cy.get('.navbar-toggler-icon').should('be.visible').click()
        // Click en iniciar sesión
        cy.get('.nav-link > #iniciarSesion').should('be.visible').click()
        // Cargar datos de inicio de sesión desde el archivo de fixture 'registro.json'
        cy.fixture('example.json').then((datos) => {
        cy.get('#email').should('be.visible').type(datos.email, { force: true });
        cy.get('#contrasenia').should('be.visible').type(datos.contrasena, { force: true });
    });
        //Iniciar sesión
        cy.get('#login').should('be.visible').click()
        //Click en menu de navegación
        cy.get('.navbar-toggler-icon').should('be.visible').click()
        // Click en Foro
        cy.get('#foro').click()
        // Verificar que estemos en el sitio de Foro
        cy.get('#titulo').should('contain.text', '¿En qué podemos ayudarte?')
        // abrir menu
        cy.get('.navbar-toggler-icon').click()
        // ir a la seccion de solicitud de preguntas
        cy.get('#solicitudesPreguntas').click()
        // 16. CONTESTAR Y PUBLICAR PREGUNTA DEL CLIENTE EN EL FORO
        // verificar que estemos en el apartado de solicitud de preguntas
        cy.get('.fs-2').should('contain.text', 'Solicitudes de preguntas')

// TODO: Responder pregunta...
        cy.get('#respuesta_1').click().type("Respuesta...")
        // darle click en boton responder
        cy.get('.d-flex > .btn').click()
        // aceptar
        cy.get('.modal-footer > .botones').click()


        // TODO: 14. ELIMINAR PREGUNTA PUBLICADA EN EL FORO
    })
})