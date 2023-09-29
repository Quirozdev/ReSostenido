describe('Pagina principal', () => {
  before(() => {
    cy.visit('localhost:3000')
  })

  it('Pagina Principal', () => {
    //Encontrar el logo
    cy.get('.d-inline-block').should('be.visible')
    //Encontrar titulo
    cy.get(':nth-child(1) > .text-container > :nth-child(1)').should('contain.text', 'Nosotros')
    //Contenido sección Sobre Nosotros
    cy.get(':nth-child(1) > .text-container > :nth-child(2) > small').should('be.visible')
    //Encontrar dirección
    cy.get('.me-3').should('contain.text', "San Raymundo #64")
    //Encontrar numero de telefono
    cy.get('.p-3 > :nth-child(7)').should('contain.text', '662 351 1195')
  })
})