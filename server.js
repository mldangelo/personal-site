import 'dotenv/config';
import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import morgan from 'morgan';
import session from 'express-session';
import store from 'connect-sqlite3';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack/webpack.config';
import routes from './routes';
import models from './models';

const port = process.env.PORT || 7999;
const env = process.env.NODE_ENV || 'development';

const app = express();

const SQLiteStore = store(session);

app.use(compress());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ dir: './db' }),
  secret: 'testestestestestestest',
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week 
}));

// prevents logs from polluting test results
if (!module.parent) app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));

models.sequelize.sync().then(() => {
  app.listen(port);
  app.on('error', (error) => { console.error('error', error); });
  app.on('listening', (info) => { console.info('info', info); });
});


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
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(`${__dirname}`));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
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
