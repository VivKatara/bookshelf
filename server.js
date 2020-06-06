const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
require("dotenv").config();

const app = express();
// const port = process.env.PORT || 5000;
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Connect to DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected to server"))
  .catch((err) => console.log(err));

// Cors middleware - eventually, change the localhost to the actual domain of the website
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Routes
app.use("/", routes);

app.get("/testCookies", (req, res) => {
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
