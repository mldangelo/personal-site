/* eslint-disable global-require */
import 'dotenv/config';
import passport from 'passport';
import reactApp from './views/app';
import { requireUserAPI, requireAdminAPI } from './middleware';

const routes = (app) => {
  app.get('/login/google', passport.authenticate('google'));

  app.get('/login/google/return', passport.authenticate('google', {
    failureRedirect: '/login',
  }), (req, res) => {
    if (req.user && req.user.isAdmin) {
      return res.redirect('/admin'); // redirect to admin dash for admin accounts
    }
    return res.redirect('/resume'); // the only other protected page. this works for now
  });

  app.get('/logout', require('./views/logout'));

  app.get('/api/github', require('./api/github'));
  app.get('/api/lastfm', require('./api/lastfm'));

  app.get('/api/resume', requireUserAPI, require('./api/resume'));

  app.get('/api/admin', requireAdminAPI, require('./api/admin'));

  reactApp(app); // set up react routes
};

export default routes;
/* eslint-enable global-require */
