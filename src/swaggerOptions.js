// swaggerOptions.js
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'API for managing books and users',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Swagger hosting config
        description: 'Local server',
      },
    ],
  },
  apis: ['**/*.ts'], 
};

module.exports = options;
