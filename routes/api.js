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


  app.get('/api/github', (req, res) => {
    const data = {
      forks: 21,
      open_issues_count: 10,
      pushed_at: "2016-03-25T17:01:39Z",
      stargazers_count: 171,
      subscribers_count: 18,
      watchers_count:171,
    };
    res.send(JSON.stringify(data));
  })

  // TODO Cache to DB later
  app.get('/api/github2', (req, res) => {
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

        const send = () => {
          res.send(JSON.stringify(data));
        };

        if (err && err.status == 'Unauthorized'){
          authenticate(send()); // retry authentication -- if token expires
        } else {
          send();
        }

    });
  });


};

export default routes;
