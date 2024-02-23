const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const GOOGLE_CLIENT_ID =
  "949890250152-b3cffqki491rr7nc1s11d27t0of58opl.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
import * as App from "../app.ts";
import db from "../firebase.ts";

passport.serializeUser(function (user, cb) {
  // cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  // cb(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback",
    },
    async function (accessToken, refreshToken, profile, email, openid, cb) {
      const userRef = db.collection("users").doc(`${profile.displayName}`);
      console.log("User Ref working");
      const doc = await userRef.get();
      console.log("Doc working");
      if (!doc.exists) {
        console.log("No such document!");
        const newUser = {
          profileId: profile.id,
          name: profile.displayName,
          email: profile.emails[0],
        };
        userRef.set(newUser);
        // .then(() => cb(null, newUser));
        // .catch((err) => cb(err));
      } else {
        console.log("Document data:", doc.data());
        // cb(null, doc.data());
      }
    }
  )
);
