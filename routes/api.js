import 'dotenv/config';
import moment from 'moment';

import GithubAPI from 'github';
import LastfmAPI from 'last.fm.api';

import { githubKeys as keys } from '../app/data/github';

const cached = {};

const lastfm = new LastfmAPI({
  apiKey: process.env.LASTFM_KEY,
});

const github = new GithubAPI();

const authenticateGH = (cb) => {
  github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_OAUTH,
  });
  if (typeof cb === 'function') cb();
};

authenticateGH();

const routes = (app) => {
  app.get('/api/github', (req, res) => {
    const send = (payload) => {
      const data = keys.reduce((obj, key) => ({
        ...obj,
        [key]: payload[key],
      }), {});
      data.pushed_at = moment(data.pushed_at).format('MMMM DD, YYYY');
      data.updated_at = Date.now();
      cached.github = data;
      res.send(JSON.stringify(data));
    };

    if (cached.github && cached.github.updated_at &&
      ((Date.now() - cached.github.updated_at) / 1000 < 60)) {
      res.send(JSON.stringify(cached.github));
    } else {
      github.repos.get({
        owner: 'mldangelo',
        repo: 'mldangelo',
      }, (err, payload) => {
        if (err && err.status === 'Unauthorized') {
          console.error('github-api-unauthorized-error', err);
          authenticateGH(send(payload)); // retry authentication -- if token expires
        } else if (err) {
          console.error('github-api-error', err);
          res.send(JSON.stringify(cached.github)); // keep cached values
        } else {
          send(payload);
        }
      });
    }
  });

  app.get('/api/lastfm', (req, res) => {
    if (cached.lastfm && cached.lastfm.updated_at &&
      ((Date.now() - cached.lastfm.updated_at) / 1000 < 60)) {
      res.send(JSON.stringify(cached.lastfm.artists));
    } else {
      lastfm.user.getTopArtists({
        user: process.env.LASTFM_USERNAME,
        period: '12month',
      })
      .then((payload) => {
        const data = {
          artists: payload.topartists.artist.map(artist => ({
            name: artist.name,
            link: artist.url,
            image: artist.image[2]['#text'],
          })),
          updated_at: Date.now(),
        };
        cached.lastfm = data;
        res.send(JSON.stringify(data.artists));
      })
      .catch((err) => {
        console.error('lastfm-api-error', err);
        res.send(cached.lastfm.artists);
      });
    }
  });
};

export default routes;
