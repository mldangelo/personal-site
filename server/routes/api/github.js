import 'dotenv/config';
import moment from 'moment';

import GithubAPI from 'github';

import { githubKeys as keys } from '../../../app/data/github';

let cached = {};

const github = new GithubAPI();

const authenticateGH = (cb) => {
  github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_OAUTH,
  });
  if (typeof cb === 'function') cb();
};

authenticateGH();

export default (req, res) => {
  const send = (payload) => {
    const data = keys.reduce((obj, key) => ({
      ...obj,
      [key]: payload[key],
    }), {});
    data.pushed_at = moment(data.pushed_at).format('MMMM DD, YYYY');
    data.updated_at = Date.now();
    cached = data;
    res.send(JSON.stringify(data));
  };

  if (cached.updated_at &&
    ((Date.now() - cached.updated_at) / 1000 < 60)) {
    res.send(JSON.stringify(cached));
  } else {
    github.repos.get({
      owner: 'mldangelo',
      repo: 'mldangelo',
    }, (err, payload) => {
      if (err && err.status === 'Unauthorized') {
        console.error('github-api-unauthorized-error', err);
        authenticateGH(send(payload)); // retry authentication -- if token expires
      } else if (err || (payload && !payload.data)) {
        console.error('github-api-error', err);
        res.send(JSON.stringify(cached)); // keep cached values
      } else {
        send(payload.data);
      }
    });
  }
};
