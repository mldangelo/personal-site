import GitHubApi from 'github';

import dotenv from 'dotenv';
dotenv.config();

const github = new GitHubApi();

github.authenticate({
    type: "oauth",
    token: process.env.GITHUB_OAUTH,
});

const routes = (app) => {

  app.get('/api/github', (req, res) => {
    github.users.get({}, function(err, _res) {
        console.log(err, res);
        res.send(_res);
    });
  });

};

export default routes;
