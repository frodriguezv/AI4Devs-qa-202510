# 🎯 Instalación Cypress + TypeScript - Paso a Paso

## 📋 Índice
1. [Preparación del Proyecto](#1-preparación-del-proyecto)
2. [Instalación de Dependencias](#2-instalación-de-dependencias)
3. [Configuración de TypeScript](#3-configuración-de-typescript)
4. [Inicialización de Cypress](#4-inicialización-de-cypress)
5. [Ejecución de Pruebas](#5-ejecución-de-pruebas)
6. [Validación Final](#6-validación-final)

---

## 1️⃣ Preparación del Proyecto

### Crear directorio y entrar
```bash
mkdir cypress-e2e
cd cypress-e2e
```

### Inicializar proyecto npm
```bash
npm init -y
```

**✅ Resultado esperado:**
```
Wrote to /path/to/cypress-e2e/package.json:
{
  "name": "cypress-e2e",
  "version": "1.0.0",
  ...
}
```

**📁 Archivos creados:**
- `package.json`

---

## 2️⃣ Instalación de Dependencias

### Instalar Cypress y TypeScript
```bash
npm install --save-dev cypress typescript
```

**✅ Resultado esperado:**
```
added 175 packages, and audited 176 packages in 45s
found 0 vulnerabilities
```

**⏱️ Tiempo estimado:** 30-60 segundos

**📁 Archivos creados:**
- `node_modules/` (carpeta con 175 paquetes)
- `package-lock.json`

**📦 Verificar instalación:**
```bash
npx cypress --version
# Cypress package version: 15.9.0
# Cypress binary version: 15.9.0
```

---

## 3️⃣ Configuración de TypeScript

### Crear `tsconfig.json`
```bash
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

**✅ Resultado esperado:**
- Archivo `tsconfig.json` creado sin errores

**🔍 Verificar:**
```bash
cat tsconfig.json
# Debe mostrar el contenido del archivo
```

### Explicación de las opciones:
- `target`: Versión de JavaScript a la que se compila
- `types`: Incluye tipos de Cypress y Node.js
- `strict`: Activa mode estricto de TypeScript
- `include`: Solo compila archivos dentro de `cypress/`

---

## 4️⃣ Inicialización de Cypress

### Crear configuración de Cypress
```bash
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

### Crear estructura de carpetas
```bash
mkdir -p cypress/e2e/1-getting-started
mkdir -p cypress/e2e/2-advanced-examples
mkdir -p cypress/support
mkdir -p cypress/fixtures
```

**📁 Estructura creada:**
```
cypress/
├── e2e/
│   ├── 1-getting-started/
│   └── 2-advanced-examples/
├── fixtures/
└── support/
```

### Crear archivos de soporte
```bash
# Archivo: cypress/support/e2e.ts
cat > cypress/support/e2e.ts << 'EOF'
// Import commands.js using ES2015 syntax:
import './commands'
EOF

# Archivo: cypress/support/commands.ts
cat > cypress/support/commands.ts << 'EOF'
/// <reference types="cypress" />

export {}
EOF
```

### Crear fixture de ejemplo
```bash
cat > cypress/fixtures/example.json << 'EOF'
{
  "name": "Using fixtures to represent data",
  "email": "hello@cypress.io",
  "body": "Fixtures are a great way to mock data for responses to routes"
}
EOF
```

### Actualizar scripts en package.json
```bash
npm pkg set scripts.cypress:open="cypress open"
npm pkg set scripts.cypress:run="cypress run"
npm pkg set scripts.cypress:run:chrome="cypress run --browser chrome"
npm pkg set scripts.test="npm run cypress:run"
```

**✅ Verificar scripts:**
```bash
npm run
# Debe mostrar los 4 scripts configurados
```

---

## 5️⃣ Ejecución de Pruebas

### Verificar instalación de Cypress
```bash
npx cypress verify
```

**✅ Resultado esperado:**
```
✔  Verifying Cypress can run /path/to/Cypress.app
✔  Verified Cypress! /path/to/Cypress.app
```

### Opción A: Modo Interactivo (Recomendado para primera vez)
```bash
npm run cypress:open
```

**✅ Resultado esperado:**
1. Se abre una ventana de Cypress
2. Muestra opción "E2E Testing"
3. Click en "E2E Testing"
4. Selecciona un navegador (Chrome, Firefox, Electron)
5. Click en "Start E2E Testing"
6. Aparece la lista de specs de ejemplo

**🎯 Qué hacer:**
- Click en cualquier spec (ej: `todo.cy.ts`)
- Ver cómo se ejecutan los tests en tiempo real
- Observar los comandos en el panel izquierdo
- Ver las aserciones en verde ✓

### Opción B: Modo Headless (Línea de comandos)
```bash
npm run cypress:run
```

**✅ Resultado esperado:**
```
====================================================================================================

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        15.9.0                                                                         │
  │ Browser:        Electron 138 (headless)                                                        │
  │ Specs:          3 found                                                                        │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


  Running:  1-getting-started/todo.cy.ts

  example to-do app
    ✓ displays two todo items by default (706ms)
    ✓ can add new todo items (374ms)
    ✓ can check off an item as completed (154ms)
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

### Ejecutar en navegador específico
```bash
# Chrome
npm run cypress:run:chrome

# Firefox
npx cypress run --browser firefox

# Edge
npx cypress run --browser edge
```

### Ejecutar spec específico
```bash
npx cypress run --spec "cypress/e2e/1-getting-started/todo.cy.ts"
```

**✅ Resultado esperado:**
```
✔  todo.cy.ts                                             6        6        -
```

---

## 6️⃣ Validación Final

### Checklist de validación

#### ✅ Archivos de configuración
```bash
ls -1
```
**Debe mostrar:**
```
cypress/
cypress.config.ts
node_modules/
package.json
package-lock.json
tsconfig.json
```

#### ✅ Specs de TypeScript
```bash
find cypress/e2e -name "*.cy.ts"
```
**Debe mostrar:**
```
cypress/e2e/1-getting-started/todo.cy.ts
cypress/e2e/2-advanced-examples/actions.cy.ts
cypress/e2e/2-advanced-examples/navigation.cy.ts
```

#### ✅ Tests pasando
```bash
npm test 2>&1 | grep "All specs passed"
```
**Debe mostrar:**
```
✔  All specs passed!
```

#### ✅ TypeScript sin errores
```bash
npx tsc --noEmit
```
**Debe mostrar:**
- Sin output = Sin errores ✓
- Si hay errores, los muestra en rojo ✗

#### ✅ Cypress funcionando
```bash
npx cypress version
```
**Debe mostrar:**
```
Cypress package version: 15.9.0
Cypress binary version: 15.9.0
Electron version: 30.x.x
Bundled Node version: 20.x.x
```

---

## 🎉 ¡Instalación Completada!

### Resumen de lo que se instaló:

| Componente | Versión | Estado |
|------------|---------|--------|
| Cypress | 15.9.0 | ✅ |
| TypeScript | 5.9.3 | ✅ |
| Node Modules | 175 paquetes | ✅ |
| Specs de ejemplo | 3 archivos | ✅ |
| Tests totales | 22 tests | ✅ |

### Archivos importantes creados:

1. **cypress.config.ts** - Configuración principal de Cypress
2. **tsconfig.json** - Configuración de TypeScript
3. **cypress/support/e2e.ts** - Setup global para E2E
4. **cypress/support/commands.ts** - Custom commands
5. **cypress/fixtures/example.json** - Datos de prueba
6. **3 specs de ejemplo** - Tests de demostración

---

## 📝 Comandos de Resumen Rápido

```bash
# Ver información del proyecto
npm list --depth=0

# Ver scripts disponibles
npm run

# Ejecutar tests
npm test

# Abrir Cypress
npm run cypress:open

# Ver versión de Cypress
npx cypress --version

# Verificar instalación
npx cypress verify
```

---

## 🚀 Próximos Pasos

1. **Explorar los tests de ejemplo**
   ```bash
   npm run cypress:open
   ```

2. **Leer la documentación**
   - `README.md` - Documentación completa
   - `QUICKSTART.md` - Guía rápida
   - `INSTALLATION_SUMMARY.md` - Resumen de instalación

3. **Crear tu primer test**
   ```bash
   touch cypress/e2e/mi-primer-test.cy.ts
   ```

4. **Configurar baseUrl para tu app**
   ```typescript
   // cypress.config.ts
   baseUrl: 'http://localhost:3000',
   ```

---

## ❓ Troubleshooting

### Problema: "Cannot find name 'cy'"
**Solución:**
```bash
# Verificar tsconfig.json tiene:
"types": ["cypress", "node"]
```

### Problema: "Cypress is not installed"
**Solución:**
```bash
npx cypress install
```

### Problema: "No specs found"
**Solución:**
```bash
# Verificar que los specs tienen extensión .cy.ts
# Y están en la carpeta cypress/e2e/
```

### Problema: Tests fallan
**Solución:**
```bash
# Verificar conexión a internet (tests usan example.cypress.io)
# Ejecutar con más timeout:
npx cypress run --config defaultCommandTimeout=10000
```

---

## 📞 Soporte

- **Documentación oficial:** https://docs.cypress.io
- **GitHub Issues:** https://github.com/cypress-io/cypress/issues
- **Discord:** https://discord.gg/cypress
- **Stack Overflow:** Tag `cypress`

---

**✅ Instalación completada exitosamente**  
**🎯 22 tests ejecutándose correctamente**  
**🚀 Listo para comenzar a testear**

