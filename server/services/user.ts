import UserCollection from "../models/UserCollection";

export default class UserService {
  public static getUser = async (username: string) => {
    return await UserCollection.findOne({ username });
  };
}
