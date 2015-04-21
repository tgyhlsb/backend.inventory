var fs = require('fs');
var express = require('express.io');
var path = require('path');
var mongoose = require('mongoose');
var config = require('config');
var passport = require('passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var utils = require('./lib/utils');

var app = express();

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
});

// Bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap application settings
require('./config/express')(app, passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
// uncomment if not using Winston
// app.use(logger('dev'));
// uncomment when not using configs of /config/express.js
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Models must be required after models
var routes = require('./routes/index');
var apiRoutes = require('./routes/api');
var rootRoutes = require('./routes/root');

app.use('/', routes);
app.use('/api', apiRoutes);
app.use('/root', rootRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    var errCode = err.code || 400;
    res.status(errCode);
    res.json({
      status: errCode,
      message: err.message,
      errors: utils.errors(err.errors),
      stack: err.stack
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    var errCode = err.code || 400;
    res.status(errCode);
    res.json({
      status: errCode,
      message: err.message,
      errors: utils.errors(err.errors)
    });
});


module.exports = app;
