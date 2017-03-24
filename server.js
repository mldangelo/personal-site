import 'dotenv/config';
import path from 'path';
import fs from 'fs';

import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack/webpack.config';
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
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mldangelo');


// prevents logs from polluting test results
// if (!module.parent) app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

if (env === 'development') { // eslint-disable-line eqeqeq
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));


  app.get('/*', (req, res) => {
    const key = '<div id="root"></div>';
    const content = middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html'));
    const index = content.indexOf(key) + key.length;
    const inject = req.user ? `<script type="text/javascript">window.id="${req.user._id}";</script>` : '';
    res.send(content.slice(0, index) + inject + content.slice(index));
  });
  
} else {

  app.use(express.static(`${__dirname}`));

  const content = fs.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf8');
  const key = '<div id="root"></div>';
  const index = content.indexOf(key) + key.length;

  app.get('/*', (req, res) => {
    const inject = req.user ? `<script type="text/javascript">window.id="${req.user._id}";</script>` : '';
    res.send(content.slice(0, index) + inject + content.slice(index));
  });
}

if (!module.parent) {
  app.listen(port, '0.0.0.0', (err) => {
    if (err) {
      console.error('application-err', err);
    }
    console.info(`Started in ${env === 'development' ? env : 'production'} mode on port ${port}.`);
  });
}

export default app;
