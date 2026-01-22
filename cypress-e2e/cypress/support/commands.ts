/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to wait for position board to load
Cypress.Commands.add('waitForPositionBoard', () => {
  cy.wait(['@getInterviewFlow', '@getCandidates'])
  cy.get('h2').should('exist')
})

// Custom command to setup API interceptors
Cypress.Commands.add('setupApiInterceptors', () => {
  cy.intercept('GET', '/positions/*/interviewFlow').as('getInterviewFlow')
  cy.intercept('GET', '/positions/*/candidates').as('getCandidates')
  cy.intercept('PUT', '/candidates/*').as('updateCandidate')
})

// Custom command to get candidate card by name
Cypress.Commands.add('getCandidateCard', (candidateName: string) => {
  return cy.contains('.card-title', candidateName).parent().parent()
})

// Custom command to get stage column by title
Cypress.Commands.add('getStageColumn', (stageTitle: string) => {
  return cy.contains('.card-header', stageTitle).parent()
})

// Custom command for drag and drop with react-beautiful-dnd
// This simulates the mouse movements needed for react-beautiful-dnd
Cypress.Commands.add('dragAndDrop', (sourceSelector: string, targetDroppableId: string) => {
  const target = `[data-rbd-droppable-id="${targetDroppableId}"]`
  
  cy.get(sourceSelector).first().then(($source) => {
    const sourceRect = $source[0].getBoundingClientRect()
    
    cy.get(target).first().then(($target) => {
      const targetRect = $target[0].getBoundingClientRect()
      
      // Mouse down on source
      cy.get(sourceSelector).first()
        .trigger('mousedown', {
          button: 0,
          clientX: sourceRect.x + sourceRect.width / 2,
          clientY: sourceRect.y + sourceRect.height / 2,
          force: true
        })
      
      // Small delay to register mousedown
      cy.wait(200)
      
      // Mouse move to trigger drag
      cy.get(sourceSelector).first()
        .trigger('mousemove', {
          button: 0,
          clientX: sourceRect.x + sourceRect.width / 2 + 10,
          clientY: sourceRect.y + sourceRect.height / 2 + 10,
          force: true
        })
      
      // Small delay
      cy.wait(200)
      
      // Mouse move to target
      cy.get(target).first()
        .trigger('mousemove', {
          button: 0,
          clientX: targetRect.x + targetRect.width / 2,
          clientY: targetRect.y + targetRect.height / 2,
          force: true
        })
      
      // Small delay
      cy.wait(200)
      
      // Mouse up on target to drop
      cy.get(target).first()
        .trigger('mouseup', {
          button: 0,
          clientX: targetRect.x + targetRect.width / 2,
          clientY: targetRect.y + targetRect.height / 2,
          force: true
        })
    })
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      waitForPositionBoard(): Chainable<void>
      setupApiInterceptors(): Chainable<void>
      getCandidateCard(candidateName: string): Chainable<JQuery<HTMLElement>>
      getStageColumn(stageTitle: string): Chainable<JQuery<HTMLElement>>
      dragAndDrop(sourceSelector: string, targetDroppableId: string): Chainable<void>
    }
  }
}

export {}
