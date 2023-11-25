describe('Pagina de inicio de sesión', () => {
    before(() => {
        // Deshabilitar la detección de errores no atrapados
        Cypress.on('uncaught:exception', (err, runnable) => {
          // evita que Cypress falle por errores no atrapados
          return false;
        });
    
        // Visitar la página
        cy.visit('https://resostenidoclone-production-13cb.up.railway.app/');
      });

    it('Encontrar el botón de Iniciar sesión', () => {
        // Click en el menu de navegación (movil)
        //cy.get('.navbar-toggler-icon').should('be.visible').click()
        // Click en iniciar sesión
        cy.get('#loginNavItem > .nav-link').should('be.visible').click()
        // Cargar datos de inicio de sesión desde el archivo de fixture 'registro.json'
        cy.fixture('datos_cliente.json').then((datos) => {
        cy.get('#email').should('be.visible').type(datos.email, { force: true });
        cy.get('#contrasenia').should('be.visible').type(datos.contrasena, { force: true });
    });
        //Iniciar sesión
        cy.get('#login').should('be.visible').click()
        //Click en menu de navegación (movil)
        //cy.get('.navbar-toggler-icon').should('be.visible').click()
        // Click en Foro (movil)
        //cy.get('#foro').click()
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