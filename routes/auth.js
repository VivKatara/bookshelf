// When the project gets bigger, ideally this should be moved to its own authentication server
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../models/User");
const UserBooks = require("../models/UserBooks");
// const NewUserBooks = require("../models/NewUserBooks");
const Token = require("../models/Token");

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
      const userBooks = new UserBooks({
        email,
        currentBooks: [],
        pastBooks: [],
        futureBooks: [],
      });
      // const newUserBooks = new NewUserBooks({
      //   email,
      //   currentBooks: [],
      //   currentBooksCount: 0,
      //   currentBooksDisplayCount: 0,
      //   pastBooks: [],
      //   pastBooksCount: 0,
      //   pastBooksDisplayCount: 0,
      //   futureBooks: [],
      //   futureBooksCount: 0,
      //   futureBooksDisplayCount: 0,
      // });

      // Hash the password before saving it in the database
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err; // Should this be a more sophisticated error?
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err; // Should this be a more sophisticated error
          newUser.password = hash;
          newUser
            .save()
            .then(async (savedUser) => {
              await userBooks.save(); // Must I do then and catch here too?
              // await newUserBooks.save();
              return res.status(200).json({
                user: { email: savedUser.email, name: savedUser.fullName },
                msg: "Successful register",
                success: true,
              });
            })
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
      req.logIn(user, (err) => {
        const payload = {
          id: user.id,
          email: user.email,
          name: user.fullName,
        };
        const accessToken = generateAccessToken(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          "1d"
        );
        const refreshToken = generateAccessToken(
          payload,
          process.env.REFRESH_TOKEN_SECRET,
          "7d"
        );
        // Save the refreshToken in database
        // TODO Make this more safe with encryption in case the db were to ever be compromised
        const newRefreshToken = new Token({
          refreshToken,
        });
        newRefreshToken.save();

        // Lifetime is a year, is this too long?
        res.cookie("accessToken", `Bearer ${accessToken}`, {
          maxAge: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
          maxAge: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        return res
          .status(200)
          .json({ msg: "Logged In Successfully", success: true });
      });
    }
  })(req, res);
});

router.get("/token", (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (refreshToken == null) {
    console.log("Attempt to refresh access token without refresh token");
    return res
      .status(401)
      .json({ msg: "Invalid. Please try logging in again.", success: false });
  }
  Token.findOne({ refreshToken }).then((foundToken) => {
    if (foundToken) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            console.log("Error when trying to verify refresh token");
            return res.status(403).json({
              msg: "Invalid. Please try logging in again.",
              success: false,
            });
          }
          // Preserve original user data when recreating access token
          const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
          };
          const accessToken = generateAccessToken(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            "1d"
          );
          // Rewrite the access token
          res.cookie("accessToken", `Bearer ${accessToken}`, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
          return res.sendStatus(200);
        }
      );
    } else {
      console.log("Provided refresh token not in database");
      return res
        .status(403)
        .json({ msg: "Invalid. Please try logging in again.", success: false });
    }
  });
});

// Logout - do we get rid of all browser cookies, and all session data? Must this be checked?
router.delete("/logout", (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  Token.remove({ refreshToken });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  req.logout(); // Is this needed? Check Passport documentation
  return res.status(200).json({ msg: "Successful logout", success: true });
});

function generateAccessToken(payload, secret, expires) {
  return jwt.sign(payload, secret, { expiresIn: expires });
}

module.exports = router;
