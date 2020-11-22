const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

exports.initialize_middleware = (app) => {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(bodyParser.json({extended: true}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(function(req, res, next) {

        res.setHeader('Access-Control-Allow-Origin', '*');

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');

        res.setHeader('Access-Control-Allow-Cerdentials', false);

        next();
    });
};