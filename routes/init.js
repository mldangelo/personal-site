/* eslint-disable global-require */
import 'dotenv/config';

const passport = require('passport');
const Strategy = require('passport-google-oauth20').Strategy;
const port = process.env.PORT || 7999;

passport.use(new Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:${port}/login/google/return`,
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
  scope: ['email'],
},
  (accessToken, refreshToken, profile, cb) =>
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
     cb(null, profile)));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});


const routes = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/login/google',
  passport.authenticate('google', { scope: ['email'] }));

  app.get('/login/google/return', passport.authenticate('google', {
    failureRedirect: '/login' },
  ), (req, res) => {
    console.log(req);
    res.redirect('/');
  });

  app.get('/api/github', require('./api/github'));
  app.get('/api/lastfm', require('./api/lastfm'));
};

export default routes;
/* eslint-enable global-require */
