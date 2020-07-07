import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import graphqlHTTP from "express-graphql";
// import schema from "../schema/schema";
import routes from "../api/routes";
import schema from "../graphql";

export default ({ app }: { app: express.Application }) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(cookieParser()); //Do we need this

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, // For cookies
  };
  app.use(cors(corsOptions));

  // GraphQL;
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  );

  // REST Routes
  app.use("/", routes);

  // Error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    return res.status(status).json({ msg: err.message });
  });
};
