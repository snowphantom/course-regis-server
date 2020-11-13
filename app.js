var express = require('express');
var app = express();

require('./middleware/initialization').initialize_middleware(app);

app.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

app.get('/ping', (req, res, next) => {
  console.log('Someone ping me.');
  res.status(200).send('pong');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

require('./router')(app);

module.exports = app;
