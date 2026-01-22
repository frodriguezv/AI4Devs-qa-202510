# Prompt: Cambio de Configuración de Red (localhost a IP específica)

## Objetivo
Actualizar todas las configuraciones de red del proyecto para cambiar de `localhost` a una IP específica (por ejemplo: `10.211.55.5`).

## Contexto
Este cambio es necesario cuando el entorno de desarrollo requiere que el backend y frontend se ejecuten en una IP diferente a localhost, como cuando se usa Docker en máquinas virtuales o configuraciones de red específicas.

## Archivos a Modificar

### Frontend (4 archivos)

#### 1. `frontend/.env`
**Acción:** Crear o actualizar el archivo con las variables de entorno

```env
REACT_APP_API_URL=http://[IP]:3010
REACT_APP_FRONTEND_URL=http://[IP]:3000
```

#### 2. `frontend/src/components/AddCandidateForm.js`
**Cambio:** Actualizar la URL del fetch en la función `handleSubmit`

**De:**
```javascript
const res = await fetch('http://localhost:3010/candidates', {
```

**A:**
```javascript
const res = await fetch('http://[IP]:3010/candidates', {
```

#### 3. `frontend/src/components/FileUploader.js`
**Cambio:** Actualizar la URL del fetch en la función `handleFileUpload`

**De:**
```javascript
const res = await fetch('http://localhost:3010/upload', {
```

**A:**
```javascript
const res = await fetch('http://[IP]:3010/upload', {
```

#### 4. `frontend/src/services/candidateService.js`
**Cambios:** Actualizar ambos endpoints en las funciones `uploadCV` y `sendCandidateData`

**De:**
```javascript
const response = await axios.post('http://localhost:3010/upload', formData, {
// ...
const response = await axios.post('http://localhost:3010/candidates', candidateData);
```

**A:**
```javascript
const response = await axios.post('http://[IP]:3010/upload', formData, {
// ...
const response = await axios.post('http://[IP]:3010/candidates', candidateData);
```

### Backend (2 archivos)

#### 5. `backend/prisma/schema.prisma`
**Cambio:** Actualizar la URL de conexión de PostgreSQL en el datasource

**De:**
```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@localhost:5432/LTIdb"
}
```

**A:**
```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@[IP]:5432/LTIdb"
}
```

#### 6. `backend/src/index.ts`
**Cambios:** Actualizar CORS origin y mensaje de consola

**De:**
```typescript
// Middleware para permitir CORS desde http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ...

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

**A:**
```typescript
// Middleware para permitir CORS desde http://[IP]:3000
app.use(cors({
  origin: 'http://[IP]:3000',
  credentials: true
}));

// ...

app.listen(port, () => {
  console.log(`Server is running at http://[IP]:${port}`);
});
```

## Ejemplo de Solicitud

```
Necesito cambiar la configuración de red del proyecto de localhost a [IP_ESPECIFICA].

Por favor, actualiza los siguientes archivos:

Frontend:
- frontend/.env (crear/actualizar con variables de entorno)
- frontend/src/components/AddCandidateForm.js
- frontend/src/components/FileUploader.js
- frontend/src/services/candidateService.js

Backend:
- backend/prisma/schema.prisma (URL de PostgreSQL)
- backend/src/index.ts (CORS y mensaje de consola)

Reemplaza todas las instancias de localhost con [IP_ESPECIFICA] en:
- URLs de API (http://localhost:3010 → http://[IP_ESPECIFICA]:3010)
- URLs de frontend (http://localhost:3000 → http://[IP_ESPECIFICA]:3000)
- URL de base de datos (localhost:5432 → [IP_ESPECIFICA]:5432)

Solo realiza estos cambios de configuración de red, no modifiques nada más.
```

## Notas Importantes

1. **Puertos:**
   - Backend: 3010
   - Frontend: 3000
   - PostgreSQL: 5432

2. **Credenciales de base de datos:** Mantener las mismas credenciales existentes en `schema.prisma`

3. **CORS:** Asegurarse de actualizar el origin en el backend para permitir peticiones desde la nueva IP del frontend

4. **Variables de entorno:** El archivo `.env` del frontend puede estar en `.gitignore`, pero debe crearse localmente

5. **Reinicio necesario:** Después de estos cambios, será necesario:
   - Reiniciar el servidor backend
   - Reiniciar el servidor de desarrollo del frontend
   - Posiblemente regenerar el cliente Prisma: `npx prisma generate`

## Verificación

Después de aplicar los cambios, verificar:
- [ ] El backend inicia correctamente y muestra la IP en el mensaje de consola
- [ ] El frontend puede conectarse al backend
- [ ] Las peticiones CORS no son bloqueadas
- [ ] El backend se conecta correctamente a la base de datos
- [ ] Las subidas de archivos funcionan correctamente
- [ ] El formulario de agregar candidatos funciona correctamente

## Tags
`#configuración` `#red` `#localhost` `#ip` `#cors` `#docker` `#prisma` `#frontend` `#backend`


########################################################################################

Actúa como un **QA Automation Engineer Senior** con amplia experiencia en **Cypress + TypeScript**.

Tu objetivo es **instalar Cypress desde cero** y **verificar que funciona correctamente** ejecutando **los ejemplos embebidos que Cypress incluye por defecto**, pero dejando el proyecto listo para trabajar en **TypeScript** desde el inicio.

---

## 🎯 Objetivo
Confirmar que Cypress está correctamente instalado y funcionando usando **los ejemplos oficiales incluidos** (sin crear pruebas personalizadas), asegurando que el proyecto queda preparado para escribir/ejecutar specs en **TypeScript**.

---

## 📋 Reglas estrictas
- Usa **Node.js con npm**
- **SÍ usa TypeScript**
- NO agregues frameworks adicionales
- NO crees Page Objects
- NO crees tests personalizados (solo ejecutar los ejemplos)
- Usa únicamente **los specs de ejemplo que Cypress genera automáticamente**
- Todo debe ser ejecutable desde terminal
- Asume un sistema **macOS o Linux**
- Mantén el setup lo más simple posible (sin configuraciones enterprise)

---

## 🛠️ Pasos que debes ejecutar y explicar

### 1️⃣ Preparación del proyecto
- Crear un directorio nuevo
- Inicializar `package.json`
- Instalar Cypress como dependencia de desarrollo

### 2️⃣ Habilitar TypeScript para Cypress (mínimo necesario)
- Instalar las dependencias mínimas para TS (por ejemplo `typescript` y tipos requeridos si aplican)
- Crear un `tsconfig.json` **mínimo** enfocado a Cypress
- Explicar qué archivos se agregan y por qué, de forma breve

> Importante: No quiero una arquitectura completa; solo lo mínimo para poder correr specs en TS.

### 3️⃣ Instalación/Inicialización de Cypress
- Comando para abrir Cypress por primera vez
- Explicar brevemente qué carpetas genera Cypress
- Confirmar que Cypress generó **specs de ejemplo** (los que vienen por defecto)

### 4️⃣ Usar ejemplos embebidos, pero en modo TypeScript (sin inventar tests)
- Confirmar cuáles specs de ejemplo vienen por defecto
- Ajustar lo mínimo necesario para que Cypress reconozca/ejecute specs en TS:
  - Si Cypress crea ejemplos en `.cy.js`, indica el camino más directo para ejecutar ejemplos equivalentes en TS **sin cambiar el contenido lógico** (solo extensión/soporte TS si hace falta).
  - Si Cypress puede correr `.cy.ts` directamente, habilítalo de la forma más simple posible.
- NO agregar nuevos casos de prueba; solo usar los ejemplos.

### 5️⃣ Ejecución de pruebas
- Ejecutar Cypress en modo interactivo
- Ejecutar Cypress en modo headless
- Indicar qué navegador usar por defecto
- Asegurar que al menos 1 spec de ejemplo corre exitosamente

### 6️⃣ Validación de éxito
Explicar cómo confirmar que:
- Cypress está bien instalado
- Los ejemplos corren correctamente
- TypeScript está correctamente habilitado para futuras pruebas
- No hay errores de configuración

---

## 🧾 Output esperado
Incluye:
- Comandos exactos de terminal
- Breves explicaciones por sección
- Qué archivos deben existir al final (`cypress.config.*`, `tsconfig.json`, estructura `cypress/`, etc.)
- Mensajes esperados en consola
- Errores comunes (Node/Cypress/TS) y cómo resolverlos rápido

---

## 🚫 Fuera de alcance
- No CI/CD
- No plugins
- No reporters
- No fixtures
- No mocking
- No configuración avanzada
- No Page Object Model (por ahora)

---

Entrega el resultado de forma **paso a paso**, clara y lista para que un desarrollador junior la siga sin ayuda adicional.

########################################################################################


crea un prompt para sonnet 4.5 con estas instrucciones, pon el prompt en el archivo qa-prompt en la raiz del proyecto, no ejecutes el prompt solo crealo en un .md:

ahora crea un prompt para claude con estas intrucciones: Debes crear pruebas E2E para verificar los siguientes escenarios: Carga de la Página de Position: Verifica que el título de la posición se muestra correctamente. Verifica que se muestran las columnas correspondientes a cada fase del proceso de contratación. Verifica que las tarjetas de los candidatos se muestran en la columna correcta según su fase actual. Cambio de Fase de un Candidato: Simula el arrastre de una tarjeta de candidato de una columna a otra. Verifica que la tarjeta del candidato se mueve a la nueva columna. Verifica que la fase del candidato se actualiza correctamente en el backend mediante el endpoint PUT /candidate/:id.

contexto del proyecto es todo el proyecto actual @frontend @backend @cypress-e2e 


########################################################################################


Actúa como un **QA Automation Engineer Senior** especializado en **Cypress + TypeScript** y pruebas **E2E** para aplicaciones web modernas.

# Prompt para Creación de Pruebas E2E - Claude Sonnet 4.5

## Contexto del Proyecto

Este es un sistema de reclutamiento ATS (Applicant Tracking System) construido con:
- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL (puerto 3010)
- **Frontend**: React + TypeScript + react-beautiful-dnd (puerto 3000)
- **Testing E2E**: Cypress + TypeScript

El sistema permite gestionar candidatos en diferentes fases de un proceso de entrevista mediante una interfaz de arrastre y suelta (drag & drop).

### Estructura del Proyecto

```
/
├── backend/                  # API REST
│   ├── src/
│   │   ├── routes/          # Rutas de la API
│   │   ├── presentation/    # Controladores
│   │   ├── application/     # Servicios
│   │   └── domain/          # Modelos
│   └── prisma/              # Esquema de BD y migraciones
├── frontend/                # React App
│   └── src/
│       ├── components/      # Componentes React
│       └── services/        # Servicios de API
└── cypress-e2e/            # Tests E2E
    └── cypress/
        └── e2e/            # Specs de pruebas
```

### Componentes Clave del Frontend

#### PositionDetails.js
- **Ubicación**: `frontend/src/components/PositionDetails.js`
- **Propósito**: Componente principal que muestra el tablero Kanban de candidatos
- **Funcionalidades**:
  - Muestra el nombre de la posición en un `<h2>`
  - Renderiza columnas de fases usando `StageColumn` components
  - Implementa drag & drop con `react-beautiful-dnd`
  - Actualiza el backend cuando un candidato cambia de fase

#### StageColumn.js
- **Ubicación**: `frontend/src/components/StageColumn.js`
- **Propósito**: Columna individual que representa una fase del proceso
- **Estructura**:
  - Header con el título de la fase (`Card.Header`)
  - Body con las tarjetas de candidatos (`CandidateCard`)
  - Zona droppable para drag & drop

#### CandidateCard.js
- **Ubicación**: `frontend/src/components/CandidateCard.js`
- **Propósito**: Tarjeta individual de candidato que puede ser arrastrada

### Endpoints del Backend

#### GET /positions/:id/interviewFlow
- **Descripción**: Obtiene el flujo de entrevistas (fases) de una posición
- **Respuesta**:
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

#### GET /positions/:id/candidates
- **Descripción**: Obtiene los candidatos de una posición
- **Respuesta**:
```json
[
  {
    "candidateId": 1,
    "fullName": "John Doe",
    "currentInterviewStep": "Initial Screening",
    "averageScore": 4.5,
    "applicationId": 101
  }
]
```

#### PUT /candidates/:id
- **Ubicación**: `backend/src/routes/candidateRoutes.ts`
- **Descripción**: Actualiza la fase actual de un candidato
- **Body**:
```json
{
  "applicationId": 101,
  "currentInterviewStep": 2
}
```
- **Respuesta**: Candidato actualizado

### Configuración de Cypress

- **Config file**: `cypress-e2e/cypress.config.ts`
- **Specs location**: `cypress-e2e/cypress/e2e/`
- **Base URL**: Se debe configurar para `http://localhost:3000`

## Instrucciones para Claude Sonnet 4.5

Tu tarea es crear pruebas E2E completas usando Cypress + TypeScript para verificar la funcionalidad del tablero de candidatos. Las pruebas deben ser robustas, mantenibles y seguir las mejores prácticas de Cypress.

### Escenarios a Probar

#### 1. Carga de la Página de Position

Crea un spec llamado `position-board.cy.ts` que verifique:

**Escenario 1.1: Verificación del Título de la Posición**
- Navegar a la página de detalles de una posición (ej: `/positions/1`)
- Verificar que el elemento `<h2>` contiene el nombre de la posición
- El título debe ser visible y no estar vacío

**Escenario 1.2: Verificación de las Columnas de Fases**
- Verificar que se muestran las columnas correspondientes a cada fase del proceso
- Cada columna debe tener un header con el nombre de la fase
- El número de columnas debe corresponder al número de fases del flujo de entrevistas
- Las columnas deben estar ordenadas correctamente

**Escenario 1.3: Verificación de Tarjetas de Candidatos**
- Verificar que las tarjetas de candidatos se muestran en la columna correcta según su fase actual
- Cada tarjeta debe mostrar el nombre del candidato
- Las tarjetas deben ser visibles y estar en el DOM
- Verificar que candidatos con la misma fase están en la misma columna

#### 2. Cambio de Fase de un Candidato (Drag & Drop)

Crea pruebas que verifiquen la funcionalidad de arrastre y suelta:

**Escenario 2.1: Movimiento de Tarjeta Entre Columnas**
- Simular el arrastre de una tarjeta de candidato de una columna (fase origen) a otra columna (fase destino)
- Usar los comandos de Cypress apropiados para drag & drop
- Verificar que la tarjeta desaparece de la columna origen
- Verificar que la tarjeta aparece en la columna destino
- Verificar que el nombre del candidato se mantiene correcto

**Escenario 2.2: Actualización en el Backend**
- Interceptar la llamada HTTP al endpoint `PUT /candidates/:id`
- Verificar que se hace la llamada al endpoint correcto
- Verificar que el body de la petición contiene:
  - `applicationId`: número correcto
  - `currentInterviewStep`: ID de la nueva fase
- Verificar que la respuesta es exitosa (status 200)
- Verificar que los datos persisten después de recargar la página

**Escenario 2.3: Manejo de Múltiples Movimientos**
- Mover un candidato a través de varias fases secuencialmente
- Verificar que cada movimiento actualiza correctamente el backend
- Verificar el estado final del candidato

### Requisitos Técnicos

#### Estructura del Spec
```typescript
/// <reference types="cypress" />

describe('Position Board - E2E Tests', () => {
  beforeEach(() => {
    // Setup común: visitar la página, interceptores, etc.
  });

  context('Carga de la Página', () => {
    // Tests de escenario 1
  });

  context('Drag & Drop de Candidatos', () => {
    // Tests de escenario 2
  });
});
```

#### Mejores Prácticas a Seguir

1. **Selectores**:
   - Usa selectores robustos (preferiblemente `data-test` attributes si es posible)
   - Evita selectores frágiles basados en clases CSS que puedan cambiar
   - Usa selectores semánticos cuando sea apropiado

2. **Esperas**:
   - Usa `cy.intercept()` para esperar requests HTTP
   - Usa `cy.wait('@alias')` para esperar interceptores
   - NO uses `cy.wait(time)` con tiempos arbitrarios

3. **Aserciones**:
   - Usa aserciones específicas y descriptivas
   - Verifica tanto la existencia como la visibilidad de elementos
   - Verifica el contenido de texto cuando sea relevante

4. **Drag & Drop**:
   - Investiga si `react-beautiful-dnd` requiere plugins especiales de Cypress
   - Considera usar `@4tw/cypress-drag-drop` si es necesario
   - Verifica el estado del DOM antes y después del drag & drop

5. **Interceptores HTTP**:
   - Intercepta todas las llamadas relevantes al backend
   - Usa aliases descriptivos (ej: `@updateCandidatePhase`)
   - Verifica tanto la request como la response

6. **Datos de Prueba**:
   - Usa datos de prueba consistentes y predecibles
   - Considera crear fixtures si es necesario
   - Documenta cualquier setup de datos requerido

7. **Limpieza**:
   - Usa `beforeEach()` para setup común
   - Considera si necesitas `afterEach()` para limpieza
   - Asegúrate de que los tests sean independientes entre sí

### Configuración Necesaria

Antes de crear las pruebas, verifica y actualiza si es necesario:

1. **cypress.config.ts**: Asegurar que `baseUrl` está configurada correctamente
2. **package.json**: Verificar que los scripts de Cypress están disponibles
3. **Dependencias**: Instalar plugins necesarios para drag & drop si es requerido

### Entregables Esperados

1. **Archivo de spec**: `cypress-e2e/cypress/e2e/position-board.cy.ts`
2. **Fixtures** (si es necesario): Datos de prueba en `cypress-e2e/cypress/fixtures/`
3. **Custom commands** (si es necesario): Comandos reutilizables en `cypress-e2e/cypress/support/commands.ts`
4. **Documentación**: Comentarios en el código explicando tests complejos
5. **README actualizado**: Instrucciones para ejecutar las nuevas pruebas

### Consideraciones Adicionales

1. **Navegadores**: Las pruebas deben funcionar en Chrome y Firefox
2. **Viewport**: Usar un viewport estándar (1280x720 o similar)
3. **Timeouts**: Configurar timeouts apropiados para requests HTTP
4. **Error Handling**: Verificar comportamiento en casos de error del backend
5. **Performance**: Las pruebas deben ejecutarse en menos de 1 minuto
6. **CI/CD Ready**: Las pruebas deben poder ejecutarse en modo headless

### Ejemplo de Interceptor

```typescript
// Interceptar GET de fases
cy.intercept('GET', '/positions/*/interviewFlow').as('getInterviewFlow');

// Interceptar GET de candidatos
cy.intercept('GET', '/positions/*/candidates').as('getCandidates');

// Interceptar PUT de actualización
cy.intercept('PUT', '/candidates/*').as('updateCandidate');

// Visitar página
cy.visit('/positions/1');

// Esperar a que carguen los datos
cy.wait(['@getInterviewFlow', '@getCandidates']);
```

### Ejemplo de Drag & Drop

```typescript
// Nota: El método exacto puede variar según los plugins disponibles
// Opción 1: Usando plugin cypress-drag-drop
cy.get('[data-candidate-id="1"]')
  .drag('[data-stage-id="2"]');

// Opción 2: Usando comandos nativos de Cypress
cy.get('[data-candidate-id="1"]')
  .trigger('dragstart');
cy.get('[data-stage-id="2"]')
  .trigger('drop');
```

### Criterios de Éxito

Las pruebas serán exitosas si:

1. ✅ Todos los tests pasan en modo headless
2. ✅ Los tests son repetibles y consistentes
3. ✅ La cobertura incluye todos los escenarios especificados
4. ✅ Los tests usan selectores robustos
5. ✅ Los interceptores HTTP funcionan correctamente
6. ✅ El drag & drop se simula correctamente
7. ✅ Los tests son mantenibles y bien documentados
8. ✅ El tiempo de ejecución es razonable (< 1 minuto)

## Información Adicional

### URLs del Sistema
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3010`
- Página de prueba: `http://localhost:3000/positions/1` (o el ID que corresponda)

### Comandos para Ejecutar

```bash
# Desde el directorio cypress-e2e/

# Abrir Cypress en modo interactivo
npm run cypress:open

# Ejecutar tests en modo headless
npm run cypress:run

# Ejecutar spec específico
npx cypress run --spec "cypress/e2e/position-board.cy.ts"
```

### Recursos de Referencia

- Documentación de Cypress: https://docs.cypress.io
- react-beautiful-dnd testing: Buscar recursos sobre cómo testear drag & drop
- Cypress best practices: https://docs.cypress.io/guides/references/best-practices

---

## Instrucciones Finales

1. **Analiza** el código del frontend para entender la estructura del DOM
2. **Implementa** los tests siguiendo las mejores prácticas de Cypress
3. **Verifica** que los interceptores HTTP funcionan correctamente
4. **Prueba** el drag & drop exhaustivamente
5. **Documenta** cualquier setup adicional necesario
6. **Ejecuta** los tests en modo headless para validar
7. **Optimiza** si hay tests lentos o frágiles

**Objetivo**: Crear una suite de pruebas E2E robusta, mantenible y confiable que valide completamente la funcionalidad del tablero de candidatos.


---