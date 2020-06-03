const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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
