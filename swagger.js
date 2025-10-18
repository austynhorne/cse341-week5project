const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: { title: 'Fly Fishing API', description: 'API for logging fly fishing catches' },
  host: 'localhost:8080',
  schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('swagger.json created');
});
