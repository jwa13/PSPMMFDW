import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "../firebase.ts";

// These need to be changed to environment variables
const GOOGLE_CLIENT_ID =
  "949890250152-b3cffqki491rr7nc1s11d27t0of58opl.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/google/callback",
    },
    async function (accessToken, refreshToken, profile, email, openid, cb) {
      const userRef = db.collection("users").doc(`${profile.displayName}`);
      console.log("User Ref working");
      const doc = await userRef.get();
      console.log("Doc working");
      if (!doc.exists) {
        console.log("user does not exist");
        const newUser = {
          profileId: profile.id,
          name: profile.displayName,
          email: profile.emails[0],
        };
        userRef.set(newUser).then(() => {
          console.log("user created");
          cb(null, newUser);
        });
      } else {
        console.log("User already exists.\nDocument data:", doc.data());
        cb(null, doc);
      }
    }
  )
);

passport.serializeUser(function (profile, cb) {
  console.log("Serialized user");
  cb(null, profile.id);
});

passport.deserializeUser(function (id, cb) {
  userRef.where("profileId", "==", id).then((profile) => {
    console.log("deserialized user");
    cb(null, profile);
  });
});
