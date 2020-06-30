import mongoose from "mongoose";
import config from "../config";

export default async (): Promise<any> => {
  const connection = await mongoose.connect(config.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return connection.connection.db; // TODO: Check for error here
};
