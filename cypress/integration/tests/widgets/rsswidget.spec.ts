/// <reference types="cypress" />

describe('RSS Widget tests', () => {
  before(() => {
    cy.visit('/');
    cy.title().should('equals', 'Dash');
    cy.waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
  });

  it('Should create a RSS Widget and add it to the dashboard', () => {
    cy.get('#openAddWidgetModal').click();
    cy.get('.card-title').should('have.length', 4);
    cy.intercept('POST', '/widget/addWidget').as('addWidget');
    cy.get('#RSS').click();
    cy.wait('@addWidget').then(() => {
      cy.get('#closeAddWidgetModal')
        .click()
        .get('.widget')
        .should('have.length', 1);
    });
  });

  it('Should edit RSS widget and add a feed URL', () => {
    cy.intercept(
      'GET',
      '/proxy/?url=https://www.lefigaro.fr/rss/figaro_actualites.xml',
      { fixture: 'figaro_rss.json' }
    ).as('refreshWidget');
    cy.get('.editButton')
      .click()
      .get('.btn-success')
      .should('be.disabled')
      .get('input')
      .type('https://www.lefigaro.fr/rss/figaro_actualites.xml')
      .get('.btn-success')
      .click();
    cy.get('.refreshButton').click();
    cy.wait('@refreshWidget').then(() => {
      cy.get('.rssTitle')
        .should(
          'have.text',
          'Le Figaro - Actualité en direct et informations en continu'
        )
        .get('.rssArticle')
        .should('have.length', 20);
    });
  });

  it('Should delete previously added widget', () => {
    cy.intercept('DELETE', '/widget/deleteWidget/*').as('deleteWidget');
    cy.get('.deleteButton')
      .click()
      .get('h4')
      .should('have.text', 'Êtes-vous sûr de vouloir supprimer ce widget ?')
      .get('.btn-danger')
      .click();
    cy.wait('@deleteWidget').then(() => {
      cy.get('.widget').should('have.length', 0);
    });
  });
});
