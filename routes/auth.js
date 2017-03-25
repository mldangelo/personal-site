import 'dotenv/config';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';

import User from '../models/User';

const port = process.env.PORT || 7999;

const hostname = process.env.HOSTNAME || `http://localhost:${port}`;

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${hostname}/login/google/return`,
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scope: ['email'],
  }, (token, tokenSecret, profile, done) => {
      // update the user if s/he exists or add a new user
    User.findOneAndUpdate({
      email: profile._json.email,
    }, Object.assign({}, profile._json, { updatedAt: Date.now() }), {
      upsert: true,
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  },
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

export default passport;
