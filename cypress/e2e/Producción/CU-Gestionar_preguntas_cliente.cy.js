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
        cy.get('#login').should('be.visible').click()
    });

        // Click en Foro
        cy.get('#foroNavItem > .nav-link').should('be.visible').click()
        // Verificar que estemos en el sitio de Foro
        cy.get('#titulo').should('contain.text', '¿En qué podemos ayudarte?')
        // 23. Hacer pregunta
        cy.get('textarea:first').type("Pregunta 1...", {force:true})
        cy.get('#question-button').click({force:true})
        // Mensaje de verificación
        cy.get('#mensaje-confirmacion').should('contain.text', 'La pregunta ha sido enviada y sera respondida en breve')
    })
})