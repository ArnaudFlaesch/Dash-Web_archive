/// <reference types="cypress" />

import { Interception } from 'cypress/types/net-stubbing';

describe('Steam Widget tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
      .visit('/')
      .title()
      .should('equals', 'Dash')
      .waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
  });

  it('Should create a Steam Widget and add it to the dashboard', () => {
    cy.intercept('POST', '/widget/addWidget')
      .as('addWidget')
      .get('#openAddWidgetModal')
      .click()
      .get('#STEAM')
      .click()
      .wait('@addWidget')
      .then((request: Interception) => {
        expect(request.response.statusCode).to.equal(200);
        cy.get('#closeAddWidgetModal').click().get('.widget').should('have.length', 1);
      });
  });

  it('Should refresh Steam widget and validate data', () => {
    cy.intercept('GET', `/proxy/?url=https:%2F%2Fapi.steampowered.com%2FISteamUser%2FGetPlayerSummaries%2F*`, {
      fixture: 'steam/playerData.json'
    })
      .as('getPlayerData')
      .intercept('GET', `/proxy/?url=https:%2F%2Fapi.steampowered.com%2FIPlayerService%2FGetOwnedGames%2F*`, {
        fixture: 'steam/gameData.json'
      })
      .as('getGameData')
      .intercept('GET', `/proxy/?url=https:%2F%2Fapi.steampowered.com%2FISteamUserStats%2FGetPlayerAchievements%2F*`, {
        fixture: 'steam/halfLife2Ep2Achievements.json'
      })
      .as('getAchievementData')
      .get('.refreshButton')
      .click()
      .wait(['@getPlayerData', '@getGameData'])
      .then((requests: Interception[]) => {
        expect(requests[0].response.statusCode).to.equal(200);
        cy.get('.gameInfo')
          .should('have.length', 10)
          .contains('Half-Life 2: Episode Two')
          .first()
          .click()
          .wait('@getAchievementData')
          .then((request: Interception) => {
            expect(request.response.statusCode).to.equal(200);
            cy.get('.totalachievements')
              .should('have.text', 'Succès : 23')
              .get('.completedAchievements')
              .should('have.text', 'Succès complétés : 19')
              .get('.progressValue')
              .should('have.text', '83%');
          });
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
      .click();
    cy.wait('@deleteWidget').then((request: Interception) => {
      expect(request.response.statusCode).to.equal(200);
      cy.get('.widget').should('have.length', 0);
    });
  });
});
