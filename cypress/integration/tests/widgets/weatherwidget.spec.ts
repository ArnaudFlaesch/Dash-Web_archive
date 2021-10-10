/// <reference types="cypress" />

describe('Weather Widget tests', () => {
  before(() => {
    cy.loginAsAdmin()
      .visit('/')
      .title()
      .should('equals', 'Dash')
      .waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
  });

  it('Should create a Weather Widget and add it to the dashboard', () => {
    cy.get('#openAddWidgetModal').click();
    cy.intercept('POST', '/widget/addWidget').as('addWidget');
    cy.get('#WEATHER').click();
    cy.wait('@addWidget').then(() => {
      cy.get('#closeAddWidgetModal').click().get('.widget').should('have.length', 1);
    });
  });

  it('Should refresh Weather widget', () => {
    cy.intercept('GET', `/proxy/?url=https:%2F%2Fapi.openweathermap.org%2Fdata%2F2.5%2F*`, {
      fixture: 'parisWeatherSample.json'
    }).as('refreshWidget');

    cy.get('.editButton')
      .click()
      .clock(new Date(2020, 6, 15, 0, 0, 0).getTime())
      .get('#cityNameInput')
      .type('Paris')
      .get('#validateButton')
      .click();
    cy.get('.refreshButton').click();
    cy.wait('@refreshWidget')
      .then(() => {
        cy.get('.forecast').should('have.length', 6);
      })
      .clock()
      .then((clock) => {
        clock.restore();
      });
  });

  it("Should toggle between today's, tomorrow's and the week's forecasts", () => {
    cy.clock(new Date(2020, 6, 15, 0, 0, 0).getTime())
      .get('#toggleTodayForecast')
      .click()
      .get('.forecast')
      .should('have.length', 6)
      .get('#toggleTomorrowForecast')
      .click()
      .get('.forecast')
      .should('have.length', 6)
      .get('#toggleWeekForecast')
      .click()
      .get('.forecast')
      .should('have.length', 5)
      .clock()
      .then((clock) => {
        clock.restore();
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
