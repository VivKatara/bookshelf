import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "../api/routes";

export default ({ app }: { app: express.Application }) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(cookieParser()); //Do we need this

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, // For cookies
  };
  app.use(cors(corsOptions));

  // Routes
  app.use("/", routes);

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    return res.status(status).json({ msg: err.message });
  });
};
