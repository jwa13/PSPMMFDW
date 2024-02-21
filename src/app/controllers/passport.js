const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const GOOGLE_CLIENT_ID =
  "701590633897-s9qh400b2vmubcv0611vjl0ns3qn31p5.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
import * as App from "../app.ts";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback",
    },
    function (profile, cb) {
      const userRef = App.db.collection("users").doc(profile.id);
      userRef.get().then((doc) => {
        if (!doc.exists) {
          const newUser = {
            googleID: profile.id,
            googleEmail: profile.emails[0].value,
          };
          userRef
            .set(newUser)
            .then(() => cb(null, newUser))
            .catch((err) => cb(err));
        } else {
          cb(null, doc.data());
        }
      });
    }
  )
);
