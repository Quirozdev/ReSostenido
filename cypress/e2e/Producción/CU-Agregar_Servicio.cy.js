describe('Agregar Servicio', () => {
    before(() => {
      // Realizar la visita al sitio solo una vez al comienzo de la prueba
      cy.visit('https://resostenido-production.up.railway.app/login')
  
      // Cargar datos desde el archivo de fixture 'registro.json' para el inicio de sesión
      cy.fixture('registro.json').then((registro) => {
        cy.get('#email').type(registro.email, { force: true });
        cy.get('#contrasenia').type(registro.contrasena, { force: true });
      });
  
      cy.get('#login').click()
    })
  
    it('Agregar Servicio', () => {
      cy.wait(2000)
  
      // Botón de administración de servicios
      cy.get(':nth-child(3) > .card > .btn').should('be.visible').click({ force: true })
      // Click en boton Agregar
      cy.get('#btnAgregar').should('be.visible').click({ force: true })
  
      // Cargar la imagen desde el archivo 'foto.jpg' en la carpeta 'fixtures'
      cy.fixture('foto.jpg').then((fileContent) => {
        cy.get('#inputImage').then(($inputImage) => {
          // Crear un archivo que simula la carga de la imagen
          const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');
          const testFile = new File([blob], 'foto.jpg', { type: 'image/jpeg' });
  
          // Adjuntar el archivo al elemento 'inputImage'
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(testFile);
          $inputImage[0].files = dataTransfer.files;
  
          // Disparar el evento 'change' para simular la carga de la imagen
          cy.wrap($inputImage).trigger('change', { force: true });
        });
      });
  
      // Cargar otros datos de formulario desde el archivo de fixture 'registro.json'
      cy.fixture('registro.json').then((registro) => {
        cy.get('#nombre_instrumento').should('be.visible').type(registro.nombre_instrumento, { force: true });
        cy.get('#grupo').should('be.visible').type(registro.grupo, { force: true });
        cy.get('#descripcion').should('be.visible').type(registro.descripcion, { force: true });
        cy.get('#precio').should('be.visible').type(registro.precio, { force: true });
        //cy.get('#guardar').should('be.visible').click({ force: true });
      });
    })
  })
  