import path from 'path';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '',
      version: '1.0.0',
      description: "Documentation de l'API avec Swagger",
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../swagger/swaggerDefinitions.ts'),
  ],
};