import 'dotenv/config';

import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import mongoose from 'mongoose';

import routes from './routes';

const port = process.env.PORT || 7999;
const env = process.env.NODE_ENV || 'development';

const passport = require('passport');
const session = require('express-session');


const app = express();

app.use(compress());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost/mldangelo');

// prevents logs from polluting test results
if (!module.parent) app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'public')));

routes(app);

if (!module.parent) {
  app.listen(port, '0.0.0.0', (err) => {
    if (err) {
      console.error('application-err', err);
    }
    console.info(`Started in ${env === 'development' ? env : 'production'} mode on port ${port}.`);
  });
}

export default app;
