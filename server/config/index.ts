import dotenv from "dotenv";
import { Config } from "../interfaces/Config";

const envFound = dotenv.config();

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (envFound.error) {
  // This error should crash the whole process
  throw new Error("Could not find the .env file");
}

const config: Config = {
  port: parseInt(process.env.PORT as string, 10),
  databaseUrl: process.env.MONGODB_URI as string,
  googleBooksApiKey: process.env.GOOGLE_BOOKS_API_KEY as string,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  sessionSecret: process.env.SESSION_SECRET as string,
  googleBooksVolumeApiUrl: process.env.GOOGLE_BOOKS_VOLUME_BASE_API as string,
};

export default config;
