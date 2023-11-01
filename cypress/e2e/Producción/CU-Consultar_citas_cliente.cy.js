describe('Pagina de inicio de sesion', () => {
    before(() => {
      cy.visit('https://resostenidoclone-production.up.railway.app/')
    })
  
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

      //Click en citas
      cy.get('#citasNavItem > .nav-link').should('be.visible').click()

      //Buscar cita para guitarra acustica:
      cy.fixture('datos_cliente.json').then((datos) => {
        cy.get('#CPnombre').should('contain.text', datos.nombre_instrumento)
        cy.get('#CPdescripcion_servicio').should('contain.text', datos.descripcion)
        cy.get('#CPanticipo').should('contain.text', datos.anticipo)
      });
      
    })
  })