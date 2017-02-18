import 'dotenv/config';
import moment from 'moment';

import LastfmAPI from 'last.fm.api';

const cached = {};

const lastfm = new LastfmAPI({
  apiKey: process.env.LASTFM_KEY,
});


const routes = (app) => {
  app.get('/api/github', require('./api/github'));

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
