var express = require('express');
var app = express();
var path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var logger = require('morgan');
app.use(logger('dev'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());
var cors = require('cors')
app.use(cors())

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

////////////////////////////
/////// Web services ///////
////////////////////////////
var configRest = require('./src/constants/configRest');
var indexRouter = require('./src/controllers/indexController');
var matricesRouter = require('./src/controllers/matricesController');
var usuariosRouter = require('./src/controllers/usuariosController');

app.use(`/v${configRest.currentVersion}/`, indexRouter);
app.use(`/v${configRest.currentVersion}/matrices`, matricesRouter);
app.use(`/v${configRest.currentVersion}/usuarios`, usuariosRouter);

module.exports = app;