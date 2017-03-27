/* eslint-disable global-require */
import 'dotenv/config';
import auth from '../server/auth';
import reactApp from './views/app';
import { requireUserAPI, requireAdminAPI } from './middleware';


const routes = (app) => {
  const passport = auth(app);

  app.get('/login/google', passport.authenticate('google'));

  app.get('/login/google/return', passport.authenticate('google', {
    failureRedirect: '/login',
  }), (req, res) => {
    res.redirect('/resume'); // the only protected page. this works for now
  });

  app.get('/logout', require('./views/logout'));

  app.get('/api/github', require('./api/github'));
  app.get('/api/lastfm', require('./api/lastfm'));

  app.get('/api/resume', requireUserAPI, require('./api/resume'));

  reactApp(app); // set up react routes
};

export default routes;
/* eslint-enable global-require */
