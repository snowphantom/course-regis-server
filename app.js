var express = require('express');
var config = require('config');
var app = express();
const errorHandler = require('./infrastructure/error-handler');

require('./middleware/initialization').initialize_middleware(app);

const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req, res, next) => {
  res.status(200).send("<center><h1>Course Register System API<h1></center>");
});

app.get('/ping', (req, res, next) => {
  console.log('Someone ping me.');
  res.status(200).send('pong');
});

require('./router')(app);

app.use(errorHandler);

module.exports = app;
