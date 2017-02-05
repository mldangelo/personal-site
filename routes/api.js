import GitHubApi from 'github';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

const github = new GitHubApi();

const authenticate = (cb) => {
  github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_OAUTH,
  });
  if (typeof callback === 'function') cb();
};

let authenticated = false;

const keys = [
  'stargazers_count',
  'watchers_count',
  'forks',
  'open_issues_count',
  'subscribers_count',
  'pushed_at',
];

const routes = (app) => {
  // TODO Cache to DB later
  app.get('/api/github', (req, res) => {
    // Handles authentication for the first time
    if (!authenticated) {
      authenticated = true;
      authenticate();
    }

    github.repos.get({
      user: 'mldangelo',
      repo: 'mldangelo',
    }, (err, _res) => {
      if (err) {
        console.error('github-api-error', err);
      }
      const send = () => {
        const data = keys.reduce((obj, key) => ({
          ...obj,
          [key]: _res[key],
        }), {});
        data.pushed_at = moment(data.pushed_at).format('MMMM DD, YYYY');
        res.send(JSON.stringify(data));
      };

      if (err && err.status === 'Unauthorized') {
        authenticate(send()); // retry authentication -- if token expires
      } else if (err) {
        res.send(JSON.stringify({})); // keep default values
      } else {
        send();
      }
    });
  });
};

export default routes;
