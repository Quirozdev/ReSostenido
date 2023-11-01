describe('Pagina de inicio de sesión', () => {
    before(() => {
        cy.visit('https://resostenidoclone-production.up.railway.app/')
    })

    it('Encontrar el botón de menú', () => {
        // Click en iniciar sesión
        cy.get('#loginNavItem > .nav-link').should('be.visible').click()
        // Cargar datos de inicio de sesión desde el archivo de fixture 'registro.json'
        cy.fixture('datos_admin.json').then((datos) => {
        cy.get('#email').should('be.visible').type(datos.email, { force: true });
        cy.get('#contrasenia').should('be.visible').type(datos.contrasena, { force: true });
    });
        //Iniciar sesión
        cy.get('#login').should('be.visible').click()
        // Click en Foro
        cy.get('#foroNavItem > .nav-link').should('be.visible').click()
        // 22. Verificar que estemos en el sitio de Foro
        cy.get('#titulo').should('contain.text', '¿En qué podemos ayudarte?')
        // ir a la seccion de solicitud de preguntas
        cy.get('#SolicitudesPreguntasNavItem > .nav-link').should('be.visible').click()
        // 26. CONTESTAR Y PUBLICAR PREGUNTA DEL CLIENTE EN EL FORO
        // verificar que estemos en el apartado de solicitud de preguntas
        cy.get('.fs-2').should('contain.text', 'Solicitudes de preguntas')
        // Debe de haber al menos dos solicitudes
        cy.get('textarea:first').type("Respuesta...", {force:true})
        // darle click en boton responder
        cy.get('.btn').contains(" Publicar ").click({force:true})
        // aceptar
        cy.get(':nth-child(2) > :nth-child(1) > .col-md-12 > .card > .card-footer > .row > [action="/responder_pregunta"] > #staticBackdrop > .modal-dialog > .modal-content > .modal-footer > .botones').click()
        // mensaje de verificacion que se haya publicado
        cy.get('.alert').should("contain.text", "La pregunta ha sido respondida y publicada en el foro")
        // 25. Rechazar solicitud de pregunta
        // click en el icono de basura para rechazar pregunta
        cy.get('.row > [action="/rechazar_solicitud_pregunta"] > [data-bs-toggle="modal"]:first').click({force:true})
        // aceptar rechazar pregunta
        cy.get(':nth-child(3) > :nth-child(1) > .col-md-12 > .card > .card-footer > .row > [action="/rechazar_solicitud_pregunta"] > #staticBackdrop2 > .modal-dialog > .modal-content > .modal-footer > .btn-delete').click({force:true})
        // TODO: 24. ELIMINAR PREGUNTA PUBLICADA EN EL FORO
        //Click en menu de navegación
        cy.get('.navbar-toggler-icon').should('be.visible').click()
        // Click en Foro
        cy.get('#foro').click()
        // click en el boton de eliminar pregunta
        cy.get('#btn-eliminar-pregunta:first').click({force:true})
        // aceptar eliminar la pregunta publicada
        cy.get('#btn-aceptar').click()
    })
})