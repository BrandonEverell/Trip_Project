const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const keys = require("../config/keys");
const kx = require('../db/connection')
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.

//passport.serializeUser

//passport.deserializeUser

//


passport.serializeUser((user, done) => {
  done(null, user.id);
});

  passport.deserializeUser((id, done) => {
    kx('users').where({id}).first()
    .then((user) => { done(null, user); })
    .catch((err) => { done(err,null); });
  });



passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, cb) => {
      let user = await kx.first()
                        .from('users')
                        .where({googleID: profile.id})

    if (!user) {
      user = await kx
          .insert({googleID: profile.id})
          .into('users')
    }
     return cb(null, user);
    }
  )
)
passport.use(
  new FacebookStrategy(
    {
      clientID: keys.FACEBOOK_APP_ID,
      clientSecret: keys.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback"
    },
    async (accessToken, refreshToken, profile, cb) => {
      let user = await kx.first()
                        .from('users')
                        .where({facebookID: profile.id})

    if (!user) {
      user = await kx
          .insert({facebookID: profile.id})
          .into('users')
    }
     return cb(null, user);
    }
  )
)
