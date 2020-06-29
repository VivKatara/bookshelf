import passport from "passport";
import bcrypt from "bcryptjs";
import LocalStrategy from "passport-local";
import UserCollection from "../models/UserCollection";

passport.use(
  new LocalStrategy.Strategy(
    { usernameField: "email", passwordField: "password", session: false },
    function (email: string, password: string, done: any) {
      UserCollection.findOne({ email }, (err, user) => {
        if (err) return done(err); // Unexpected error
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        } else {
          bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
              return done(null, user, { message: "Logged in successfully" });
            } else {
              return done(null, false, { message: "Incorrect password" });
            }
          });
        }
      });
    }
  )
);
