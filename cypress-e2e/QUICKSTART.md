# ⚡ Cypress + TypeScript - Guía Rápida

## 🚀 Inicio Rápido (5 minutos)

### 1️⃣ Verificar instalación
```bash
npx cypress verify
```
**Salida esperada:** `✔ Verified Cypress!`

---

### 2️⃣ Ejecutar todas las pruebas (headless)
```bash
npm test
# o
npm run cypress:run
```
**Salida esperada:** `✔ All specs passed! 22 tests`

---

### 3️⃣ Abrir interfaz gráfica
```bash
npm run cypress:open
```
Esto abre el **Cypress Test Runner** donde puedes ejecutar tests individualmente.

---

## 📋 Comandos Esenciales

| Comando | Descripción |
|---------|-------------|
| `npm run cypress:open` | Abrir Cypress en modo interactivo |
| `npm run cypress:run` | Ejecutar todos los tests en headless |
| `npm run cypress:run:chrome` | Ejecutar en Chrome |
| `npx cypress run --browser firefox` | Ejecutar en Firefox |
| `npx cypress run --spec "path/to/spec.cy.ts"` | Ejecutar un spec específico |
| `npx cypress run --headed` | Ejecutar con navegador visible |

---

## 🎯 Navegadores Soportados

```bash
# Electron (por defecto)
npm run cypress:run

# Chrome
npm run cypress:run:chrome

# Firefox
npx cypress run --browser firefox

# Edge
npx cypress run --browser edge
```

---

## 📝 Crear tu Primer Test

### Paso 1: Crear archivo
```bash
touch cypress/e2e/mi-primer-test.cy.ts
```

### Paso 2: Escribir el test
```typescript
/// <reference types="cypress" />

describe('Mi primer test', () => {
  it('debería cargar Google', () => {
    cy.visit('https://www.google.com')
    cy.title().should('include', 'Google')
  })

  it('debería buscar algo', () => {
    cy.visit('https://www.google.com')
    cy.get('[name="q"]').type('Cypress{enter}')
    cy.url().should('include', 'search')
  })
})
```

### Paso 3: Ejecutar
```bash
npx cypress run --spec "cypress/e2e/mi-primer-test.cy.ts"
```

---

## 🔍 Comandos de Cypress más Usados

### Navegación
```typescript
cy.visit('https://ejemplo.com')        // Visitar una URL
cy.go('back')                          // Ir atrás
cy.go('forward')                       // Ir adelante
cy.reload()                            // Recargar página
```

### Seleccionar Elementos
```typescript
cy.get('.clase')                       // Por clase CSS
cy.get('#id')                          // Por ID
cy.get('[data-test="selector"]')       // Por atributo (recomendado)
cy.contains('texto')                   // Por texto
```

### Interacciones
```typescript
cy.get('input').type('texto')          // Escribir
cy.get('button').click()               // Click
cy.get('checkbox').check()             // Marcar checkbox
cy.get('select').select('opcion')      // Seleccionar en dropdown
cy.get('input').clear()                // Limpiar input
```

### Aserciones
```typescript
cy.get('.element').should('exist')                    // Existe
cy.get('.element').should('be.visible')               // Es visible
cy.get('.element').should('have.text', 'texto')       // Tiene texto
cy.get('.element').should('have.class', 'activo')     // Tiene clase
cy.get('.element').should('have.length', 3)           // Cantidad
cy.url().should('include', '/ruta')                   // URL contiene
```

---

## 🛠️ Estructura de un Spec

```typescript
/// <reference types="cypress" />

describe('Nombre de la suite', () => {
  
  // Se ejecuta una vez antes de todos los tests
  before(() => {
    // Configuración inicial
  })

  // Se ejecuta antes de cada test
  beforeEach(() => {
    cy.visit('https://mi-app.com')
  })

  // Test individual
  it('debería hacer algo específico', () => {
    cy.get('.elemento').should('exist')
  })

  // Grupo de tests relacionados
  context('Cuando el usuario está logueado', () => {
    beforeEach(() => {
      // Login aquí
    })

    it('debería ver el dashboard', () => {
      cy.get('.dashboard').should('be.visible')
    })
  })

  // Se ejecuta después de cada test
  afterEach(() => {
    // Limpieza si es necesaria
  })

  // Se ejecuta una vez después de todos los tests
  after(() => {
    // Limpieza final
  })
})
```

---

## 📊 Interpretar Resultados

### ✅ Éxito
```
✔  All specs passed!
Tests:        22
Passing:      22
Failing:      0
```

### ❌ Fallos
```
✖  Some specs failed
Tests:        22
Passing:      20
Failing:      2
```

Para ver detalles de los fallos:
- En modo headless: Ver el output en consola
- En modo interactivo: Ver el Test Runner
- Screenshots: Guardados automáticamente en `cypress/screenshots/`

---

## 🐛 Debug

### Pausar ejecución
```typescript
cy.pause()  // Pausa la ejecución (solo en modo interactivo)
```

### Ver en consola
```typescript
cy.get('.elemento').then(($el) => {
  console.log($el)  // Log del elemento
})
```

### Debug command
```typescript
cy.get('.elemento').debug()  // Abre debugger
```

### Tiempo de espera personalizado
```typescript
cy.get('.elemento', { timeout: 10000 })  // 10 segundos
```

---

## ⚙️ Configuración Básica

### Cambiar baseUrl
```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',  // Tu app
  },
})
```

### Cambiar timeout global
```typescript
export default defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,  // 10 segundos
  },
})
```

### Cambiar viewport
```typescript
export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
})
```

---

## 📦 Agregar Dependencias

### TypeScript adicional
```bash
npm install --save-dev @types/node
```

### Utilidades para testing
```bash
npm install --save-dev @faker-js/faker  # Datos fake
npm install --save-dev cypress-real-events  # Eventos reales
```

---

## 🎯 Tips y Best Practices

### ✅ Hacer
- Usar `data-test` attributes para seleccionar elementos
- Usar `baseUrl` en la configuración
- Agrupar tests relacionados con `context()`
- Usar `beforeEach()` para setup común
- Usar aserciones específicas

### ❌ Evitar
- Usar `cy.wait(5000)` con tiempos arbitrarios
- Seleccionar por clases CSS que pueden cambiar
- Compartir estado entre tests
- Tests muy largos (dividir en varios)
- Hardcodear URLs completas en cada test

---

## 🔗 Links Útiles

- [Documentación oficial](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)
- [Ejemplos](https://github.com/cypress-io/cypress-example-recipes)

---

## ✨ Siguiente Nivel

Una vez que domines lo básico, explora:

1. **Custom Commands** - Crear tus propios comandos reutilizables
2. **Fixtures** - Usar datos de prueba desde archivos JSON
3. **Interceptores** - Mockear requests HTTP
4. **Page Objects** - Organizar mejor tu código de tests
5. **CI/CD Integration** - Ejecutar tests en GitHub Actions, GitLab CI, etc.

---

**¿Todo funcionando?** ✅  
**Tests pasando?** ✅  
**TypeScript sin errores?** ✅  

**¡Listo para comenzar a testear! 🚀**
