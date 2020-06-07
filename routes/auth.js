// When the project gets bigger, ideally this should be moved to its own authentication server
const express = require("express");
const passport = require("passport");
const router = express.Router();

const User = require("../models/User");

const validateLoginInput = require("../validation/login");
const validateRegisterInput = require("../validation/register");

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ msg: errors[Object.keys(errors)[0]], success: false });
  }

  const { email, fullName, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({
        msg: "Email already exists",
        success: false,
      });
    } else {
      // Create the user
      const newUser = new User({
        email,
        fullName,
        password,
      });

      // Hash the password before saving it in the database
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err; // Should this be a more sophisticated error?
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err; // Should this be a more sophisticated error
          newUser.password = hash;
          newUser
            .save()
            .then((savedUser) => res.json(savedUser))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// Login route, you have to add access tokens and refresh tokens to this
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ msg: errors[Object.keys(errors)[0]], success: false });
  }
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ msg: "Something unexpected happened", success: false });
    } else if (!user) {
      console.log(info.message);
      return res.status(401).json({ msg: info.message, success: false });
    } else {
      req.login(user, (err) => {
        //TODO Generate and return access tokens
        console.log(req.session.passport.user);
        res.status(200).json({ msg: "Logged In Successfully", success: true });
      });
    }
  })(req, res);
});

// Logout - do we get rid of all browser cookies, and all session data? Must this be checked?
router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ msg: "Successful logout", success: true });
});

module.exports = router;
