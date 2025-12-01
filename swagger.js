const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Developers Api',
        description: 'Developers Api'
    },
    host: 'https://cse-341-project2-01q7.onrender.com/',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// This will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

