const passport = require("passport")
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = "701590633897-s9qh400b2vmubcv0611vjl0ns3qn31p5.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const { default: App } = require("../app.ts");
const docRef = App.db.collection('user').doc('users');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});



passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:3000/google/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id, googleEmail: profile.email }, function (err, user) {
      return cb(err, user);
    });
  }
));




if (!user) {
    user = new User({
        name: profile.id,
        email: profile.email,

    });
    user.save(function(err) {
        if (err) console.log(err);
        return done(err, user);
    });
} else {
    //found user. Return
    return done(err, user);
}