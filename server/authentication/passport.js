const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    function (email, password, done) {
      User.findOne({ email }, (err, user) => {
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
