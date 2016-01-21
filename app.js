const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('*', (req, res) => {
  res.status(302).redirect('/');
});

app.use((err, req, res, next) => {
  res.redirect('/');
});


module.exports = app;
