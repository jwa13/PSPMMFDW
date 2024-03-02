import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "../firebase.ts";
import keys from "./keys.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
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
