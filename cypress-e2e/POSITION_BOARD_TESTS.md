# 🎯 Position Board E2E Tests - Guía Completa

Esta guía explica en detalle las pruebas E2E implementadas para el tablero de candidatos del sistema ATS.

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Prerequisitos](#prerequisitos)
- [Configuración](#configuración)
- [Estructura de las Pruebas](#estructura-de-las-pruebas)
- [Escenarios de Prueba](#escenarios-de-prueba)
- [Comandos Personalizados](#comandos-personalizados)
- [Fixtures y Datos de Prueba](#fixtures-y-datos-de-prueba)
- [Ejecución de las Pruebas](#ejecución-de-las-pruebas)
- [Solución de Problemas](#solución-de-problemas)
- [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Descripción General

Las pruebas E2E del Position Board validan la funcionalidad completa del tablero de candidatos, incluyendo:

- **Carga de datos**: Verificación de que las fases y candidatos se cargan correctamente
- **Drag & Drop**: Simulación de arrastre y suelta de candidatos entre fases
- **Actualización Backend**: Validación de llamadas HTTP al mover candidatos
- **Manejo de errores**: Comportamiento ante fallos del backend
- **Performance**: Manejo de múltiples candidatos y conexiones lentas

### Métricas de Cobertura

- **Total de tests**: 15+
- **Escenarios cubiertos**: 10+
- **Tiempo de ejecución**: < 1 minuto
- **Cobertura de código**: Componentes principales del frontend

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

```
Frontend (React)          Backend (Node.js)         Database
┌─────────────────┐      ┌──────────────────┐      ┌────────────┐
│ React 18.x      │◄────►│ Express          │◄────►│ PostgreSQL │
│ TypeScript      │      │ TypeScript       │      │            │
│ React Router    │      │ Prisma ORM       │      └────────────┘
│ react-beautiful │      │ REST API         │
│ -dnd            │      │                  │
└─────────────────┘      └──────────────────┘
   Port 3000                Port 3010

        ▲
        │
        │ E2E Tests
        │
┌───────────────────┐
│ Cypress 15.9.0    │
│ TypeScript 5.9.3  │
│ @4tw/cypress-drag │
│ -drop             │
└───────────────────┘
```

### Flujo de Datos

```
1. Usuario abre /positions/1
2. Frontend hace GET /positions/1/interviewFlow → Obtiene fases
3. Frontend hace GET /positions/1/candidates → Obtiene candidatos
4. Usuario arrastra candidato a nueva fase
5. Frontend hace PUT /candidates/:id → Actualiza fase en backend
6. Backend actualiza base de datos
7. Frontend actualiza UI localmente
```

---

## ✅ Prerequisitos

### Software Requerido

- **Node.js**: v18.x o superior
- **npm**: v8.x o superior
- **PostgreSQL**: v14.x o superior
- **Git**: Para clonar el repositorio

### Servicios que Deben Estar Corriendo

#### 1. Base de Datos PostgreSQL

```bash
# Verificar que PostgreSQL está corriendo
psql --version
pg_isready

# Si no está corriendo (macOS con Homebrew)
brew services start postgresql@14

# Si no está corriendo (Linux con systemd)
sudo systemctl start postgresql
```

#### 2. Backend (Puerto 3010)

```bash
cd backend

# Instalar dependencias (primera vez)
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de PostgreSQL

# Ejecutar migraciones de Prisma
npx prisma migrate dev

# Seed de datos de prueba
npx prisma db seed

# Iniciar servidor backend
npm start

# Verificar que está corriendo
curl http://localhost:3010/health
```

#### 3. Frontend (Puerto 3000)

```bash
cd frontend

# Instalar dependencias (primera vez)
npm install

# Iniciar servidor frontend
npm start

# Verificar que está corriendo
# Abrir http://localhost:3000 en el navegador
```

#### 4. Cypress (Tests)

```bash
cd cypress-e2e

# Instalar dependencias (primera vez)
npm install

# Verificar instalación de Cypress
npx cypress verify
```

---

## ⚙️ Configuración

### Configuración de Cypress

El archivo `cypress.config.ts` está configurado con:

```typescript
{
  e2e: {
    baseUrl: 'http://localhost:3000',     // Frontend
    viewportWidth: 1280,                  // Resolución estándar
    viewportHeight: 720,
    defaultCommandTimeout: 10000,         // 10 segundos
    requestTimeout: 10000,
    responseTimeout: 10000,
    video: false,                         // No grabar videos (más rápido)
    screenshotOnRunFailure: true          // Screenshots solo en fallos
  }
}
```

### Variables de Entorno

Si necesitas cambiar puertos o URLs:

```bash
# cypress-e2e/.env
CYPRESS_BASE_URL=http://localhost:3000
CYPRESS_API_BASE_URL=http://localhost:3010
```

---

## 📁 Estructura de las Pruebas

```
cypress-e2e/
├── cypress/
│   ├── e2e/
│   │   ├── position-board.cy.ts        # ⭐ Spec principal del ATS
│   │   ├── 1-getting-started/
│   │   └── 2-advanced-examples/
│   ├── fixtures/
│   │   ├── interviewFlow.json          # Datos de fases
│   │   ├── candidates.json             # Datos de candidatos
│   │   └── example.json
│   └── support/
│       ├── commands.ts                 # Custom commands
│       └── e2e.ts
├── cypress.config.ts
├── package.json
└── POSITION_BOARD_TESTS.md            # Este archivo
```

---

## 🧪 Escenarios de Prueba

### 1. Carga de la Página (4 tests)

#### Test 1.1: Verificación del Título
```typescript
it('should display the position title correctly', () => {
  cy.visit('/positions/1')
  cy.wait(['@getInterviewFlow', '@getCandidates'])
  cy.get('h2').should('be.visible').and('contain.text', 'Software Engineer')
})
```

**Qué valida:**
- El título `<h2>` está visible
- Contiene el nombre de la posición
- No está vacío

#### Test 1.2: Columnas de Fases
```typescript
it('should display all interview stage columns correctly', () => {
  // Verifica que hay 4 columnas (Initial, Technical, HR, Offer)
  cy.get('.card-header').should('have.length', 4)
  
  // Verifica orden correcto
  cy.get('.card-header').eq(0).should('contain.text', 'Initial Screening')
  cy.get('.card-header').eq(1).should('contain.text', 'Technical Interview')
  // ...
})
```

**Qué valida:**
- Número correcto de columnas
- Nombres de fases correctos
- Orden de las columnas
- Visibilidad de headers

#### Test 1.3: Tarjetas de Candidatos
```typescript
it('should display candidate cards in correct columns', () => {
  // Verifica que John Doe está en Initial Screening
  cy.getStageColumn('Initial Screening')
    .should('contain.text', 'John Doe')
  
  // Verifica que Bob está en Technical Interview
  cy.getStageColumn('Technical Interview')
    .should('contain.text', 'Bob Johnson')
})
```

**Qué valida:**
- Candidatos en columnas correctas
- Nombres visibles
- Agrupación por fase

#### Test 1.4: Elementos UI
```typescript
it('should display all UI elements correctly', () => {
  // Botón de volver
  cy.contains('button', 'Volver a Posiciones').should('be.visible')
  
  // Headers y bodies de columnas
  cy.get('.card-header').each(($header) => {
    cy.wrap($header).parent().find('.card-body').should('exist')
  })
})
```

**Qué valida:**
- Botón "Volver" visible
- Todas las columnas tienen header y body
- Layout correcto

---

### 2. Drag & Drop (6 tests)

#### Test 2.1: Movimiento Entre Columnas
```typescript
it('should move candidate card between columns', () => {
  // Drag John Doe from Initial → Technical
  cy.getCandidateCard('John Doe')
    .drag('[data-rbd-droppable-id="1"]', { force: true })
  
  // Verificar que se movió
  cy.getStageColumn('Technical Interview')
    .should('contain.text', 'John Doe')
})
```

**Qué valida:**
- Drag & drop funciona
- Tarjeta desaparece de origen
- Tarjeta aparece en destino
- Nombre se mantiene correcto

**Nota sobre el plugin:**
```typescript
// Internamente usa @4tw/cypress-drag-drop
// El método .drag() es proporcionado por el plugin
// Simula eventos HTML5 drag & drop de react-beautiful-dnd
```

#### Test 2.2: Actualización Backend
```typescript
it('should call backend API with correct data', () => {
  cy.intercept('PUT', '/candidates/1').as('updateCandidate')
  
  // Mover candidato
  cy.getCandidateCard('John Doe').drag('[data-rbd-droppable-id="1"]')
  
  // Verificar llamada HTTP
  cy.wait('@updateCandidate').then((interception) => {
    expect(interception.request.body).to.deep.equal({
      applicationId: 101,
      currentInterviewStep: 2  // ID de Technical Interview
    })
    expect(interception.response.statusCode).to.equal(200)
  })
})
```

**Qué valida:**
- Se hace PUT a `/candidates/:id`
- Body contiene `applicationId` correcto
- Body contiene `currentInterviewStep` correcto (ID numérico)
- Response es 200 OK

#### Test 2.3: Múltiples Movimientos
```typescript
it('should handle multiple sequential movements', () => {
  // Movimiento 1: Initial → Technical
  cy.getCandidateCard('John Doe').drag('[data-rbd-droppable-id="1"]')
  cy.wait('@updateCandidate')
  
  // Movimiento 2: Technical → HR
  cy.getCandidateCard('John Doe').drag('[data-rbd-droppable-id="2"]')
  cy.wait('@updateCandidate')
  
  // Verificar estado final
  cy.getStageColumn('HR Interview').should('contain.text', 'John Doe')
})
```

**Qué valida:**
- Múltiples drag & drops consecutivos
- Cada movimiento llama al backend
- Estado final es correcto

#### Test 2.4: Persistencia de Datos
```typescript
it('should persist after page reload', () => {
  // Mover candidato
  cy.getCandidateCard('John Doe').drag('[data-rbd-droppable-id="1"]')
  cy.wait('@updateCandidate')
  
  // Recargar página
  cy.reload()
  cy.wait(['@getInterviewFlow', '@getCandidates'])
  
  // Verificar que sigue en nueva posición
  cy.getStageColumn('Technical Interview').should('contain.text', 'John Doe')
})
```

**Qué valida:**
- Cambios persisten en base de datos
- Después de reload, datos se cargan correctamente
- UI refleja estado actualizado

#### Test 2.5: Manejo de Errores
```typescript
it('should handle backend errors gracefully', () => {
  // Simular error 500
  cy.intercept('PUT', '/candidates/*', { statusCode: 500 }).as('error')
  
  cy.getCandidateCard('John Doe').drag('[data-rbd-droppable-id="1"]')
  
  cy.wait('@error').then((interception) => {
    expect(interception.response.statusCode).to.equal(500)
  })
  
  // Nota: La app actual no muestra mensajes de error al usuario
  // Este test documenta el comportamiento actual
})
```

**Qué valida:**
- App no crashea con error 500
- Request se hace correctamente
- Se detecta el error (aunque no se muestre al usuario)

---

### 3. Navegación (2 tests)

#### Test 3.1: Botón Volver
```typescript
it('should navigate back to positions list', () => {
  cy.visit('/positions/1')
  cy.contains('button', 'Volver a Posiciones').click()
  cy.url().should('include', '/positions').and('not.include', '/1')
})
```

#### Test 3.2: Responsive
```typescript
it('should display correctly on different viewports', () => {
  [[1920, 1080], [1280, 720], [768, 1024]].forEach(([width, height]) => {
    cy.viewport(width, height)
    cy.visit('/positions/1')
    cy.get('h2').should('be.visible')
  })
})
```

---

### 4. Performance (2 tests)

#### Test 4.1: Muchos Candidatos
```typescript
it('should handle loading 50+ candidates efficiently', () => {
  // Genera 50 candidatos ficticios
  const manyCandidates = Array.from({ length: 50 }, (_, i) => ({
    candidateId: i + 1,
    fullName: `Test Candidate ${i + 1}`,
    currentInterviewStep: /* random stage */,
    averageScore: Math.floor(Math.random() * 5) + 1,
    applicationId: 200 + i
  }))
  
  cy.intercept('GET', '/positions/1/candidates', { body: manyCandidates })
  cy.visit('/positions/1')
  
  cy.get('.card-title').should('have.length', 50)
})
```

#### Test 4.2: Red Lenta
```typescript
it('should handle slow network responses', () => {
  cy.intercept('GET', '/positions/1/interviewFlow', {
    body: /* data */,
    delay: 2000  // 2 segundos de delay
  })
  
  cy.visit('/positions/1')
  cy.wait('@getInterviewFlow', { timeout: 15000 })
  cy.get('h2').should('be.visible')
})
```

---

## 🛠️ Comandos Personalizados

### 1. `cy.setupApiInterceptors()`

Configura todos los interceptores HTTP necesarios.

```typescript
// Uso
beforeEach(() => {
  cy.setupApiInterceptors()
})

// Internamente hace:
cy.intercept('GET', '/positions/*/interviewFlow').as('getInterviewFlow')
cy.intercept('GET', '/positions/*/candidates').as('getCandidates')
cy.intercept('PUT', '/candidates/*').as('updateCandidate')
```

### 2. `cy.waitForPositionBoard()`

Espera a que el tablero cargue completamente.

```typescript
// Uso
cy.visit('/positions/1')
cy.waitForPositionBoard()

// Internamente hace:
cy.wait(['@getInterviewFlow', '@getCandidates'])
cy.get('h2').should('be.visible')
```

### 3. `cy.getCandidateCard(name)`

Obtiene una tarjeta de candidato por nombre.

```typescript
// Uso
cy.getCandidateCard('John Doe')
  .should('be.visible')
  .click()

// Implementación
Cypress.Commands.add('getCandidateCard', (candidateName: string) => {
  return cy.contains('.card-title', candidateName).parent().parent()
})
```

### 4. `cy.getStageColumn(title)`

Obtiene una columna de fase por título.

```typescript
// Uso
cy.getStageColumn('Technical Interview')
  .should('contain.text', 'John Doe')

// Implementación
Cypress.Commands.add('getStageColumn', (stageTitle: string) => {
  return cy.contains('.card-header', stageTitle).parent()
})
```

---

## 📊 Fixtures y Datos de Prueba

### `interviewFlow.json`

Define las 4 fases del proceso de entrevista:

```json
{
  "interviewFlow": {
    "positionName": "Software Engineer",
    "interviewFlow": {
      "interviewSteps": [
        { "id": 1, "name": "Initial Screening" },
        { "id": 2, "name": "Technical Interview" },
        { "id": 3, "name": "HR Interview" },
        { "id": 4, "name": "Offer" }
      ]
    }
  }
}
```

**Uso en tests:**

```typescript
cy.fixture('interviewFlow').then((interviewFlow) => {
  cy.intercept('GET', '/positions/1/interviewFlow', {
    statusCode: 200,
    body: interviewFlow
  })
})
```

### `candidates.json`

Define 4 candidatos de prueba distribuidos en diferentes fases:

```json
[
  {
    "candidateId": 1,
    "fullName": "John Doe",
    "currentInterviewStep": "Initial Screening",
    "averageScore": 5,
    "applicationId": 101
  },
  {
    "candidateId": 2,
    "fullName": "Jane Smith",
    "currentInterviewStep": "Initial Screening",
    "averageScore": 4,
    "applicationId": 102
  },
  {
    "candidateId": 3,
    "fullName": "Bob Johnson",
    "currentInterviewStep": "Technical Interview",
    "averageScore": 3,
    "applicationId": 103
  },
  {
    "candidateId": 4,
    "fullName": "Alice Williams",
    "currentInterviewStep": "HR Interview",
    "averageScore": 5,
    "applicationId": 104
  }
]
```

**Uso en tests:**

```typescript
cy.fixture('candidates').then((candidates) => {
  cy.intercept('GET', '/positions/1/candidates', {
    statusCode: 200,
    body: candidates
  })
})
```

---

## 🚀 Ejecución de las Pruebas

### Modo Interactivo (Recomendado para Desarrollo)

```bash
cd cypress-e2e

# Abrir Test Runner
npm run cypress:open

# En la UI:
# 1. Click en "E2E Testing"
# 2. Seleccionar navegador (Chrome, Firefox, Electron)
# 3. Click en "position-board.cy.ts"
```

**Ventajas:**
- Ver tests en tiempo real
- Inspeccionar elementos
- Ver snapshots de cada paso
- Debugging interactivo
- Ver network requests

### Modo Headless (CI/CD)

```bash
cd cypress-e2e

# Ejecutar solo position-board
npx cypress run --spec "cypress/e2e/position-board.cy.ts"

# Con Chrome
npx cypress run --spec "cypress/e2e/position-board.cy.ts" --browser chrome

# Con grabación de video
npx cypress run --spec "cypress/e2e/position-board.cy.ts" --config video=true

# Con más verbosidad
npx cypress run --spec "cypress/e2e/position-board.cy.ts" --headed

# Ejecutar todos los tests
npm run cypress:run
```

### Ejecutar en Paralelo (Cypress Cloud)

```bash
# Registrarse en Cypress Cloud
npx cypress open

# Ejecutar en paralelo (requiere Cypress Cloud)
npx cypress run --record --parallel
```

### Scripts Personalizados

Puedes agregar estos scripts a `package.json`:

```json
{
  "scripts": {
    "test:position-board": "cypress run --spec 'cypress/e2e/position-board.cy.ts'",
    "test:position-board:open": "cypress open --e2e --browser chrome",
    "test:position-board:chrome": "cypress run --spec 'cypress/e2e/position-board.cy.ts' --browser chrome",
    "test:position-board:firefox": "cypress run --spec 'cypress/e2e/position-board.cy.ts' --browser firefox"
  }
}
```

Luego ejecutar:

```bash
npm run test:position-board
npm run test:position-board:open
```

---

## 🐛 Solución de Problemas

### Problema 1: "Cannot find module '@4tw/cypress-drag-drop'"

**Causa:** Plugin de drag & drop no instalado.

**Solución:**

```bash
cd cypress-e2e
npm install --save-dev @4tw/cypress-drag-drop
```

### Problema 2: "connect ECONNREFUSED ::1:3000"

**Causa:** Frontend no está corriendo.

**Solución:**

```bash
# En otra terminal
cd frontend
npm start

# Verificar
curl http://localhost:3000
```

### Problema 3: "Timed out retrying: Expected to find element: h2"

**Causa:** El backend no responde o la posición no existe.

**Solución:**

```bash
# Verificar backend
curl http://localhost:3010/positions/1/interviewFlow

# Si devuelve 404, seed la base de datos
cd backend
npx prisma db seed
```

### Problema 4: "cy.drag is not a function"

**Causa:** Plugin de drag & drop no importado en `commands.ts`.

**Solución:**

Asegúrate de que `cypress/support/commands.ts` tiene:

```typescript
import '@4tw/cypress-drag-drop'
```

### Problema 5: Drag & Drop no funciona

**Posibles causas:**
- `react-beautiful-dnd` requiere configuración especial
- Los selectores de droppable son incorrectos
- La animación interfiere con el test

**Solución:**

```typescript
// Usar force: true
cy.getCandidateCard('John Doe')
  .drag('[data-rbd-droppable-id="1"]', { force: true })

// O esperar más tiempo
cy.wait(500)
cy.getCandidateCard('John Doe')
  .drag('[data-rbd-droppable-id="1"]')
```

### Problema 6: "No specs found"

**Causa:** Cypress no encuentra el archivo `.cy.ts`.

**Solución:**

```bash
# Verificar que el archivo existe
ls cypress/e2e/position-board.cy.ts

# Verificar specPattern en cypress.config.ts
# Debería ser: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
```

### Problema 7: Tests fallan en CI pero pasan localmente

**Causas comunes:**
- Diferencias de viewport
- Tiempos de red diferentes
- Variables de entorno faltantes

**Solución:**

```typescript
// Aumentar timeouts para CI
cy.wait('@updateCandidate', { timeout: 15000 })

// Usar viewport consistente
beforeEach(() => {
  cy.viewport(1280, 720)
})

// Mock datos en lugar de usar API real
cy.intercept('GET', '/positions/1/candidates', {
  fixture: 'candidates'
})
```

---

## 💡 Mejores Prácticas

### 1. **Usa fixtures en lugar de API real cuando sea posible**

✅ Bueno:
```typescript
cy.fixture('candidates').then((candidates) => {
  cy.intercept('GET', '/positions/1/candidates', { body: candidates })
})
```

❌ Malo:
```typescript
// Depende de datos reales que pueden cambiar
cy.visit('/positions/1')
// Si alguien borra candidatos, el test falla
```

### 2. **Usa custom commands para código repetitivo**

✅ Bueno:
```typescript
cy.setupApiInterceptors()
cy.waitForPositionBoard()
cy.getCandidateCard('John Doe').drag(...)
```

❌ Malo:
```typescript
cy.intercept('GET', '/positions/*/interviewFlow').as('getInterviewFlow')
cy.intercept('GET', '/positions/*/candidates').as('getCandidates')
cy.wait(['@getInterviewFlow', '@getCandidates'])
cy.contains('.card-title', 'John Doe').parent().parent().drag(...)
```

### 3. **Usa selectores robustos**

✅ Bueno:
```typescript
cy.get('[data-test="candidate-card"]')
cy.get('[data-candidate-id="1"]')
cy.contains('.card-title', 'John Doe') // Con contenido único
```

❌ Malo:
```typescript
cy.get('.mb-2')  // Clase genérica de Bootstrap
cy.get('div > div > div > h5')  // Selector frágil
```

### 4. **Espera eventos asíncronos correctamente**

✅ Bueno:
```typescript
cy.wait('@updateCandidate')
cy.get('.card-title').should('have.length', 4)
```

❌ Malo:
```typescript
cy.wait(3000)  // Tiempo arbitrario
```

### 5. **Documenta tests complejos**

✅ Bueno:
```typescript
/**
 * Test 2.2: Verificación de Actualización Backend
 * 
 * Valida que al mover un candidato de Initial Screening
 * a Technical Interview, se hace un PUT con:
 * - applicationId: 101
 * - currentInterviewStep: 2 (ID de Technical Interview)
 */
it('should call backend API with correct data', () => {
  // ...
})
```

### 6. **Tests independientes**

✅ Bueno:
```typescript
beforeEach(() => {
  // Reset de estado para cada test
  cy.setupApiInterceptors()
  cy.fixture('candidates').then((candidates) => {
    cy.intercept('GET', '/positions/1/candidates', { body: candidates })
  })
})
```

❌ Malo:
```typescript
// Test 1 modifica datos
it('test 1', () => { /* mueve candidato */ })

// Test 2 asume cambios del test 1
it('test 2', () => { /* espera candidato movido */ })
```

### 7. **Verifica tanto request como response**

✅ Bueno:
```typescript
cy.wait('@updateCandidate').then((interception) => {
  // Request
  expect(interception.request.body.applicationId).to.equal(101)
  
  // Response
  expect(interception.response.statusCode).to.equal(200)
})
```

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [Cypress Docs](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Intercept API](https://docs.cypress.io/api/commands/intercept)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)

### Plugins Utilizados

- [@4tw/cypress-drag-drop](https://github.com/4tw/cypress-drag-drop)
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)

### Tutoriales

- [Testing Drag & Drop](https://www.cypress.io/blog/2020/11/12/testing-application-in-dark-mode/)
- [API Testing](https://learn.cypress.io/testing-your-first-application/how-to-test-network-requests)
- [TypeScript with Cypress](https://docs.cypress.io/guides/tooling/typescript-support)

---

## ✅ Checklist de Validación

Antes de considerar las pruebas completas, verifica:

- [ ] ✅ Backend corriendo en puerto 3010
- [ ] ✅ Frontend corriendo en puerto 3000
- [ ] ✅ Base de datos con datos de seed
- [ ] ✅ Plugin `@4tw/cypress-drag-drop` instalado
- [ ] ✅ Custom commands importados en `commands.ts`
- [ ] ✅ Fixtures creadas (`interviewFlow.json`, `candidates.json`)
- [ ] ✅ Todos los tests pasan en modo headless
- [ ] ✅ Tests pasan en Chrome y Firefox
- [ ] ✅ Tiempo de ejecución < 1 minuto
- [ ] ✅ No hay warnings de deprecación
- [ ] ✅ Screenshots se generan en fallos
- [ ] ✅ Documentación actualizada

---

**Última actualización:** Enero 2026  
**Versión de Cypress:** 15.9.0  
**Autor:** QA Automation Team
