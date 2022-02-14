/// <reference types="cypress" />

import { Interception } from 'cypress/types/net-stubbing';

describe('Strava Widget tests', () => {
  const STRAVA_TOKEN = 'FAKE_TOKEN';
  const STRAVA_REFRESH_TOKEN = 'FAKE_REFRESH_TOKEN';
  const TOKEN_EXPIRATION_DATE = Date.now() + 3600;

  before(() => {
    window.localStorage.setItem('strava_token', STRAVA_TOKEN);
    window.localStorage.setItem('strava_refresh_token', STRAVA_REFRESH_TOKEN);
    window.localStorage.setItem('strava_token_expires_at', TOKEN_EXPIRATION_DATE.toString());
    cy.loginAsAdmin()
      .visit('/')
      .waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
  });

  it('Should create a Strava Widget and add it to the dashboard', () => {
    cy.intercept('POST', '/widget/addWidget')
      .as('addWidget')
      .get('#openAddWidgetModal')
      .click()
      .get('#STRAVA')
      .click()
      .wait('@addWidget')
      .then((request: Interception) => {
        expect(request.response.statusCode).to.equal(200);
        cy.get('#closeAddWidgetModal').click().get('.widget').should('have.length', 1);
      });
  });

  it('Should fail to load date because of wrong token', () => {
    cy.intercept('https://www.strava.com/api/v3/athlete')
      .as('getAthleteData')
      .intercept('https://www.strava.com/api/v3/athlete/activities?page=1&per_page=20')
      .as('getActivities')
      .reload()
      .wait(['@getAthleteData', '@getActivities'])
      .then((request: Interception[]) => {
        expect(request[0].response.statusCode).to.equal(401);
        expect(request[1].response.statusCode).to.equal(401);
        cy.get('#errorSnackbar').should('have.text', 'Erreur lors de la récupération des activités.');
      });
  });

  it('Should load the widget with a fake token', () => {
    cy.intercept('https://www.strava.com/api/v3/athlete', { fixture: 'strava/strava_athleteData.json' })
      .as('getAthleteData')
      .intercept('https://www.strava.com/api/v3/athlete/activities?page=1&per_page=20', {
        fixture: 'strava/strava_activities.json'
      })
      .as('getActivities')
      .reload()
      .wait(['@getAthleteData', '@getActivities'])
      .then((request: Interception[]) => {
        const getAthleteResponse = request[0].response;
        const getActivitiesResponse = request[1].response;
        expect(getAthleteResponse.statusCode).to.equal(200);
        expect(getActivitiesResponse.statusCode).to.equal(200);
        cy.get('#stravaWidgetHeader')
          .should('have.text', 'Arnaud Flaesch')
          .get('.stravaActivity')
          .should('have.length', 5)
          .first()
          .contains('Afternoon Run 12.5188 kms');
      });
  });

  it('Should delete previously added widget', () => {
    cy.intercept('DELETE', '/widget/deleteWidget/*')
      .as('deleteWidget')
      .get('.deleteButton')
      .click()
      .get('h4')
      .should('have.text', 'Êtes-vous sûr de vouloir supprimer ce widget ?')
      .get('.validateDeletionButton')
      .click()
      .wait('@deleteWidget')
      .then((request: Interception) => {
        expect(request.response.statusCode).to.equal(200);
        cy.get('.widget').should('have.length', 0);
      });
  });
});
