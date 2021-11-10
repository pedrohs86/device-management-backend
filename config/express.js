const express = require('express');
const config = require('config');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var devicesRouter = require('../routes/devices');
var categoriesRouter = require('../routes/categories');


module.exports = () => {
    var app = express();

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    
    app.use('/devices', devicesRouter);
    app.use('/categories', categoriesRouter);

    // SETANDO VARIÁVEIS DA APLICAÇÃO
    app.set('port', process.env.PORT || config.get('server.port'));

  return app;
};