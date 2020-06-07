const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const validateLoginInput = require("./validation/login");
const validateRegisterInput = require("./validation/register");

// Load the User Schema
const User = require("./models/User");

const app = express();
// const port = process.env.AUTH_PORT || 4000;
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000", //There will be a different origin for production so keep that in mind
  credentials: true,
};

app.use(cors(corsOptions));

// Connect to DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected to authServer"))
  .catch((err) => console.log(err));

// Don't do this in production. Store your refresh tokens in a database or Redis Cache
// Note that this isn't good for production because every time your server restarts, this will be emptied out
// TODO
let refreshTokens = [];

// For creating a new token based on refreshToken
app.get("/token", (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (refreshToken == null) {
    console.log("Attempt to refresh access token without refresh token");
    return res
      .status(401)
      .json({ msg: "Invalid. Please try logging in again" });
  }
  if (!refreshTokens.includes(refreshToken)) {
    console.log("Provided refresh token not in database");
    return res
      .status(403)
      .json({ msg: "Invalid. Please try logging in again." });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("Error when trying to verify refresh token");
      return res
        .status(403)
        .json({ msg: "Invalid. Please try logging in again." });
    }
    // Preserve original user data when recreating access token
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    // Rewrite the access token
    res.cookie("accessToken", `Bearer ${accessToken}`, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.sendStatus(200);
  });
});

// TODO
// Also clear cookies here
app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  return res.sendStatus(204);
});

app.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, fullName, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists",
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
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
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

app.post("/login", (req, res) => {
  // Authenticate user
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            email: user.email,
            name: user.fullName,
          };
          // Sign token
          const accessToken = generateAccessToken(payload);
          const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET
          );
          refreshTokens.push(refreshToken); // Store these in a database or Redis Cache
          res.cookie("accessToken", `Bearer ${accessToken}`, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
          res.cookie("refreshToken", refreshToken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
          return res.status(200).json({ success: true });
        } else {
          res.status(400).json({ passwordIncorrect: "Password is incorrect" });
        }
      });
    } else {
    }
  });
});

app.get("/", (req, res) => {
  res.json({ text: "Hello authServer" });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
}

app.listen(port, () => {
  console.log(`authServer up on port ${port}`);
});
