import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import routes from "./routes";
require("dotenv").config();
require("./authentication/passport");

const app = express();
const port = 5000;

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
const mongoUrl: string = process.env.MONGODB_URI as string;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected to server"))
  .catch((err: any) => console.log(err)); // TODO: If you don't successfully connect to MongoDB, maybe you should do process.exit()

// Routes
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});

export default app;
