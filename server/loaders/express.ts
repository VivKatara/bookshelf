import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import routes from "../api/routes";
require("../api/middleware/passport");

export default ({ app }: { app: express.Application }) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(cookieParser()); //Do we need this

  app.use(passport.initialize());

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, // For cookies
  };
  app.use(cors(corsOptions));

  // Routes
  app.use("/", routes);

  // TODO: You can define your error handling middleware here
};
