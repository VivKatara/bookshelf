const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
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

app.use(function (req, res, next) {
  const accessCookie = req.cookies["accessToken"];
  const accessToken = accessCookie && accessCookie.split(" ")[1];
  if (accessToken == null) return res.sendStatus(401); // Unauthorized request

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log(user);
    next();
  });
});

// Routes
app.use("/", routes);

app.post("/testCookies", (req, res) => {
  console.log(req.cookies["username"]);
  console.log(req.cookies["password"]);
  res.send("Success");
});

app.get("/setCookies", async (req, res) => {
  res.cookie("username", "john doe", { maxAge: 900000, httpOnly: true });
  res.cookie("password", "yeet", { maxAge: 900000, httpOnly: true });
  return res.send("Success");
});

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
