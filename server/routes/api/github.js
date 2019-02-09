import 'dotenv/config';
import dayjs from 'dayjs';

import GithubAPI from '@octokit/rest';

import { githubKeys as keys } from '../../../app/data/github';

const { GITHUB_OAUTH } = process.env;

let cached = {};

const github = new GithubAPI({
  auth: `token ${GITHUB_OAUTH}`,
});

const updateCache = (payload) => {
  const data = keys.reduce((obj, key) => ({
    ...obj,
    [key]: payload[key],
  }), {
    updated_at: Date.now(),
  });
  data.pushed_at = dayjs(data.pushed_at).format('MMMM DD, YYYY');
  cached = data;
};

const apiCall = async (req, res) => {
  if (!cached.updated_at || ((Date.now() - cached.updated_at) / 1000 > 60)) {
    const { status, data } = await github.repos.get({
      owner: 'mldangelo',
      repo: 'personal-site',
    });
    if (status === 200) {
      updateCache(data);
    }
  }
  res.send(JSON.stringify(cached));
};

export default apiCall;
