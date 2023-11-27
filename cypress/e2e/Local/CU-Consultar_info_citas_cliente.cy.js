describe('Pagina de inicio de sesion', () => {
    before(() => {
        // Deshabilitar la detección de errores no atrapados
        Cypress.on('uncaught:exception', (err, runnable) => {
          // evita que Cypress falle por errores no atrapados
          return false;
        });
    
        // Visitar la página
        cy.visit('localhost:3000');
      });
  
    it('Encontrar el boton de menu', () => {
      // Click en iniciar sesión
      cy.get('#loginNavItem > .nav-link').should('be.visible').click()
      
      // Cargar datos de inicio de sesión desde el archivo de fixture 'registro.json'
      cy.fixture('datos_cliente.json').then((datos) => {
        cy.get('#email').should('be.visible').type(datos.email, { force: true });
        cy.get('#contrasenia').should('be.visible').type(datos.contrasena, { force: true });
      });
      
      //Iniciar sesión
      cy.get('#login').should('be.visible').click()

      // Ir al apartado de citas
      cy.get('#citasNavItem > .nav-link').should('be.visible').click()

      // ver detalles de la cita
      cy.get('#btnverCita').should("be.visible").click()

      // Verificar que aparezca nombre del instrumento, descripcion, costo total y fecha
      cy.fixture('datos_cliente.json').then((datos) => {
        cy.get(':nth-child(1) > .line-placeholder').should('contain.text', datos.nombre_instrumento)
        cy.get(':nth-child(2) > .line-placeholder').should('contain.text', datos.descripcion)
        cy.get('tbody > :nth-child(3) > :nth-child(1)').should('contain.text', "Fecha y hora")
        cy.get(':nth-child(4) > .line-placeholder').should('contain.text', datos.anticipo)
        cy.get('tbody > :nth-child(5) > :nth-child(1)').should('contain.text', "Estado")
        cy.get('tbody > :nth-child(6) > :nth-child(1)').should('contain.text', "Incluye cuerdas")
        cy.get('tbody > :nth-child(7) > :nth-child(1)').should('contain.text', "Costo total")
        // tener acceso al boton cancelar cita
        cy.get('#btn-eliminar-pregunta').should('be.visible').click()

      });
    })
  })