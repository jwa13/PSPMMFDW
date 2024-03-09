import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "../firebase.ts";
import keys from "./keys.js";
var User = "";
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      const userRef = db.collection("users").doc(`${profile._json.email}`);
      console.log("User Ref working");
      const doc = await userRef.get();
      console.log("Doc working");
      if (!doc.exists) {
        console.log("user does not exist");
        User = {
          profileId: profile._json.sub,
          name: profile._json.name,
          email: profile._json.email,
        };
        userRef.set(User).then(() => {
          console.log("user created");
          cb(null, User);
        });
      } else {
        User = doc.data();
        console.log(
          `User already exists.\nDocument data for ${User.name}:`,
          User
        );
        cb(null, User);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  console.log(user);
  process.nextTick(function () {
    return cb(null, {
      id: user.profileId,
      username: user.name,
    });
  });
});

passport.deserializeUser(function (id, cb) {
  process.nextTick(function () {
    console.log(id);
    userRef.where("profileId", "==", id).then((profile) => {
      console.log("deserialized user");
      cb(null, profile);
    });
  });
});
