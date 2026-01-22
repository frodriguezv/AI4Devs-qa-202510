# 📝 Comandos Exactos de Instalación

Este archivo contiene **todos los comandos ejecutados** durante la instalación de Cypress + TypeScript, en orden cronológico.

---

## 📦 Paso 1: Crear Proyecto

```bash
# Crear directorio para el proyecto Cypress
mkdir cypress-e2e
cd cypress-e2e

# Inicializar proyecto npm
npm init -y
```

**Resultado esperado:**
```
Wrote to /path/to/cypress-e2e/package.json
```

---

## 🔧 Paso 2: Instalar Dependencias

```bash
# Instalar Cypress y TypeScript como dependencias de desarrollo
npm install --save-dev cypress typescript
```

**Resultado esperado:**
```
added 175 packages, and audited 176 packages in 45s
found 0 vulnerabilities
```

**Tiempo:** ~45-60 segundos

---

## ⚙️ Paso 3: Configurar TypeScript

```bash
# Crear tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "commonjs",
    "moduleResolution": "node",
    "types": ["cypress", "node"],
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "cypress/**/*.ts"
  ]
}
EOF
```

---

## 🎯 Paso 4: Configurar Cypress

```bash
# Crear cypress.config.ts
cat > cypress.config.ts << 'EOF'
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'https://example.cypress.io',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true,
})
EOF
```

---

## 📁 Paso 5: Crear Estructura de Carpetas

```bash
# Crear carpetas necesarias
mkdir -p cypress/e2e/1-getting-started
mkdir -p cypress/e2e/2-advanced-examples
mkdir -p cypress/support
mkdir -p cypress/fixtures
```

---

## 📝 Paso 6: Crear Archivos de Soporte

### Archivo: cypress/support/e2e.ts
```bash
cat > cypress/support/e2e.ts << 'EOF'
// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
EOF
```

### Archivo: cypress/support/commands.ts
```bash
cat > cypress/support/commands.ts << 'EOF'
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

export {}
EOF
```

### Archivo: cypress/fixtures/example.json
```bash
cat > cypress/fixtures/example.json << 'EOF'
{
  "name": "Using fixtures to represent data",
  "email": "hello@cypress.io",
  "body": "Fixtures are a great way to mock data for responses to routes"
}
EOF
```

---

## 🧪 Paso 7: Crear Specs de Ejemplo

Los specs completos están disponibles en:
- `cypress/e2e/1-getting-started/todo.cy.ts` (143 líneas)
- `cypress/e2e/2-advanced-examples/actions.cy.ts` (292 líneas)
- `cypress/e2e/2-advanced-examples/navigation.cy.ts` (57 líneas)

**Nota:** Estos archivos contienen código extenso. Para verlos completos, consulta los archivos directamente en el proyecto.

---

## 🎮 Paso 8: Agregar Scripts NPM

```bash
# Agregar scripts al package.json
npm pkg set scripts.cypress:open="cypress open"
npm pkg set scripts.cypress:run="cypress run"
npm pkg set scripts.cypress:run:chrome="cypress run --browser chrome"
npm pkg set scripts.test="npm run cypress:run"
```

**Verificar:**
```bash
npm run
```

---

## 🔍 Paso 9: Verificar Instalación

```bash
# Verificar que Cypress está instalado correctamente
npx cypress verify
```

**Resultado esperado:**
```
✔  Verifying Cypress can run /path/to/Cypress.app
✔  Verified Cypress! /path/to/Cypress.app
```

```bash
# Ver versión instalada
npx cypress --version
```

**Resultado esperado:**
```
Cypress package version: 15.9.0
Cypress binary version: 15.9.0
```

---

## ✅ Paso 10: Ejecutar Tests

### Modo Headless (Terminal)
```bash
# Ejecutar todos los tests
npm run cypress:run

# O directamente
npx cypress run
```

**Resultado esperado:**
```
✔  All specs passed!
Tests:        22
Passing:      22
Failing:      0
```

### Modo Headless en Chrome
```bash
npm run cypress:run:chrome

# O directamente
npx cypress run --browser chrome
```

### Ejecutar spec específico
```bash
npx cypress run --spec "cypress/e2e/1-getting-started/todo.cy.ts"
```

### Modo Interactivo (GUI)
```bash
npm run cypress:open

# O directamente
npx cypress open
```

**Esto abrirá la interfaz gráfica de Cypress donde podrás:**
1. Seleccionar "E2E Testing"
2. Elegir un navegador
3. Ver y ejecutar los specs de ejemplo

---

## 🗑️ Paso 11: Crear .gitignore

```bash
cat > .gitignore << 'EOF'
# Cypress
cypress/videos/
cypress/screenshots/
cypress/downloads/
cypress/results/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# TypeScript
*.tsbuildinfo
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Environment
.env
.env.local
.env.*.local

# Test results
junit.xml
mochawesome-report/
cypress-results.json
EOF
```

---

## 🎯 Comandos de Validación Final

```bash
# Verificar estructura de archivos
ls -la

# Verificar specs de TypeScript
find cypress/e2e -name "*.cy.ts"

# Verificar que TypeScript está configurado correctamente
npx tsc --noEmit

# Ejecutar todos los tests para validar
npm test
```

---

## 📊 Resumen de Comandos por Categoría

### Instalación
```bash
npm init -y
npm install --save-dev cypress typescript
```

### Verificación
```bash
npx cypress verify
npx cypress --version
npx tsc --noEmit
```

### Ejecución
```bash
npm test                          # Ejecutar todos (headless)
npm run cypress:run               # Ejecutar todos (headless)
npm run cypress:run:chrome        # Ejecutar en Chrome
npm run cypress:open              # Modo interactivo
npx cypress run --spec "path"     # Ejecutar spec específico
```

### Información
```bash
npm run                           # Ver scripts disponibles
npm list --depth=0                # Ver dependencias instaladas
```

---

## 🔄 Replicar en Otro Proyecto

Para replicar esta instalación en otro proyecto:

```bash
# 1. Crear nuevo directorio
mkdir mi-nuevo-proyecto-cypress
cd mi-nuevo-proyecto-cypress

# 2. Copiar package.json y archivos de config
# (Copiar package.json, tsconfig.json, cypress.config.ts)

# 3. Instalar dependencias
npm install

# 4. Copiar estructura cypress/
# (Copiar carpeta cypress/ completa)

# 5. Verificar
npm test
```

---

## 🚀 Comandos Más Usados en el Día a Día

```bash
# Desarrollo
npm run cypress:open              # Modo interactivo para desarrollo

# Testing
npm test                          # Ejecutar todos los tests

# Debug
npx cypress run --headed          # Ver el navegador durante ejecución
npx cypress run --browser chrome  # Usar navegador específico
npx cypress run --spec "path"     # Ejecutar test específico

# Verificación
npx cypress verify                # Verificar instalación
npx tsc --noEmit                  # Verificar errores de TypeScript
```

---

## 📝 Notas Importantes

1. **Primera ejecución:** La primera vez que ejecutas Cypress puede tardar más porque descarga el binario.

2. **Versiones específicas:** Si necesitas versiones específicas:
   ```bash
   npm install --save-dev cypress@15.9.0 typescript@5.9.3
   ```

3. **Actualizar Cypress:**
   ```bash
   npm update cypress
   ```

4. **Limpiar caché de Cypress:**
   ```bash
   npx cypress cache clear
   npx cypress cache list
   ```

5. **Variables de entorno:** Para configuraciones avanzadas, puedes usar variables de entorno:
   ```bash
   export CYPRESS_BASE_URL=http://localhost:3000
   npm test
   ```

---

## ✅ Checklist de Instalación

- [ ] `npm init -y` ejecutado
- [ ] `cypress` y `typescript` instalados
- [ ] `tsconfig.json` creado
- [ ] `cypress.config.ts` creado
- [ ] Estructura `cypress/` creada
- [ ] Archivos de soporte creados
- [ ] Specs de ejemplo creados
- [ ] Scripts npm configurados
- [ ] `.gitignore` creado
- [ ] `npx cypress verify` exitoso
- [ ] `npm test` ejecuta 22 tests exitosamente
- [ ] Documentación revisada

---

**Fecha de instalación:** Enero 2026  
**Tiempo total:** ~10 minutos  
**Versiones:**
- Cypress: 15.9.0
- TypeScript: 5.9.3
- Node.js: 24.11.0
