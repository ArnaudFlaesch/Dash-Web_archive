/// <reference types="cypress" />

describe('RSS Widget tests', () => {
  before(() => {
    cy.visit('/');
    cy.title().should('equals', 'Dash');
    cy.waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
  });

  it('Should create a RSS Widget and add it to the dashboard', () => {
    cy.get('#openAddWidgetModal').click();
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
      '/proxy/?url=http://www.lefigaro.fr/rss/figaro_actualites.xml',
      { fixture: 'figaro_rss.xml' }
    ).as('refreshWidget');

    cy.get('.editButton')
      .click()
      .get('.btn-success')
      .should('be.disabled')
      .get('input')
      .type('http://www.lefigaro.fr/rss/figaro_actualites.xml')
      .get('.btn-success')
      .click()
      .wait('@refreshWidget')
      .then(() => {
        cy.get('.rssTitle')
          .should(
            'have.text',
            'Le Figaro - Actualité en direct et informations en continu'
          )
          .get('.rssArticle')
          .should('have.length', 20);
      })
      .get('.refreshButton')
      .click()
      .wait('@refreshWidget')
      .then(() => {
        cy.get('.rssArticle')
          .should('have.length', 20)
          .first()
          .contains(
            'EN DIRECT - Déconfinement : les Français savourent leur première soirée en terrasse'
          )
          .click()
          .get('.articleTitle:visible')
          .should(
            'have.text',
            'EN DIRECT - Déconfinement : les Français savourent leur première soirée en terrasse'
          )
          .get('.articleContent:visible')
          .should(
            'have.text',
            "La deuxième étape de l'allègement des restrictions sanitaires contre le Covid-19 commence ce mercredi. Le couvre-feu est repoussé de 19h à 21h."
          )
          .click();
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
