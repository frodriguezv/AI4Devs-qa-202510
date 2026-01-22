# 🎯 Cypress + TypeScript - Instalación desde Cero

Este proyecto demuestra una instalación **mínima y funcional** de Cypress con TypeScript, ejecutando specs de ejemplo para validar que todo funciona correctamente.

---

## 📁 Estructura del Proyecto

```
cypress-e2e/
├── cypress/
│   ├── e2e/
│   │   ├── 1-getting-started/
│   │   │   └── todo.cy.ts                 # Spec de ejemplo: Lista de tareas
│   │   └── 2-advanced-examples/
│   │       ├── actions.cy.ts              # Spec de ejemplo: Acciones de Cypress
│   │       └── navigation.cy.ts           # Spec de ejemplo: Navegación
│   ├── fixtures/
│   │   └── example.json                   # Fixture de ejemplo
│   └── support/
│       ├── commands.ts                    # Comandos personalizados
│       └── e2e.ts                         # Archivo de soporte principal
├── cypress.config.ts                      # Configuración de Cypress
├── tsconfig.json                          # Configuración de TypeScript
├── package.json                           # Dependencias del proyecto
└── README.md                              # Este archivo
```

---

## 🛠️ Archivos de Configuración

### `cypress.config.ts`
Configuración principal de Cypress en TypeScript. Define:
- **baseUrl**: URL base para las pruebas
- **supportFile**: Archivo de soporte principal
- **specPattern**: Patrón para encontrar los specs (`.cy.ts`)
- **viewport**: Tamaño de la ventana del navegador
- **video**: Deshabilitado para pruebas más rápidas

### `tsconfig.json`
Configuración mínima de TypeScript para Cypress:
- **target**: ES2020
- **types**: Incluye tipos de Cypress y Node
- **include**: Solo archivos dentro de `cypress/**/*.ts`
- **strict**: Activado para mejor type-checking

### `package.json`
Scripts disponibles:
- `npm run cypress:open` - Abre Cypress en modo interactivo
- `npm run cypress:run` - Ejecuta todas las pruebas en modo headless
- `npm run cypress:run:chrome` - Ejecuta las pruebas en Chrome
- `npm test` - Alias para `cypress:run`

---

## 📦 Dependencias Instaladas

```json
{
  "devDependencies": {
    "cypress": "^15.9.0",
    "typescript": "^5.9.3"
  }
}
```

**Solo 2 dependencias necesarias:**
- `cypress` - Framework de testing E2E
- `typescript` - Compilador de TypeScript

---

## 🚀 Comandos de Ejecución

### 1️⃣ Modo Interactivo (con interfaz gráfica)
```bash
npm run cypress:open
```
Abre el Test Runner de Cypress donde puedes:
- Ver los tests en tiempo real
- Depurar paso a paso
- Inspeccionar el estado de la aplicación

### 2️⃣ Modo Headless (línea de comandos)
```bash
npm run cypress:run
```
Ejecuta todas las pruebas en terminal sin interfaz gráfica.

### 3️⃣ Ejecutar en Chrome
```bash
npm run cypress:run:chrome
```
Ejecuta las pruebas en Chrome en modo headless.

### 4️⃣ Ejecutar un spec específico
```bash
npx cypress run --spec "cypress/e2e/1-getting-started/todo.cy.ts"
```

### 5️⃣ Ejecutar con navegador específico
```bash
npx cypress run --browser firefox
npx cypress run --browser edge
```

---

## ✅ Validación de Instalación Exitosa

### Indicadores de éxito:

#### 1. Estructura de carpetas creada ✓
```
✓ cypress/e2e/
✓ cypress/fixtures/
✓ cypress/support/
✓ cypress.config.ts
✓ tsconfig.json
```

#### 2. Specs de TypeScript ejecutándose ✓
Los archivos `.cy.ts` se ejecutan sin errores de compilación.

#### 3. Todas las pruebas pasan ✓
```
✔  All specs passed!
Tests:        22
Passing:      22
Failing:      0
```

#### 4. TypeScript reconoce tipos de Cypress ✓
No hay errores de "Cannot find name 'cy'" o similares.

---

## 🧪 Specs de Ejemplo Incluidos

### 1. `todo.cy.ts` - Lista de Tareas (6 tests)
Demuestra:
- Verificación de elementos en la página
- Agregar nuevos items
- Marcar items como completados
- Filtrar por estado (activos/completados)
- Eliminar items completados

### 2. `actions.cy.ts` - Acciones de Cypress (13 tests)
Demuestra:
- `.type()` - Escribir en inputs
- `.click()` - Click en elementos
- `.check()` / `.uncheck()` - Checkboxes
- `.select()` - Selects/dropdowns
- `.focus()` / `.blur()` - Focus en elementos
- `.scrollIntoView()` - Scroll
- Y más...

### 3. `navigation.cy.ts` - Navegación (3 tests)
Demuestra:
- `cy.go()` - Navegación hacia atrás/adelante
- `cy.reload()` - Recargar la página
- `cy.visit()` - Visitar URLs

---

## 🎯 Tests de la Aplicación ATS

### `position-board.cy.ts` - Tablero de Candidatos (15+ tests)

Suite completa de pruebas E2E para el sistema ATS (Applicant Tracking System). Valida la funcionalidad completa del tablero de candidatos.

#### Escenarios Cubiertos:

##### 📋 Carga de la Página
- ✅ Verificación del título de la posición
- ✅ Verificación de columnas de fases (Initial Screening, Technical Interview, HR Interview, Offer)
- ✅ Verificación de tarjetas de candidatos en columnas correctas
- ✅ Verificación de visibilidad de todos los elementos UI

##### 🔄 Drag & Drop de Candidatos
- ✅ Movimiento de tarjetas entre columnas
- ✅ Actualización del backend con datos correctos (PUT /candidates/:id)
- ✅ Verificación de payload HTTP (applicationId, currentInterviewStep)
- ✅ Manejo de múltiples movimientos secuenciales
- ✅ Persistencia de datos después de recargar
- ✅ Manejo de errores del backend (500, timeouts, etc.)

##### 🧭 Navegación y UI
- ✅ Botón de "Volver a Posiciones" funciona correctamente
- ✅ Responsive behavior en diferentes viewports (Desktop, Laptop, Tablet)

##### ⚡ Performance y Estabilidad
- ✅ Carga eficiente de múltiples candidatos (50+ candidatos)
- ✅ Manejo de conexiones lentas (delays de 2+ segundos)

#### Prerequisitos para Ejecutar:

```bash
# 1. Backend corriendo en puerto 3010
cd backend
npm install
npm start

# 2. Frontend corriendo en puerto 3000
cd frontend
npm install
npm start

# 3. Base de datos PostgreSQL configurada
# Verificar que existe una posición con ID 1
```

#### Ejecutar las Pruebas del ATS:

```bash
# Desde el directorio cypress-e2e/

# Abrir Cypress en modo interactivo (recomendado para desarrollo)
npm run cypress:open
# Luego seleccionar "position-board.cy.ts" en la UI

# Ejecutar solo el spec del position board en modo headless
npx cypress run --spec "cypress/e2e/position-board.cy.ts"

# Ejecutar con un navegador específico
npx cypress run --spec "cypress/e2e/position-board.cy.ts" --browser chrome
npx cypress run --spec "cypress/e2e/position-board.cy.ts" --browser firefox

# Ejecutar con más información de debug
npx cypress run --spec "cypress/e2e/position-board.cy.ts" --config video=true
```

#### Fixtures y Datos de Prueba:

Las pruebas utilizan fixtures para simular respuestas del backend:

- **`cypress/fixtures/interviewFlow.json`**: Define las fases del proceso de entrevista
  - Initial Screening (id: 1)
  - Technical Interview (id: 2)
  - HR Interview (id: 3)
  - Offer (id: 4)

- **`cypress/fixtures/candidates.json`**: Define candidatos de prueba
  - John Doe (Initial Screening)
  - Jane Smith (Initial Screening)
  - Bob Johnson (Technical Interview)
  - Alice Williams (HR Interview)

#### Custom Commands Disponibles:

```typescript
// Setup de interceptores HTTP para todas las APIs
cy.setupApiInterceptors()

// Esperar a que el tablero cargue completamente
cy.waitForPositionBoard()

// Obtener una tarjeta de candidato por nombre
cy.getCandidateCard('John Doe')

// Obtener una columna de fase por título
cy.getStageColumn('Technical Interview')
```

#### Interceptores HTTP Configurados:

```typescript
// GET de flujo de entrevistas
cy.intercept('GET', '/positions/*/interviewFlow').as('getInterviewFlow')

// GET de candidatos
cy.intercept('GET', '/positions/*/candidates').as('getCandidates')

// PUT de actualización de candidato
cy.intercept('PUT', '/candidates/*').as('updateCandidate')
```

#### Tecnologías y Plugins Utilizados:

- **Cypress 15.9.0**: Framework de testing E2E
- **TypeScript 5.9.3**: Type safety y mejor DX
- **@4tw/cypress-drag-drop**: Plugin para simular drag & drop de `react-beautiful-dnd`
- **Fixtures**: Datos de prueba consistentes y predecibles

#### Criterios de Éxito:

Las pruebas son exitosas si:
- ✅ Todos los tests pasan en modo headless
- ✅ Los tests son repetibles y consistentes
- ✅ Cobertura completa de escenarios (carga, drag & drop, errores)
- ✅ Selectores robustos (no frágiles)
- ✅ Interceptores HTTP funcionan correctamente
- ✅ Tiempo de ejecución < 1 minuto
- ✅ Tests son mantenibles y bien documentados

---

## 🔧 Cómo Agregar Nuevos Tests

### 1. Crear un nuevo archivo `.cy.ts`
```typescript
/// <reference types="cypress" />

describe('Mi suite de pruebas', () => {
  beforeEach(() => {
    cy.visit('https://ejemplo.com')
  })

  it('debe hacer algo', () => {
    cy.get('selector').should('exist')
  })
})
```

### 2. Ejecutar el nuevo test
```bash
npm run cypress:open  # Modo interactivo
npm run cypress:run   # Modo headless
```

---

## 🚨 Errores Comunes y Soluciones

### Error: "Cannot find name 'cy'"
**Causa:** TypeScript no reconoce los tipos de Cypress.

**Solución:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["cypress", "node"]
  }
}
```

### Error: "No specs found"
**Causa:** Cypress no encuentra los archivos `.cy.ts`.

**Solución:** Verifica el `specPattern` en `cypress.config.ts`:
```typescript
specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
```

### Error: "Module not found: 'cypress'"
**Causa:** Cypress no está instalado.

**Solución:**
```bash
npm install --save-dev cypress
```

### Error: "baseUrl is not defined"
**Causa:** No se definió una URL base en la configuración.

**Solución:** Usa `cy.visit()` con URL completa o define `baseUrl` en config:
```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    baseUrl: 'https://tu-app.com',
  },
})
```

---

## 📊 Resultados Esperados

Cuando ejecutas `npm run cypress:run`, deberías ver:

```
====================================================================================================

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        15.9.0                                                                         │
  │ Browser:        Electron 138 (headless)                                                        │
  │ Specs:          3 found                                                                        │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘

  ...

  (Run Finished)

       Spec                                              Tests  Passing  Failing
  ┌────────────────────────────────────────────────────────────────────────────┐
  │ ✔  1-getting-started/todo.cy.ts                        6        6        - │
  │ ✔  2-advanced-examples/actions.cy.ts                  13       13        - │
  │ ✔  2-advanced-examples/navigation.cy.ts                3        3        - │
  └────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                                  22       22        -
```

---

## 🎓 Próximos Pasos

Ahora que tienes Cypress funcionando con TypeScript, puedes:

1. **Crear tus propios tests** en `cypress/e2e/`
2. **Agregar custom commands** en `cypress/support/commands.ts`
3. **Configurar tu aplicación** cambiando el `baseUrl` en `cypress.config.ts`
4. **Explorar la documentación oficial**: https://docs.cypress.io

---

## 📚 Recursos Útiles

- [Documentación oficial de Cypress](https://docs.cypress.io)
- [Cypress + TypeScript](https://docs.cypress.io/guides/tooling/typescript-support)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)

---

## ✨ Resumen

**✅ Instalación completa y funcional de Cypress + TypeScript**

- 📦 Solo 2 dependencias necesarias
- 🎯 3 specs de ejemplo funcionando (22 tests)
- 📝 TypeScript correctamente configurado
- 🚀 Listo para escribir nuevos tests
- 💚 Todas las pruebas pasando exitosamente

---

**Fecha de creación:** Enero 2026  
**Versión de Cypress:** 15.9.0  
**Versión de TypeScript:** 5.9.3  
**Versión de Node.js:** 24.11.0
