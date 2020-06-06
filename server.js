const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const routes = require("./routes");
require("dotenv").config();

const app = express();
// const port = process.env.PORT || 5000;
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

const authenticateToken = require("./validation/authenticateToken");

// Connect to DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected to server"))
  .catch((err) => console.log(err));

// HERE, working on an authenticateToken type middleware (also don't forget to eventually make the tokens HTTP Only)
app.use(function (req, res, next) {
  const accessCookie = req.cookies["accessToken"];
  const accessToken = accessCookie && accessCookie.split(" ")[1];
  // console.log(accessToken);
  if (accessToken == null) return res.sendStatus(401); // Unauthorized request

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, user) => {
      if (err) return res.status(403).json({ success: false });
      // if (err) {
      //   const response = await axios.post("http://localhost:4000/refresh", {
      //     token: req.cookies["refreshToken"],
      //   });
      //   if (response.data.success) {
      //     res.clearCookie("accessToken");
      //     res.cookie("accessToken", response.data.accessToken, {
      //       maxAge: 24 * 60 * 60 * 1000,
      //       httpOnly: false,
      //     });
      //     req.user = response.data.user;
      //     console.log("Successful refresh");
      //     console.log(response.data.accessToken);
      //     next();
      //   } else {
      //     console.log("Somehow made it here instead sad");
      //     return res.status(403).json({ success: false });
      //   }
      // } // Here we must try and use the refresh token!
      req.user = user;
      next();
    }
  );
});

// Routes
app.use("/", routes);

app.get("/testCookies", (req, res) => {
  console.log("HERE");
  // console.log(req.cookies["accessToken"]);
  // console.log(req.cookies["refreshToken"]);
  res.status(200).json({ success: true });
});

app.get("/setCookies", async (req, res) => {
  res.cookie("username", "john doe", { maxAge: 900000, httpOnly: true });
  res.cookie("password", "yeet", { maxAge: 900000, httpOnly: true });
  return res.send("Success");
});

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
