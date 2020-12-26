/* eslint-disable global-require */
import 'dotenv/config';
import passport from 'passport';
import { requireUserAPI, requireAdminAPI } from './middleware';

const routes = (app) => {
  app.get('/login/google', passport.authenticate('google'));
  app.get('/login/google/return', passport.authenticate('google', {
    failureRedirect: '/login',
  }), (req, res) => {
    const target = req.cookies.target || '/';
    res.clearCookie('target', { path: '/' });
    return res.redirect(target);
  });
  app.get('/logout', require('./api/logout'));
  app.get('/api/lastfm', require('./api/lastfm'));
  app.get('/api/resume', requireUserAPI, require('./api/resume'));
  app.get('/api/admin', requireAdminAPI, require('./api/admin'));
};

export default routes;
/* eslint-enable global-require */
