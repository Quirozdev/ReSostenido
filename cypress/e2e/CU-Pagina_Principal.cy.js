describe('Pagina principal', () => {
  it('Ingresar al sitio', () => {
    cy.visit('localhost:3000')
  })

  it('Encontrar logo', () => {
    cy.get('.d-inline-block').should('be.visible')
  })

  it('Encontrar sección Sobre Nosotros', () => {
    //Encontrar titulo
    cy.get(':nth-child(1) > .text-container > :nth-child(1)').should('contain.text', 'Nosotros')
  })

  it('Encontrar contenido "Sobre Nosotros"', () => {
    cy.get(':nth-child(1) > .text-container > :nth-child(2) > small').should('be.visible')
  });

  it('Encontrar dirección', () => {
    cy.get('.me-3').should('contain.text', "San Raymundo #64")
  });

  it('Encontrar numero de telefono', () => {
    cy.get('.p-3 > :nth-child(7)').should('contain.text', '662 351 1195')
  });
})