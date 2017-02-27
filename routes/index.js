/* eslint-disable global-require */
import 'dotenv/config';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import models from '../models';

const port = process.env.PORT || 7999;

passport.use(new Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:${port}/login/google/return`,
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
  scope: ['email'],
},
  (accessToken, refreshToken, profile, cb) => {
    models.user.findOrCreate({
      where: Object.assign({ token : accessToken }, profile._json),
    }).then((user) => {
      console.log('user.values', user.values);
      cb(null, profile);
    }).catch((err) => {
       console.log('Error occured', err);
    });
  },
));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  models.user.findOne({
    where: {
      id: id
    }
  }).then((user) => {
    console.log('user1', user);
    cb(null, user);
  }).catch((err) => {
     console.log('Error occured', err);
  });
});


const routes = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/login/google', passport.authenticate('google'));

  app.get('/login/google/return', passport.authenticate('google', {
    failureRedirect: '/login' },
  ), (req, res) => {
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
