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

authenticate();

const routes = (app) => {
  // TODO Cache to DB later
  app.get('/api/github', (req, res) => {
    github.repos.get({
      user: 'typpo',
      repo: 'ad-detector',
    }, function(err, _res) {
      if(err) console.log(err);
        const data = _.pick(_res,
          ['stargazers_count',
          'watchers_count',
          'forks',
          'open_issues_count',
          'subscribers_count',
          'pushed_at',
        ]);

        if (err && err.status == 'Unauthorized'){
          authenticate(() => { // retry authentication -- if token expires
            res.send(data);
          });
        } else {
          res.send(data);
        }

    });
  });


};

export default routes;
