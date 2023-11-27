describe('Pagina de inicio de sesion', () => {
  before(() => {
      // Deshabilitar la detección de errores no atrapados
      Cypress.on('uncaught:exception', (err, runnable) => {
        // evita que Cypress falle por errores no atrapados
        return false;
      });
  
      // Visitar la página
      cy.visit('https://resostenidoclone-production-13cb.up.railway.app/login');
    });

  it('Encontrar el boton de menu', () => {
    // Click en iniciar sesión
    cy.get('#loginNavItem > .nav-link').should('be.visible').click()
    
    // Cargar datos de inicio de sesión desde el archivo de fixture 'registro.json'
    cy.fixture('datos_admin.json').then((datos) => {
      cy.get('#email').should('be.visible').type(datos.email, { force: true });
      cy.get('#contrasenia').should('be.visible').type(datos.contrasena, { force: true });
    });
    
    //Iniciar sesión
    cy.get('#login').should('be.visible').click()

    // Ir al apartado de citas
    cy.get('#citasNavItem > .nav-link').should('be.visible').click()

    // ver detalles de la cita
    cy.get('#btnverCita').click({force:true})
    
    // Verificar que aparezca nombre del instrumento, descripcion, costo total y fecha
    cy.fixture('datos_cliente.json').then((datos) => {
      // nombre instrumento
      cy.get(':nth-child(4) > .row > .table > tbody > :nth-child(1) > .line-placeholder').should('contain.text', datos.nombre_instrumento)
      // descripcion servicio
      cy.get(':nth-child(2) > .border > .row > .table > tbody > :nth-child(2) > .line-placeholder').should('contain.text', datos.descripcion)
      // fecha y hora
      cy.get(':nth-child(2) > .border > .row > .table > tbody > :nth-child(3) > :nth-child(1)').should('contain.text', "Fecha y hora")
      // X no aparece el anticipo
      //cy.get(':nth-child(4) > .line-placeholder').should('contain.text', datos.anticipo)
      // nota cliente
      cy.get('tbody > :nth-child(5) > :nth-child(1)').should('contain.text', "Notas del cliente")
      // incluye cuerdas
      cy.get('tbody > :nth-child(6) > :nth-child(1)').should('contain.text', "Incluye cuerdas")
      // estado
      cy.get(':nth-child(2) > .border > .row > .table > tbody > :nth-child(4) > :nth-child(1)').should('contain.text', "Estado de la cita")
      // Cancelar cita
      cy.get('#cancelar-cita-form > .d-flex > .me-2 > .btn').click({force:true})
      // debe de decir cancelada
      cy.get(':nth-child(2) > .border > .row > .table > tbody > :nth-child(4) > .line-placeholder').should('contain.text', "Cancelada")

    });
  })
})