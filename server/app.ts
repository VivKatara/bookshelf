import express from "express";
import config from "./config";
import loaders from "./loaders";

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });

  const { port } = config;

  app.listen(port, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Server up on port ${port}`);
  });
}

startServer();
