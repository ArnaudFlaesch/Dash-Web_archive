/// <reference types="cypress" />

import MockDate from 'mockdate';

describe('Weather Widget tests', () => {
  before(() => {
    cy.visit('/');
    cy.title().should('equals', 'Dash');
    cy.waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
  });

  it('Should create a Weather Widget and add it to the dashboard', () => {
    cy.get('#openAddWidgetModal').click();
    cy.get('.card-title').should('have.length', 4);
    cy.intercept('POST', '/widget/addWidget').as('addWidget');
    cy.get('#WEATHER').click();
    cy.wait('@addWidget').then(() => {
      cy.get('#closeAddWidgetModal')
        .click()
        .get('.widget')
        .should('have.length', 1);
    });
  });

  it('Should edit Weather widget and add a feed', () => {
    MockDate.set(1588269600000);

    // @TODO Changer le path de l'URL pas quelque chose de plus parlant que `/proxy/?*`
    cy.intercept('GET', `/proxy/?*`, { fixture: 'parisWeatherSample.json' }).as(
      'refreshWidget'
    );

    cy.get('.editButton')
      .click()
      .get('#cityNameInput')
      .type('Paris')
      .get('#validateButton')
      .click();
    cy.get('.refreshButton').click();
    cy.wait('@refreshWidget').then(() => {
      cy.get('.forecast').its('length').should('be.gte', 5);
    });
  });

  it("Should toggle between today's, tomorrow's and the week's forecasts", () => {
    cy.get('#toggleTodayForecast')
      .click()
      .get('.forecast')
      .its('length')
      .should('be.gte', 5)
      .get('#toggleTomorrowForecast')
      .click()
      .get('.forecast')
      .its('length')
      .should('be.gte', 5)
      .get('#toggleWeekForecast')
      .click()
      .get('.forecast')
      .its('length')
      .should('be.gte', 4);
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
