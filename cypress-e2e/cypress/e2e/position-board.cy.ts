/// <reference types="cypress" />

/**
 * E2E Tests for Position Board - ATS System
 * 
 * This test suite validates the functionality of the candidate board,
 * including page load, column display, candidate cards, and drag & drop operations.
 * 
 * Prerequisites:
 * - Backend running on http://localhost:3010
 * - Frontend running on http://localhost:3000
 * - Test position with ID 1 exists in the database
 */

describe('Position Board - E2E Tests', () => {
  const POSITION_ID = 1
  const API_BASE_URL = 'http://localhost:3010'

  beforeEach(() => {
    // Setup API interceptors for all tests
    cy.setupApiInterceptors()
    
    // Load fixtures and setup default interceptors
    cy.fixture('interviewFlow').then((interviewFlow) => {
      cy.intercept('GET', `${API_BASE_URL}/positions/${POSITION_ID}/interviewFlow`, {
        statusCode: 200,
        body: interviewFlow
      }).as('getInterviewFlow')
    })

    cy.fixture('candidates').then((candidates) => {
      cy.intercept('GET', `${API_BASE_URL}/positions/${POSITION_ID}/candidates`, {
        statusCode: 200,
        body: candidates
      }).as('getCandidates')
    })
  })

  context('Carga de la Página', () => {
    /**
     * Escenario 1.1: Verificación del Título de la Posición
     * 
     * Verifica que el título de la posición se muestre correctamente
     * en la página de detalles.
     */
    it('should display the position title correctly', () => {
      // Visit the position details page
      cy.visit(`/positions/${POSITION_ID}`)

      // Wait for the API calls to complete
      cy.wait(['@getInterviewFlow', '@getCandidates'])

      // Verify the position title is displayed
      cy.get('h2.text-center')
        .should('exist')
        .and('contain.text', 'Software Engineer')
    })

    /**
     * Escenario 1.2: Verificación de las Columnas de Fases
     * 
     * Verifica que todas las columnas de fases del proceso de entrevista
     * se muestren correctamente con sus nombres y en el orden correcto.
     */
    it('should display all interview stage columns correctly', () => {
      cy.visit(`/positions/${POSITION_ID}`)
      cy.wait(['@getInterviewFlow', '@getCandidates'])

      // Verify the number of columns (4 stages)
      cy.get('.card-header').should('have.length', 4)

      // Verify each stage is displayed with correct name and order
      cy.get('.card-header').eq(0).should('contain.text', 'Initial Screening')
      cy.get('.card-header').eq(1).should('contain.text', 'Technical Interview')
      cy.get('.card-header').eq(2).should('contain.text', 'HR Interview')
      cy.get('.card-header').eq(3).should('contain.text', 'Offer')
    })

    /**
     * Escenario 1.3: Verificación de Tarjetas de Candidatos
     * 
     * Verifica que las tarjetas de candidatos se muestren en las columnas
     * correctas según su fase actual del proceso.
     */
    it('should display candidate cards in their correct stage columns', () => {
      cy.visit(`/positions/${POSITION_ID}`)
      cy.wait(['@getInterviewFlow', '@getCandidates'])

      // Verify John Doe and Jane Smith are in Initial Screening
      cy.getStageColumn('Initial Screening')
        .should('contain.text', 'John Doe')
        .and('contain.text', 'Jane Smith')

      // Verify Bob Johnson is in Technical Interview
      cy.getStageColumn('Technical Interview')
        .should('contain.text', 'Bob Johnson')

      // Verify Alice Williams is in HR Interview
      cy.getStageColumn('HR Interview')
        .should('contain.text', 'Alice Williams')

      // Verify there are 2 candidates in Initial Screening
      cy.getStageColumn('Initial Screening')
        .find('.card-title')
        .should('have.length', 2)
    })

    /**
     * Escenario 1.4: Verificación de Visibilidad de Elementos
     * 
     * Verifica que todos los elementos clave de la interfaz estén
     * visibles y correctamente renderizados.
     */
    it('should display all UI elements correctly', () => {
      cy.visit(`/positions/${POSITION_ID}`)
      cy.wait(['@getInterviewFlow', '@getCandidates'])

      // Verify back button is visible
      cy.contains('Volver a Posiciones').should('be.visible')

      // Verify all stage columns have headers
      cy.get('.card-header').should('have.length', 4)

      // Verify at least 4 candidate cards are visible (from fixtures)
      cy.get('.card-title').should('have.length.at.least', 4)

      // Verify position title exists
      cy.get('h2').should('contain.text', 'Software Engineer')
    })
  })

  context('Drag & Drop de Candidatos', () => {
    /**
     * Escenario 2.1: Movimiento de Tarjeta Entre Columnas
     * 
     * Simula el arrastre de una tarjeta de candidato de una columna
     * a otra y verifica que la UI se actualice correctamente.
     */
    it('should move a candidate card between columns using drag & drop', () => {
      // Mock successful update
      cy.intercept('PUT', `${API_BASE_URL}/candidates/*`, {
        statusCode: 200,
        body: { success: true }
      }).as('updateCandidate')

      cy.visit(`/positions/${POSITION_ID}`)
      cy.wait(['@getInterviewFlow', '@getCandidates'])

      // Verify John Doe is in Initial Screening
      cy.getStageColumn('Initial Screening')
        .should('contain.text', 'John Doe')

      // Perform drag & drop to Technical Interview (droppable id "1")
      cy.contains('.card-title', 'John Doe')
        .parent()
        .parent()
        .then(($card) => {
          cy.dragAndDrop($card, '1')
        })

      // Wait for backend update
      cy.wait('@updateCandidate')

      // Verify candidate moved to Technical Interview
      cy.getStageColumn('Technical Interview')
        .should('contain.text', 'John Doe')
    })

    /**
     * Escenario 2.2: Actualización en el Backend
     * 
     * Verifica que cuando se mueve un candidato, se hace una llamada
     * HTTP al backend con los datos correctos.
     */
    it('should call the backend API with correct data when moving a candidate', () => {
      // Intercept PUT request to verify the payload
      cy.intercept('PUT', `${API_BASE_URL}/candidates/1`, {
        statusCode: 200,
        body: { success: true }
      }).as('updateCandidate')

      cy.visit(`/positions/${POSITION_ID}`)
      cy.wait(['@getInterviewFlow', '@getCandidates'])

      // Perform drag & drop of John Doe (candidateId: 1) to Technical Interview
      cy.contains('.card-title', 'John Doe')
        .parent()
        .parent()
        .then(($card) => {
          cy.dragAndDrop($card, '1')
        })

      // Wait for the API call and verify it was made
      cy.wait('@updateCandidate').then((interception) => {
        // Verify the request was made to the correct endpoint
        expect(interception.request.url).to.include('/candidates/1')
        
        // Verify the request method is PUT
        expect(interception.request.method).to.equal('PUT')
        
        // Verify the request body contains the correct data
        expect(interception.request.body).to.have.property('applicationId')
        expect(interception.request.body.applicationId).to.equal(101)
        
        expect(interception.request.body).to.have.property('currentInterviewStep')
        expect(interception.request.body.currentInterviewStep).to.equal(2) // Technical Interview ID
        
        // Verify the response is successful
        expect(interception.response?.statusCode).to.equal(200)
      })
    })

    /**
     * Escenario 2.3: Manejo de Múltiples Movimientos
     * 
     * Verifica que un candidato puede moverse a través de varias fases
     * secuencialmente y que cada movimiento actualiza el backend correctamente.
     */
    it('should handle multiple sequential movements of a candidate', () => {
      cy.intercept('PUT', `${API_BASE_URL}/candidates/*`, {
        statusCode: 200,
        body: { success: true }
      }).as('updateCandidate')

      cy.visit(`/positions/${POSITION_ID}`)
      cy.wait(['@getInterviewFlow', '@getCandidates'])

      // First move: Initial Screening -> Technical Interview
      cy.contains('.card-title', 'John Doe')
        .parent()
        .parent()
        .then(($card) => {
          cy.dragAndDrop($card, '1')
        })

      cy.wait('@updateCandidate').then((interception) => {
        expect(interception.request.body.currentInterviewStep).to.equal(2)
      })

      // Wait for UI to update
      cy.wait(500)

      // Second move: Technical Interview -> HR Interview
      cy.contains('.card-title', 'John Doe')
        .parent()
        .parent()
        .then(($card) => {
          cy.dragAndDrop($card, '2')
        })

      cy.wait('@updateCandidate').then((interception) => {
        expect(interception.request.body.currentInterviewStep).to.equal(3)
      })

      // Verify final state
      cy.getStageColumn('HR Interview')
        .should('contain.text', 'John Doe')
    })

    /**
     * Escenario 2.4: Persistencia de Datos
     * 
     * Verifica que después de mover un candidato y recargar la página,
     * el candidato aparece en la nueva fase (simulado con fixtures).
     */
    it('should persist candidate position after page reload', () => {
      cy.intercept('PUT', `${API_BASE_URL}/candidates/*`, {
        statusCode: 200,
        body: { success: true }
      }).as('updateCandidate')

      cy.visit(`/positions/${POSITION_ID}`)
      cy.wait(['@getInterviewFlow', '@getCandidates'])

      // Move John Doe
      cy.contains('.card-title', 'John Doe')
        .parent()
        .parent()
        .then(($card) => {
          cy.dragAndDrop($card, '1')
        })

      cy.wait('@updateCandidate')

      // Setup interceptor with updated data for reload
      cy.fixture('candidates').then((candidates) => {
        const updatedCandidates = candidates.map((c: any) => 
          c.candidateId === 1 
            ? { ...c, currentInterviewStep: 'Technical Interview' }
            : c
        )

        cy.intercept('GET', `${API_BASE_URL}/positions/${POSITION_ID}/candidates`, {
          statusCode: 200,
          body: updatedCandidates
        }).as('getCandidatesReload')

        cy.reload()
        cy.wait(['@getInterviewFlow', '@getCandidatesReload'])

        // Verify candidate is in the new stage
        cy.getStageColumn('Technical Interview')
          .should('contain.text', 'John Doe')
      })
    })

    /**
     * Escenario 2.5: Manejo de Errores del Backend
     * 
     * Verifica el comportamiento cuando el backend devuelve un error
     * al intentar actualizar la fase de un candidato.
     */
    it('should handle backend errors gracefully', () => {
      // Simulate backend error
      cy.intercept('PUT', `${API_BASE_URL}/candidates/*`, {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('updateCandidateError')

      cy.visit(`/positions/${POSITION_ID}`)
      cy.wait(['@getInterviewFlow', '@getCandidates'])

      // Attempt to move the candidate
      cy.contains('.card-title', 'John Doe')
        .parent()
        .parent()
        .then(($card) => {
          cy.dragAndDrop($card, '1')
        })

      // Verify the API was called
      cy.wait('@updateCandidateError').then((interception) => {
        expect(interception.response?.statusCode).to.equal(500)
      })

      // Note: The current implementation doesn't show error feedback to users
      // This test documents the current behavior
      // In a production app, we would verify error messages are displayed
    })
  })

  context('Navegación y Funcionalidad Adicional', () => {
    /**
     * Escenario 3.1: Botón de Volver a Posiciones
     * 
     * Verifica que el botón para volver a la lista de posiciones
     * funciona correctamente.
     */
    it('should navigate back to positions list when clicking back button', () => {
      cy.visit(`/positions/${POSITION_ID}`)
      cy.wait(['@getInterviewFlow', '@getCandidates'])

      // Click the back button
      cy.contains('Volver a Posiciones')
        .should('be.visible')
        .click()

      // Verify navigation to positions page
      cy.url().should('include', '/positions')
      cy.url().should('not.include', `/${POSITION_ID}`)
    })

    /**
     * Escenario 3.2: Responsive Behavior
     * 
     * Verifica que la página se visualiza correctamente en diferentes
     * tamaños de pantalla.
     */
    it('should display correctly on different viewport sizes', () => {
      const viewports: Array<[number, number]> = [
        [1920, 1080], // Desktop
        [1280, 720],  // Laptop
        [768, 1024],  // Tablet
      ]

      viewports.forEach(([width, height]) => {
        cy.viewport(width, height)
        cy.visit(`/positions/${POSITION_ID}`)
        cy.wait(['@getInterviewFlow', '@getCandidates'])

        // Verify essential elements are present
        cy.get('h2').should('exist')
        cy.get('.card-header').should('exist').and('have.length', 4)
      })
    })
  })

  context('Performance y Estabilidad', () => {
    /**
     * Escenario 4.1: Carga de Datos con Múltiples Candidatos
     * 
     * Verifica que la página maneja correctamente la carga de
     * múltiples candidatos sin problemas de performance.
     */
    it('should handle loading many candidates efficiently', () => {
      // Generate 50 candidates distributed across 4 stages
      const stages = ['Initial Screening', 'Technical Interview', 'HR Interview', 'Offer']
      const manyCandidates = Array.from({ length: 50 }, (_, i) => ({
        candidateId: i + 1,
        fullName: `Test Candidate ${i + 1}`,
        currentInterviewStep: stages[i % 4],
        averageScore: Math.floor(Math.random() * 5) + 1,
        applicationId: 200 + i
      }))

      // Override candidates interceptor with many candidates
      cy.intercept('GET', `${API_BASE_URL}/positions/${POSITION_ID}/candidates`, {
        statusCode: 200,
        body: manyCandidates
      }).as('getManyCandidates')

      cy.visit(`/positions/${POSITION_ID}`)
      cy.wait(['@getInterviewFlow', '@getManyCandidates'])

      // Verify all candidates are loaded
      cy.get('.card-title').should('have.length', 50)

      // Verify page structure is intact
      cy.get('h2').should('exist')
      cy.get('.card-header').should('have.length', 4)
    })

    /**
     * Escenario 4.2: Manejo de Red Lenta
     * 
     * Verifica que la aplicación maneja correctamente conexiones lentas.
     */
    it('should handle slow network responses', () => {
      // Simulate slow network with fixtures
      cy.fixture('interviewFlow').then((interviewFlow) => {
        cy.fixture('candidates').then((candidates) => {
          cy.intercept('GET', `${API_BASE_URL}/positions/${POSITION_ID}/interviewFlow`, {
            statusCode: 200,
            body: interviewFlow,
            delay: 2000 // 2 second delay
          }).as('getInterviewFlowSlow')

          cy.intercept('GET', `${API_BASE_URL}/positions/${POSITION_ID}/candidates`, {
            statusCode: 200,
            body: candidates,
            delay: 2000 // 2 second delay
          }).as('getCandidatesSlow')

          cy.visit(`/positions/${POSITION_ID}`)

          // Verify page loads even with delays
          cy.wait(['@getInterviewFlowSlow', '@getCandidatesSlow'], { timeout: 15000 })

          cy.get('h2').should('exist')
          cy.get('.card-header').should('have.length', 4)
        })
      })
    })
  })
})
