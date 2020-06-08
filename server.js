const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const passport = require("passport");

require("dotenv").config();
require("./authentication/passport");

app.use(cookieParser()); //Do we need this
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

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

// Routes
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
