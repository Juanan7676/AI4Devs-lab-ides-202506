# Prompt inicial: definición de tareas usando meta-prompting

Tengo el siguiente ticket para implementar en este proyecto:
```
Añadir Candidato al Sistema
Como reclutador,
Quiero tener la capacidad de añadir candidatos al sistema ATS,
Para que pueda gestionar sus datos y procesos de selección de manera eficiente.

Criterios de Aceptación:

Accesibilidad de la función: Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador.
Formulario de ingreso de datos: Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato como nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral.
Validación de datos: El formulario debe validar los datos ingresados para asegurar que son completos y correctos. Por ejemplo, el correo electrónico debe tener un formato válido y los campos obligatorios no deben estar vacíos.
Carga de documentos: El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX.
Confirmación de añadido: Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema.
Errores y manejo de excepciones: En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema.
Accesibilidad y compatibilidad: La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.
Notas:

La interfaz debe ser intuitiva y fácil de usar para minimizar el tiempo de entrenamiento necesario para los nuevos reclutadores.
Considerar la posibilidad de integrar funcionalidades de autocompletado para los campos de educación y experiencia laboral, basados en datos preexistentes en el sistema.
Tareas Técnicas:

Implementar la interfaz de usuario para el formulario de añadir candidato.
Desarrollar el backend necesario para procesar la información ingresada en el formulario.
Asegurar la seguridad y privacidad de los datos del candidato.
```
Desarrolla 3 prompts detallados para cada una de las tareas técnicas que se detallan al final del ticket. Pregúntame todas las dudas que tengas para tomar las decisiones técnicas que necesites.

-------------------------------------------------
Respuesta de la IA:

Perfecto, voy a analizar el proyecto para entender la estructura actual y luego desarrollar los 3 prompts detallados para las tareas técnicas. Primero necesito explorar el código base para tomar decisiones técnicas informadas.


Ran tool

Read file: README.md

Ran tool

Ran tool

Ran tool

Ran tool

Ran tool

Read file: backend/prisma/schema.prisma

Read file: backend/src/index.ts

Read file: frontend/src/App.tsx

Read file: frontend/package.json

Read file: backend/package.json
Perfecto, ahora tengo una comprensión clara del proyecto. Es un sistema ATS (Applicant Tracking System) con:

- **Frontend**: React con TypeScript
- **Backend**: Express con TypeScript y Prisma ORM
- **Base de datos**: PostgreSQL
- **Estado actual**: Proyecto básico con estructura mínima

Antes de desarrollar los prompts, necesito aclarar algunas decisiones técnicas importantes:

## Preguntas para tomar decisiones técnicas:

### 1. **Estructura de datos del candidato**
¿Qué campos específicos necesitas para el candidato? Basándome en el ticket, sugiero:
- **Información personal**: nombre, apellido, email, teléfono, dirección
- **Educación**: título, institución, año de graduación, nivel educativo
- **Experiencia laboral**: empresa, puesto, fecha inicio/fin, descripción
- **Documentos**: CV (PDF/DOCX)

¿Te parece bien esta estructura o necesitas campos adicionales?

### 2. **Gestión de archivos**
¿Dónde prefieres almacenar los CVs de los candidatos?
- **Opción A**: Almacenamiento local en el servidor
- **Opción B**: Servicio cloud (AWS S3, Google Cloud Storage)
- **Opción C**: Base de datos como BLOB

### 3. **Autenticación y autorización**
¿El sistema ya tiene implementado un sistema de autenticación para reclutadores, o necesito incluirlo en los prompts?

### 4. **Librerías de UI**
¿Prefieres usar alguna librería específica para el frontend como Material-UI, Ant Design, o mantener el CSS vanilla?

### 5. **Validación de formularios**
¿Prefieres validación del lado cliente con alguna librería como Formik + Yup, o validación manual?

### 6. **Estructura de carpetas**
¿Prefieres una estructura modular con carpetas separadas para componentes, servicios, etc., o mantener todo en archivos individuales?

Una vez que me confirmes estas decisiones, podré desarrollar los 3 prompts detallados para:

1. **Implementar la interfaz de usuario para el formulario de añadir candidato**
2. **Desarrollar el backend necesario para procesar la información**
3. **Asegurar la seguridad y privacidad de los datos del candidato**

¿Podrías responderme estas preguntas para poder crear los prompts más específicos y útiles?

------------------------------------------------

1. Sí, creo que es una estructura de datos correcta.
2. Tiraría por algo simple pero escalable. De momento, podemos almacenarlos en al base de datos como blobs, así que sugiero la opción C.
3. No, el proyecto es algo básico. Tendrás que implementar un sistema de login y su modelo correspondiente en base de datos. Un login simple tipo nombre de usuario/contraseña debería ser suficiente. Para la autenticación usa algo simple, como JWT.
4. Usa la que creas conveniente para que quede mejor el proyecto. Me han hablado muy bien de Ant Design, úsala.
5. Usa la librería que creas conveniente, decide tú.
6. Haz una estructura modular y escalable, a ser posible, usa BDD en el backend y carpetas separadas en el frontend para componentes y servicios, como has descrito.

---------------------------------

# Tarea 1: Implementar la interfaz de usuario

```
Necesito que implementes la interfaz de usuario completa para el formulario de añadir candidatos en un sistema ATS (Applicant Tracking System). El proyecto es una aplicación React con TypeScript que usa Ant Design como librería de UI.

CONTEXTO DEL PROYECTO:
- Frontend: React 18 + TypeScript
- UI Library: Ant Design
- Validación: Formik + Yup
- Estructura modular con carpetas separadas
- Backend: Express + Prisma + PostgreSQL
- Autenticación: JWT (a implementar)

REQUISITOS FUNCIONALES:
1. **Dashboard principal del reclutador**: Crear una página principal con un botón prominente "Añadir Candidato"
2. **Formulario completo** con los siguientes campos:
   - Información personal: nombre, apellido, email, teléfono, dirección
   - Educación: título, institución, año de graduación, nivel educativo
   - Experiencia laboral: empresa, puesto, fecha inicio/fin, descripción
   - Carga de CV: soporte para PDF y DOCX
3. **Validación completa** de todos los campos
4. **Mensajes de confirmación** y manejo de errores
5. **Responsive design** para diferentes dispositivos

ESTRUCTURA DE CARPETAS A CREAR:
frontend/src/
├── components/
│ ├── common/
│ │ ├── Header.tsx
│ │ ├── Sidebar.tsx
│ │ └── Layout.tsx
│ ├── forms/
│ │ ├── CandidateForm.tsx
│ │ ├── PersonalInfoSection.tsx
│ │ ├── EducationSection.tsx
│ │ └── ExperienceSection.tsx
│ └── dashboard/
│ └── Dashboard.tsx
├── pages/
│ ├── Login.tsx
│ ├── Dashboard.tsx
│ └── AddCandidate.tsx
├── services/
│ ├── api.ts
│ ├── authService.ts
│ └── candidateService.ts
├── types/
│ ├── candidate.ts
│ └── auth.ts
├── utils/
│ ├── validation.ts
│ └── constants.ts
└── hooks/
└── useAuth.ts

TAREAS ESPECÍFICAS:

1. **Instalar dependencias necesarias**:
   - antd (Ant Design)
   - formik + yup
   - react-router-dom
   - axios
   - @types/react-router-dom

2. **Crear tipos TypeScript** para candidatos:
   ```typescript
   interface Candidate {
     id?: number;
     firstName: string;
     lastName: string;
     email: string;
     phone: string;
     address: string;
     education: Education[];
     experience: Experience[];
     cvFile?: File;
   }
   ```

3. **Implementar sistema de autenticación básico**:
   - Página de login con username/password
   - Manejo de JWT tokens
   - Protección de rutas

4. **Crear el formulario principal** con:
   - Secciones colapsables para mejor UX
   - Validación en tiempo real
   - Carga de archivos con preview
   - Botones de guardar/cancelar

5. **Implementar dashboard** con:
   - Estadísticas básicas
   - Lista de candidatos recientes
   - Botón prominente para añadir candidato

6. **Responsive design**:
   - Mobile-first approach
   - Breakpoints para tablet y desktop
   - Formulario adaptativo

CARACTERÍSTICAS TÉCNICAS:
- Usar Ant Design components: Form, Input, Select, DatePicker, Upload, Button, Card, Layout
- Implementar loading states y skeleton screens
- Manejo de errores con Ant Design notifications
- Validación con Yup schemas
- Navegación con React Router
- Estado global con React Context para autenticación

ENTREGABLES:
1. Código completo del frontend con estructura modular
2. Formulario funcional con validación
3. Sistema de autenticación básico
4. Dashboard responsive
5. Integración con el backend (endpoints a implementar)

¿Puedes implementar esta interfaz de usuario siguiendo estas especificaciones?
```
---------------------------------------------------------

# Tarea 2: Desarrollar el backend

```
Necesito que implementes el backend completo para el sistema ATS, incluyendo autenticación, gestión de candidatos y manejo de archivos. El proyecto usa Express con TypeScript, Prisma ORM y PostgreSQL.

CONTEXTO DEL PROYECTO:
- Backend: Express + TypeScript
- ORM: Prisma
- Base de datos: PostgreSQL
- Autenticación: JWT
- Almacenamiento de archivos: BLOB en base de datos

REQUISITOS FUNCIONALES:
1. **Sistema de autenticación** con JWT
2. **CRUD completo de candidatos**
3. **Carga y gestión de archivos CV**
4. **Validación de datos** en el servidor
5. **Manejo de errores** y respuestas consistentes
6. **Documentación API** con Swagger

ESTRUCTURA DE CARPETAS A CREAR:
backend/src/
├── controllers/
│ ├── authController.ts
│ └── candidateController.ts
├── middleware/
│ ├── auth.ts
│ ├── validation.ts
│ └── errorHandler.ts
├── routes/
│ ├── auth.ts
│ └── candidates.ts
├── services/
│ ├── authService.ts
│ ├── candidateService.ts
│ └── fileService.ts
├── types/
│ ├── candidate.ts
│ └── auth.ts
├── utils/
│ ├── validation.ts
│ ├── constants.ts
│ └── helpers.ts
├── config/
│ └── database.ts
└── index.ts

TAREAS ESPECÍFICAS:

1. **Actualizar esquema de Prisma**:
   ```prisma
   model User {
     id       Int      @id @default(autoincrement())
     username String   @unique
     password String
     email    String   @unique
     role     String   @default("recruiter")
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }

   model Candidate {
     id        Int      @id @default(autoincrement())
     firstName String
     lastName  String
     email     String   @unique
     phone     String
     address   String
     cvFile    Bytes?
     cvFileName String?
     cvFileType String?
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     education  Education[]
     experience Experience[]
   }

   model Education {
     id          Int       @id @default(autoincrement())
     candidateId Int
     title       String
     institution String
     year        Int
     level       String
     candidate   Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
   }

   model Experience {
     id          Int       @id @default(autoincrement())
     candidateId Int
     company     String
     position    String
     startDate   DateTime
     endDate     DateTime?
     description String
     candidate   Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
   }
   ```

2. **Implementar autenticación JWT**:
   - Endpoints: POST /auth/login, POST /auth/register
   - Middleware de autenticación
   - Hash de contraseñas con bcrypt
   - Generación y validación de tokens

3. **Crear controladores para candidatos**:
   - GET /candidates - Listar candidatos
   - POST /candidates - Crear candidato
   - GET /candidates/:id - Obtener candidato
   - PUT /candidates/:id - Actualizar candidato
   - DELETE /candidates/:id - Eliminar candidato
   - POST /candidates/:id/cv - Subir CV

4. **Implementar validación**:
   - Middleware de validación con express-validator
   - Schemas para cada endpoint
   - Validación de archivos (tipo, tamaño)

5. **Manejo de archivos**:
   - Carga de archivos con multer
   - Almacenamiento como BLOB en PostgreSQL
   - Validación de tipos de archivo (PDF, DOCX)
   - Límite de tamaño (ej: 10MB)

6. **Configurar middleware**:
   - CORS
   - Body parser
   - Error handling global
   - Logging

7. **Documentación API**:
   - Swagger/OpenAPI
   - Endpoints documentados
   - Ejemplos de requests/responses

DEPENDENCIAS A INSTALAR:
```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "express-validator": "^7.0.0",
  "multer": "^1.4.5-lts.1",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.0.0"
}
```

CARACTERÍSTICAS TÉCNICAS:
- Arquitectura MVC con separación de responsabilidades
- Validación robusta en servidor
- Manejo de errores consistente
- Seguridad: helmet, rate limiting, CORS
- Logging de operaciones importantes
- Transacciones de base de datos para operaciones complejas

ENTREGABLES:
1. Código completo del backend con estructura modular
2. Esquema de base de datos actualizado
3. API RESTful documentada
4. Sistema de autenticación funcional
5. Manejo de archivos implementado
6. Tests básicos para endpoints críticos

¿Puedes implementar este backend siguiendo estas especificaciones?
```
