import path from 'path';
import debug from 'debug';

import Koa from 'koa';

import helmet from 'koa-helmet';
import logger from 'koa-logger';
import favicon from 'koa-favicon';
import responseTime from 'koa-response-time';


import views from 'koa-views';
import serve from 'koa-static';
import convert from 'koa-convert';
import Router from 'koa-router';

import webpack from 'webpack';

import dotenv from 'dotenv';

dotenv.config();

import compress from 'koa-compress';


const port = process.env.PORT || 7999;
const env = process.env.NODE_ENV || 'development';

const app = new Koa();
const router = Router();

// add header `X-Response-Time`
app.use(convert(responseTime()));
app.use(convert(logger()));

// various security headers
app.use(helmet());

if (env === 'production') {
  // set debug env to `koa` only
  debug.enable('koa');

  // load production middleware
  app.use(convert(require('koa-conditional-get')()));
  app.use(convert(require('koa-etag')()));
  app.use(convert(compress()));
} else if (env === 'development') {
  debug.enable('dev,koa');
  const webpackConfig = require('./webpack.config');
  const compiler = webpack(webpackConfig);
  app.use(convert(require('koa-webpack-dev-middleware')(compiler)));
  app.use(convert(require('koa-webpack-hot-middleware')(compiler)));

  // log when process is blocked
  require('blocked')((ms) => debug('koa')(`blocked for ${ms}ms`));
}
// Set favicon, not sure if I actually need to do this
app.use(convert(favicon(path.join(__dirname, 'public/favicon.ico'))));

// Public Assets
app.use(convert(serve(__dirname + '/public')));

app.use(convert(views(__dirname + '/public/dist', {
  html: 'underscore',
})));
/*
app.use(async (ctx, next) => {
  await ctx.render('index', {});
}); */


router.get('/', function *() {
  yield this.render('index', {});
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => debug('koa')(`Application started on port ${port}`));

// Tell parent process koa-server is started
if (process.send) process.send('online');


export default app;
