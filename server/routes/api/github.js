import 'dotenv/config';
import dayjs from 'dayjs';

import GithubAPI from '@octokit/rest';

import { githubKeys as keys } from '../../../app/data/github';

let cached = {};

const github = new GithubAPI({
  auth: `token ${process.env.GITHUB_OAUTH}`,
});

const apiCall = async (req, res) => {
  const send = (payload) => {
    const data = keys.reduce((obj, key) => ({
      ...obj,
      [key]: payload[key],
    }), {});
    data.pushed_at = dayjs(data.pushed_at).format('MMMM DD, YYYY');
    data.updated_at = Date.now();
    cached = data;
    res.send(JSON.stringify(data));
  };

  if (cached.updated_at
    && ((Date.now() - cached.updated_at) / 1000 < 60)) {
    res.send(JSON.stringify(cached));
  } else {
    const { data } = await github.repos.get({
      owner: 'mldangelo',
      repo: 'personal-site',
    });
    if (!data) {
      console.error('github-api-error');
      res.send(JSON.stringify(cached)); // keep cached values
    } else {
      send(data);
    }
  }
};

export default apiCall;
