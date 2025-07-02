import swaggerJsdoc from 'swagger-jsdoc';
import { API_BASE_PATH } from '../utils/constants';

const port = process.env.PORT || 3010;

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ATS API - Sistema de Gestión de Candidatos',
      version: '1.0.0',
      description: 'API RESTful para el sistema de gestión de candidatos (ATS)',
      contact: {
        name: 'API Support',
        email: 'support@ats.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${port}${API_BASE_PATH}`,
        description: 'Development server'
      },
      {
        url: `https://api.ats.com${API_BASE_PATH}`,
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtenido al autenticarse'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'recruiter'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Candidate: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            cvFileName: { type: 'string' },
            cvFileType: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Education: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            candidateId: { type: 'integer' },
            title: { type: 'string' },
            institution: { type: 'string' },
            year: { type: 'integer' },
            level: { type: 'string' }
          }
        },
        Experience: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            candidateId: { type: 'integer' },
            company: { type: 'string' },
            position: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            description: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            path: { type: 'string' },
            method: { type: 'string' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación'
      },
      {
        name: 'Candidates',
        description: 'Gestión de candidatos'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/index.ts']
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions); 