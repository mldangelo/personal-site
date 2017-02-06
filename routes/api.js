import GitHubApi from 'github';
import moment from 'moment';
import dotenv from 'dotenv';

import { githubKeys as keys } from '../app/data/github';

dotenv.config();

let cached = {};

const github = new GitHubApi();

const authenticate = (cb) => {
  github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_OAUTH,
  });
  if (typeof cb === 'function') cb();
};

const send = (res, _res) => {
  const data = keys.reduce((obj, key) => ({
    ...obj,
    [key]: _res[key],
  }), {});
  data.pushed_at = moment(data.pushed_at).format('MMMM DD, YYYY');
  data.updated_at = Date.now();
  cached = data;
  res.send(JSON.stringify(data));
};

authenticate();

const routes = (app) => {
  app.get('/api/github', (req, res) => {
    if (cached.updated_at && (Date.now() - cached.updated_at) / 1000 < 60) {
      res.send(JSON.stringify(cached));
    } else {
      github.repos.get({
        owner: 'mldangelo',
        repo: 'mldangelo',
      }, (err, _res) => {
        if (err && err.status === 'Unauthorized') {
          console.error('github-api-unauthorized-error', err);
          authenticate(send(res, _res)); // retry authentication -- if token expires
        } else if (err) {
          console.error('github-api-error', err);
          res.send(JSON.stringify(cached)); // keep cached values
        } else {
          send(res, _res);
        }
      });
    }
  });
};

export default routes;
