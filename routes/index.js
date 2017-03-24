/* eslint-disable global-require */
import 'dotenv/config';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import User from '../models/User';
const port = process.env.PORT || 7999;

const isProduction = process.env.NODE_ENV === 'production';

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${isProduction ? 'https://mldangelo.com' : `http://localhost:${port}`}/login/google/return`,
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scope: ['email'],
  }, (token, tokenSecret, profile, done) => {
    // update the user if s/he exists or add a new user
    User.findOneAndUpdate({
      email: profile._json.email
    }, Object.assign({}, profile._json, { updatedAt: Date.now() }), {
      upsert: true
    }, (err, user) => {
      if (err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });
  }

));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


const routes = (app) => {

  app.get('/login/google', passport.authenticate('google'));

  app.get('/login/google/return', passport.authenticate('google', {
    failureRedirect: '/login'
  }, ), (req, res) => {
    console.log('req.user', req.user);
    res.redirect('/');
  });

  // NOTE should also delete token
  app.get('/logout', (req, res) => {
    if (req.user) req.logout();
    res.redirect('/');
  });

  app.get('/api/github', require('./api/github'));
  app.get('/api/lastfm', require('./api/lastfm'));
};

export default routes;
/* eslint-enable global-require */
