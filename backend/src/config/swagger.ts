import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Sistema de Gestión de Infracciones de Tránsito',
      version: '1.0.0',
      description:
        'API REST para la gestión de infracciones de tránsito municipal. Permite administrar titulares, vehículos, actas de infracción, pagos y descargos.',
      contact: {
        name: 'UTN - Programación III',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
