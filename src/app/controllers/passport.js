const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const GOOGLE_CLIENT_ID =
  "701590633897-s9qh400b2vmubcv0611vjl0ns3qn31p5.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
import * as App from "../app.ts";
import db from "../firebase.ts";

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  cb(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback",
    },
    async function (accessToken, refreshToken, profile, email, openid, cb) {
      const userRef = db.collection("users").doc(`${profile}`);
      const doc = await userRef.get();
      if (!doc.exists) {
        console.log("No such document!");
        const newUser = {
          profileId: profile.id,
          name: profile.displayName,
          email: profile.emails[0],
        };
        userRef
          .set(newUser)
          .then(() => cb(null, newUser))
          .catch((err) => cb(err));
      } else {
        console.log("Document data:", doc.data());
        cb(null, doc.data());
      }
    }
  )
);

// userRef.get().then((doc) => {
//   if (!doc.exists) {
//     const newUser = {
//       profile: profile.id,
//     };
//     userRef
//       .set(newUser)
//       .then(() => cb(null, newUser))
//       .catch((err) => cb(err));
//   } else {
//     cb(null, doc.data());
//   }
// });
