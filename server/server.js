import 'dotenv/config';

import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import morgan from 'morgan';

import routes from './routes';

const port = process.env.PORT || 7999;
const env = process.env.NODE_ENV || 'development';
const basePath = process.env.BASE_PATH || '/';

const app = express();

app.use(compress());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// prevents logs from polluting test results
if (!module.parent) app.use(morgan('combined'));

app.use(basePath, express.static(path.join(__dirname, '../public')));

routes(app); // initialize routes

if (!module.parent) {
  app.listen(port, '0.0.0.0', (err) => {
    if (err) {
      console.error('application-err', err);
    }
    console.info(`Started in ${env === 'development' ? env : 'production'} mode on port ${port}.`);
  });
}

export default app;
