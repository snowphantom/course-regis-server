var express = require('express');
var config = require('config');
var app = express();

require('./middleware/initialization').initialize_middleware(app);

app.get('/', (req, res, next) => {
  res.status(200).send("<center><h1>Course Register System API<h1></center>");
});

app.get('/ping', (req, res, next) => {
  console.log('Someone ping me.');
  res.status(200).send('pong');
});

require('./router')(app);

module.exports = app;
