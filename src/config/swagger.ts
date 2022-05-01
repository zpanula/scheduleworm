import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scheduleworm API',
      version: '1.0.0',
    },
  },
  apis: ['./src/user/*.js'],
};

export default swaggerJsdoc(options);
