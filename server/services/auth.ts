import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import UserCollection from "../models/UserCollection";
import BookshelfCollection from "../models/BookshelfCollection";
import TokenCollection from "../models/TokenCollection";
import { errorNames } from "../errors";

export default class AuthService {
  public static SignUp = async (
    email: string,
    fullName: string,
    password: string
  ): Promise<any> => {
    const user = await UserCollection.findOne({ email });
    if (user) throw new Error(errorNames.USER_ALREADY_EXISTS);

    const username = await AuthService.createUsername(fullName);
    const newUser = new UserCollection({ email, fullName, username, password });

    const newBookshelf = new BookshelfCollection({
      username,
      currentBooks: [],
      currentBooksCount: 0,
      currentBooksDisplayCount: 0,
      pastBooks: [],
      pastBooksCount: 0,
      pastBooksDisplayCount: 0,
      futureBooks: [],
      futureBooksCount: 0,
      futureBooksDisplayCount: 0,
    });

    // TODO: Should we be saving the salt in the User collection as well?
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;

    const savedUser = await newUser.save();
    await newBookshelf.save();

    return savedUser;
  };

  public static SignIn = async (
    email: string,
    password: string
  ): Promise<[string, string]> => {
    const user = await UserCollection.findOne({ email });
    if (!user) throw { status: 401, message: "Incorrect username" };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { status: 401, message: "Incorrect password" };

    const accessToken = AuthService.createAccessToken(user);
    const refreshToken = AuthService.createRefreshToken(user);

    const newRefreshToken = new TokenCollection({ refreshToken });
    await newRefreshToken.save(); // TODO: Refresh token should be stored with userid so that you know who owns the refresh token

    console.log("ASSIGNED REFRESH");
    console.log(refreshToken);
    return [accessToken, refreshToken];
  };

  public static RefreshAccessToken = async (
    refreshToken: any
  ): Promise<any> => {
    if (!refreshToken || refreshToken === "") return null;

    const foundToken = await TokenCollection.findOne({ refreshToken });
    if (!foundToken) return null;

    let user;

    try {
      user = jwt.verify(refreshToken, config.refreshTokenSecret);
    } catch (err) {
      return null;
    }

    const accessToken = AuthService.createAccessToken(user);
    return accessToken;
  };

  public static SignOut = async (refreshToken: any): Promise<void> => {
    await TokenCollection.deleteOne({ refreshToken });
    return;
  };

  private static createAccessToken = (user: any) => {
    const payload = {
      id: user.id, //TODO: I think we only need ID in payload
      email: user.email,
      fullName: user.fullName,
      username: user.username,
    };
    return jwt.sign(payload, config.accessTokenSecret, { expiresIn: "5s" });
  };

  private static createRefreshToken = (user: any) => {
    const payload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
    };
    return jwt.sign(payload, config.refreshTokenSecret, { expiresIn: "5s" });
  };

  private static createUsername = async (fullName: string): Promise<string> => {
    let username = fullName.toLowerCase().split(" ").join("");
    let user = await UserCollection.findOne({ username });
    if (!user) return username;

    while (user) {
      username =
        fullName.toLowerCase().split(" ").join("-") +
        "-" +
        crypto.randomBytes(4).toString("hex");
      user = await UserCollection.findOne({ username });
    }
    return username;
  };
}
