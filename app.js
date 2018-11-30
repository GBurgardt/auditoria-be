var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var matricesRouter = require('./routes/matrices');
var configRest = require('./constants/configRest');

var app = express();

var cors = require('cors')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuracion CORS
app.use(cors())

////////////////////////////
/////// Web services ///////
////////////////////////////

app.use(`/v${configRest.currentVersion}/`, indexRouter);
app.use(`/v${configRest.currentVersion}/matrices`, matricesRouter);

module.exports = app;
