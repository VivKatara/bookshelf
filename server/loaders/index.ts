import expressLoader from "./express";
import mongooseLoader from "./mongoose";

export default async ({ expressApp }: { expressApp: any }) => {
  const mongooseConnection = await mongooseLoader();
  console.log("MongoDB successfully connected to server");

  await expressLoader({ app: expressApp });
};
