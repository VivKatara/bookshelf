const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Returns the user object that was serialized and attaches to req.user
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function (email, password, done) {
      User.findOne({ email }, (err, user) => {
        if (err) return done(err);
        // Also will need to throw an error here somehow for network errors
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
