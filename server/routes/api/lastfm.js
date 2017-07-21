import 'dotenv/config';

import LastfmAPI from 'last.fm.api';

let cached = {};

const lastfm = new LastfmAPI({
  apiKey: process.env.LASTFM_KEY,
});

export default (req, res) => {
  if (cached.updated_at &&
    ((Date.now() - cached.updated_at) / 1000 < 60)) {
    res.send(JSON.stringify(cached.artists));
  } else {
    lastfm.user.getTopArtists({
      user: process.env.LASTFM_USERNAME,
      period: '12month',
      limit: 50,
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
        cached = data;
        res.send(JSON.stringify(data.artists));
      })
      .catch((err) => {
        console.error('lastfm-api-error', err);
        res.send(cached.artists);
      });
  }
};
