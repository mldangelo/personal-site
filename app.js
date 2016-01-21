var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');

/*
app.use('/', function(req, res, next) {
  res.sendfile('public/index.html');
});
*/

app.get('/', function (req, res) {
  res.render('index');
});

app.use(function(err, req, res, next) {
  res.redirect('/');
});


module.exports = app;
