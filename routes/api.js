import _ from 'lodash';
import GitHubApi from 'github';

import dotenv from 'dotenv';
dotenv.config();

const github = new GitHubApi();

const authenticate = (cb) => {
  github.authenticate({
      type: "oauth",
      token: process.env.GITHUB_OAUTH,
  });
  if (typeof callback === 'function') cb();
};

let authenticated = false;

const routes = (app) => {

  // TODO Cache to DB later
  app.get('/api/github', (req, res) => {

    // Handles authentication for the first time
    if (!authenticated) {
      authenticated = true;
      authenticate();
    }

    github.repos.get({
      user: 'typpo', // TODO Change to this repo
      repo: 'ad-detector',
    }, (err, _res) => {
      if(err) console.log(err);
      const send = () => {
        res.send(JSON.stringify(
          _.pick(_res,
          ['stargazers_count',
          'watchers_count',
          'forks',
          'open_issues_count',
          'subscribers_count',
          'pushed_at',
        ])));
      };

      if (err && err.status == 'Unauthorized'){
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
