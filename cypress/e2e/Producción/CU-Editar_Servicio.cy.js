describe('Agendar Servicio', () => {
    before(() => {
      // Realizar la visita al sitio solo una vez al comienzo de la prueba
      cy.visit('https://resostenidoclone-production.up.railway.app/login')
  
      // Cargar datos desde el archivo de fixture 'registro.json' para el inicio de sesión
      cy.fixture('registro.json').then((registro) => {
        cy.get('#email').type(registro.email_admin, { force: true });
        cy.get('#contrasenia').type(registro.contrasena, { force: true });
      });
  
      cy.get('#login').click()
    })
  
    it('Editar Servicio', () => {
      cy.wait(2000)
  
      // Botón de administración de servicios
      cy.get(':nth-child(3) > .card > .btn').should('be.visible').click({ force: true })
      // Click en boton Agregar
      //cy.get(':nth-child(3) > .card > .btn').should('be.visible').click({ force: true })
  
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
      
      //Editar de "bajo 4 cuerdas" con un costo de "$350" a "bajo 4 cuerdas acustico" con un costo de "$370"
      cy.get('#btnEditar_6').click({force:true})
      cy.get('#upd_nombre_instrumento').clear({force: true}).type("Bajo 4 cuerdas acustico", {force: true})
      cy.get('#upd_precio.form-control').invoke('attr', 'value', '370.00').should('have.attr', 'value', '370.00')
      
      cy.get('#upd_precio').type("370", {force:true}).trigger('change', {force: true})
      cy.get('#contenido_servicio_6 > :nth-child(6) > #guardar').should('be.visible').click({force: true})
      
   
    })
  })
  