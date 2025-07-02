# ATS Backend - Sistema de Gestión de Candidatos

Backend completo para el sistema ATS (Applicant Tracking System) desarrollado con Express, TypeScript, Prisma ORM y PostgreSQL.

## 🚀 Características

- **Autenticación JWT** con roles de usuario
- **CRUD completo de candidatos** con validación robusta
- **Gestión de archivos CV** (PDF, DOCX, DOC) almacenados como BLOB
- **API RESTful** documentada con Swagger
- **Validación de datos** en servidor con express-validator
- **Manejo de errores** consistente y detallado
- **Seguridad** con helmet, CORS, rate limiting
- **Arquitectura modular** con separación de responsabilidades
- **Base de datos** PostgreSQL con Prisma ORM
- **Tests** básicos para endpoints críticos

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar `.env` con tus configuraciones:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ats_database"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3010
   NODE_ENV=development
   ```

4. **Configurar la base de datos**
   ```bash
   # Generar cliente Prisma
   npx prisma generate
   
   # Crear migración inicial
   npx prisma migrate dev --name init
   
   # (Opcional) Ver base de datos con Prisma Studio
   npx prisma studio
   ```

5. **Ejecutar el servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm run build
   npm start
   ```

## 📚 API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Registrar usuario |
| POST | `/api/v1/auth/login` | Iniciar sesión |
| GET | `/api/v1/auth/profile` | Obtener perfil |
| POST | `/api/v1/auth/change-password` | Cambiar contraseña |
| GET | `/api/v1/auth/verify` | Verificar token |

### Candidatos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/candidates` | Listar candidatos |
| POST | `/api/v1/candidates` | Crear candidato |
| GET | `/api/v1/candidates/:id` | Obtener candidato |
| PUT | `/api/v1/candidates/:id` | Actualizar candidato |
| DELETE | `/api/v1/candidates/:id` | Eliminar candidato |
| POST | `/api/v1/candidates/:id/cv` | Subir CV |
| GET | `/api/v1/candidates/:id/cv` | Descargar CV |
| DELETE | `/api/v1/candidates/:id/cv` | Eliminar CV |
| POST | `/api/v1/candidates/:id/education` | Agregar educación |
| POST | `/api/v1/candidates/:id/experience` | Agregar experiencia |

### Utilidades

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api-docs` | Documentación Swagger |

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a endpoints protegidos, incluye el token en el header:

```
Authorization: Bearer <your-jwt-token>
```

### Roles de Usuario

- **admin**: Acceso completo a todas las funcionalidades
- **recruiter**: Acceso a gestión de candidatos

## 📁 Estructura del Proyecto

```
src/
├── controllers/          # Controladores de la API
│   ├── authController.ts
│   └── candidateController.ts
├── middleware/           # Middleware personalizado
│   ├── auth.ts          # Autenticación JWT
│   ├── validation.ts    # Validación de datos
│   └── errorHandler.ts  # Manejo de errores
├── routes/              # Definición de rutas
│   ├── auth.ts
│   └── candidates.ts
├── services/            # Lógica de negocio
│   ├── authService.ts
│   ├── candidateService.ts
│   └── fileService.ts
├── types/               # Tipos TypeScript
│   ├── auth.ts
│   └── candidate.ts
├── utils/               # Utilidades y constantes
│   ├── constants.ts
│   └── helpers.ts
├── config/              # Configuraciones
│   └── database.ts
└── index.ts             # Punto de entrada
```

## 🗄️ Base de Datos

### Modelos Principales

#### User
- `id`: Identificador único
- `username`: Nombre de usuario único
- `email`: Email único
- `password`: Contraseña hasheada
- `role`: Rol del usuario (admin/recruiter)
- `createdAt/updatedAt`: Timestamps

#### Candidate
- `id`: Identificador único
- `firstName/lastName`: Nombre y apellido
- `email`: Email único
- `phone`: Teléfono
- `address`: Dirección
- `cvFile`: Archivo CV como BLOB
- `cvFileName/cvFileType`: Metadatos del archivo
- `createdAt/updatedAt`: Timestamps

#### Education
- `id`: Identificador único
- `candidateId`: Referencia al candidato
- `title`: Título de la educación
- `institution`: Institución educativa
- `year`: Año de finalización
- `level`: Nivel educativo

#### Experience
- `id`: Identificador único
- `candidateId`: Referencia al candidato
- `company`: Empresa
- `position`: Cargo
- `startDate/endDate`: Fechas de inicio y fin
- `description`: Descripción de la experiencia

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con hot reload

# Producción
npm run build           # Compilar TypeScript
npm start              # Ejecutar servidor de producción
npm run start:prod     # Build + start

# Base de datos
npm run prisma:generate # Generar cliente Prisma
npm run prisma:migrate  # Ejecutar migraciones
npm run prisma:studio   # Abrir Prisma Studio

# Testing
npm test               # Ejecutar tests
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests específicos
npm test -- auth.test.ts
```

## 📖 Documentación API

La documentación completa de la API está disponible en:
- **Swagger UI**: `http://localhost:3010/api-docs`
- **OpenAPI JSON**: `http://localhost:3010/api-docs/swagger.json`

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de origen cruzado
- **Rate Limiting**: Límite de solicitudes por IP
- **JWT**: Autenticación basada en tokens
- **bcrypt**: Hash seguro de contraseñas
- **Validación**: Validación robusta de entrada

## 📝 Validaciones

### Usuario
- Username: 3+ caracteres, alfanumérico
- Email: Formato válido
- Password: 8+ caracteres, mayúscula, minúscula, número

### Candidato
- Nombres: 2-50 caracteres, solo letras
- Email: Formato válido, único
- Teléfono: Formato internacional
- Dirección: 10-200 caracteres

### Archivos
- Tipos permitidos: PDF, DOCX, DOC
- Tamaño máximo: 10MB
- Validación de MIME type

## 🚨 Manejo de Errores

El sistema incluye manejo de errores consistente:

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos (solo en desarrollo)",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/endpoint",
  "method": "POST"
}
```

## 🔄 Respuestas Exitosas

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    // Datos de la respuesta
  }
}
```

## 📊 Paginación

Los endpoints de listado soportan paginación:

```
GET /api/v1/candidates?page=1&limit=10&search=nombre
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🚀 Despliegue

### Variables de Entorno de Producción

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
PORT=3010
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3010
CMD ["npm", "start"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Email: support@ats.com
- Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Documentación: `/api-docs`

---

**Desarrollado con ❤️ para el Sistema ATS** 