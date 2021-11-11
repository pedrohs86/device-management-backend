const express = require('express');
const config = require('config');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var devicesRouter = require('../routes/devices');
var categoriesRouter = require('../routes/categories');


module.exports = () => {
    var app = express();
    app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      next();
    });


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