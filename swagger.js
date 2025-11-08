const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Fly Fishing API',
    description: 'API for logging fly fishing catches',
    version: '1.0.0'
  },
  host: 'localhost:8080',
  schemes: ['http'],

  definitions: {
    Fish: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        species: { type: 'string' },
        river: { type: 'string' },
        weightOz: { type: 'number' },
        lengthIn: { type: 'number' },
        lureUsed: { type: 'string' },
        catchDate: { type: 'string', format: 'date-time' },
        notes: { type: 'string' },
        caughtBy: { type: 'string' }
      },
      required: ['species', 'river', 'weightOz', 'lengthIn', 'lureUsed', 'caughtBy']
    },
    User: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        oauthProvider: { type: 'string' },
        oauthId: { type: 'string' },
        profilePic: { type: 'string' },
        joinDate: { type: 'string', format: 'date-time' },
        favoriteSpecies: { type: 'string' }
      },
      required: ['username', 'email', 'oauthProvider', 'oauthId']
    },
    Error: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/fishRoutes.js', './routes/userRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('swagger.json created');
});
