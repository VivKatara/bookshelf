const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const routes = require("./routes");
const passport = require("passport");

require("dotenv").config();
require("./authentication/passport");

app.use(cookieParser()); //Do we need this
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  // You should go through the config here, especially to figure out if session data is being stored in cookie or in other storage
  session({
    secret: process.env.SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // For cookies
};

app.use(cors(corsOptions));

// Connect to DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected to server"))
  .catch((err) => console.log(err));

// Authenticate token middleware - see if you can place this elsewhere
// app.use(function (req, res, next) {
//   const accessCookie = req.cookies["accessToken"];
//   const accessToken = accessCookie && accessCookie.split(" ")[1];
//   if (accessToken == null) {
//     console.log("Attempt to access without access token");
//     return res.status(401).json({ msg: "Forbidden. Please try logging in." });
//   }

//   // Verify the token
//   jwt.verify(
//     accessToken,
//     process.env.ACCESS_TOKEN_SECRET,
//     async (err, user) => {
//       if (err) {
//         console.log("Failed to correctly sign access token");
//         return res.status(403).json({ msg: "Invalid token" });
//       }
//       req.user = user;
//       next();
//     }
//   );
// });

// Routes
app.use("/", routes);

// These are just routes to test cookieParser
app.get("/testCookie", (req, res) => {
  console.log(req.cookies["accessToken"]);
  console.log(req.cookies["refreshToken"]);
  res.status(200).json({ success: true });
});

app.get("/setCookies", async (req, res) => {
  res.cookie("username", "john doe", { maxAge: 900000, httpOnly: true });
  res.cookie("password", "yeet", { maxAge: 900000, httpOnly: true });
  return res.status(200).send("Success");
});

// Ideally this will be route that returns the user to the client when the dashboard component mounts for the first time
app.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("Yes");
  } else {
    console.log("No");
  }
  console.log(req.user);
  res.status(200).send("Success");
});

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
