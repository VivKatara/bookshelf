const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function (email, password, done) {
      console.log(email);
      console.log(password);
      User.findOne({ email }).then((user) => {
        // Also will need to throw an error here somehow for network errors
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        } else {
          console.log("Found user");
          bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
              console.log("Success");
              return done(null, user, { message: "Logged in successfully" });
            } else {
              console.log("Wrong password");
              return done(null, false, { message: "Incorrect password" });
            }
          });
        }
      });
    }
  )
);
