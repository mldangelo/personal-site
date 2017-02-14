import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import morgan from 'morgan';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import dotenv from 'dotenv';

import config from './webpack/webpack.config';
import apiRoutes from './routes/api';

dotenv.config(); // TODO: Find a prettier way to do this.

const port = process.env.PORT || 7999;
const env = process.env.NODE_ENV || 'development';

const app = express();

app.use(compress());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));

apiRoutes(app);

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

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('application-err', err);
  }
  console.info(`Started in ${env === 'development' ? env : 'production'} mode on port ${port}.`);
});

export default app;
