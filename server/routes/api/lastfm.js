import 'dotenv/config';

import LastfmAPI from 'last.fm.api';

const { LASTFM_KEY, LASTFM_USERNAME } = process.env;

let cached = {};

const lastfm = new LastfmAPI({ apiKey: LASTFM_KEY });

const updateCache = (data) => {
  cached = {
    artists: data.artist.map(artist => ({
      name: artist.name,
      link: artist.url,
      image: artist.image[2]['#text'],
    })),
    updated_at: Date.now(),
  };
};

const lastfmAPI = async (req, res) => {
  if (!cached.updated_at || ((Date.now() - cached.updated_at) / 1000 > 60)) {
    const { topartists: data } = await lastfm.user.getTopArtists({
      user: LASTFM_USERNAME,
      period: '12month',
      limit: 100,
    });
    if (data) {
      updateCache(data);
    }
  }
  res.send(JSON.stringify(cached.artists));
};

export default lastfmAPI;
