import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import graphqlHTTP from "express-graphql";
import routes from "../api/routes";
import schema from "../graphql";
import { cookieToHeader, isAuth } from "../middleware/auth";

export default ({ app }: { app: express.Application }) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(cookieParser()); //Do we need this

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, // For cookies
  };
  app.use(cors(corsOptions));

  app.use(cookieToHeader);
  app.use(isAuth);
  // GraphQL;
  app.use(
    "/graphql",
    graphqlHTTP((request, response, graphQLParams) => ({
      schema,
      context: { req: request, res: response },
      graphiql: true,
    }))
  );

  // REST Routes
  app.use("/", routes);

  // Error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    return res.status(status).json({ msg: err.message });
  });
};
