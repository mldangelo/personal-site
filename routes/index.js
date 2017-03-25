/* eslint-disable global-require */
import 'dotenv/config';
import auth from './auth';
import reactApp from './app';
import { requireUserAPI, requireAdminAPI } from './middleware';


const routes = (app) => {
  const passport = auth(app);

  app.get('/login/google', passport.authenticate('google'));

  app.get('/login/google/return', passport.authenticate('google', {
    failureRedirect: '/login',
  }), (req, res) => {
    res.redirect('/resume'); // the only protected page. this works for now
  });

  app.get('/logout', require('./logout'));

  app.get('/api/github', require('./api/github'));
  app.get('/api/lastfm', require('./api/lastfm'));

  app.get('/api/resume', requireUserAPI, require('./api/resume'));

  app.get('/api/admin', requireAdminAPI, require('./api/admin'));

  reactApp(app); // set up react routes
};

export default routes;
/* eslint-enable global-require */
