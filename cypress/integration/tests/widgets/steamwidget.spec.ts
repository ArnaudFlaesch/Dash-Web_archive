/// <reference types="cypress" />

describe('Steam Widget tests', () => {
  before(() => {
    cy.visit('/');
    cy.title().should('equals', 'Dash');
    cy.waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
  });

  it('Should create a Steam Widget and add it to the dashboard', () => {
    cy.get('#openAddWidgetModal').click();
    cy.intercept('POST', '/widget/addWidget').as('addWidget');
    cy.get('#STEAM').click();
    cy.wait('@addWidget').then(() => {
      cy.get('#closeAddWidgetModal')
        .click()
        .get('.widget')
        .should('have.length', 1);
    });
  });

  it('Should refresh Steam widget and validate data', () => {
    cy.intercept(
      'GET',
      `/proxy/?url=http:%2F%2Fapi.steampowered.com%2FISteamUser%2FGetPlayerSummaries%2F*`,
      { fixture: 'playerData.json' }
    ).as('getPlayerData');

    cy.intercept(
      'GET',
      `/proxy/?url=http:%2F%2Fapi.steampowered.com%2FIPlayerService%2FGetOwnedGames%2F*`,
      { fixture: 'gameData.json' }
    ).as('getGameData');

    cy.get('.refreshButton')
      .click()
      .wait('@getPlayerData')
      .wait('@getGameData')
      .then(() => {
        cy.get('.gameInfo').should('have.length', 10);
      });
  });

  it('Should display Half-Life 2: Episode Two details', () => {
    cy.intercept(
      'GET',
      `/proxy/?url=http:%2F%2Fapi.steampowered.com%2FISteamUserStats%2FGetPlayerAchievements%2F*`,
      { fixture: 'halfLife2Ep2Achievements.json' }
    ).as('getAchievementData');

    cy.contains('Half-Life 2: Episode Two')
      .first()
      .click()
      .wait('@getAchievementData')
      .then(() => {
        cy.get('.totalachievements')
          .should('have.text', 'Succès : 23')
          .get('.completedAchievements')
          .should('have.text', 'Succès complétés : 19')
          .get('.progressValue')
          .should('have.text', '83%');
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
