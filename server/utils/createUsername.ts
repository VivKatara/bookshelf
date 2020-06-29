import crypto from "crypto";
import UserCollection from "../models/UserCollection";

const createUsername = async (fullName: string): Promise<string> => {
  let username = fullName.toLowerCase().split(" ").join("");
  let user = await UserCollection.findOne({ username });
  if (!user) {
    return username;
  }
  while (user) {
    username =
      fullName.toLowerCase().split(" ").join("-") +
      "-" +
      crypto.randomBytes(4).toString("hex");
    user = await UserCollection.findOne({ username });
  }
  return username;
};

export default createUsername;
