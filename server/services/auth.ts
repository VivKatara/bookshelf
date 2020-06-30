import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import UserCollection from "../models/UserCollection";
import UserBooksCollection from "../models/UserBooksCollection";
import TokenCollection from "../models/TokenCollection";

export default class AuthService {
  public static SignUp = async (
    email: string,
    fullName: string,
    password: string
  ): Promise<{ user: { email: string; name: string } }> => {
    const user = await UserCollection.findOne({ email });
    if (user) throw { status: 409, message: "This email already exists" };

    const username = await AuthService.createUsername(fullName);
    const newUser = new UserCollection({ email, fullName, username, password });

    const newUserBook = new UserBooksCollection({
      email,
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
    await newUserBook.save();

    return {
      user: { email: savedUser.email, name: savedUser.fullName },
    };
  };

  public static SignIn = async (
    email: string,
    password: string
  ): Promise<[string, string]> => {
    const user = await UserCollection.findOne({ email });
    if (!user) throw { status: 401, message: "Incorrect username" };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { status: 401, message: "Incorrect password" };
    const payload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
    };

    const accessToken = AuthService.generateAccessToken(
      payload,
      config.accessTokenSecret,
      "1d"
    );
    const refreshToken = AuthService.generateAccessToken(
      payload,
      config.refreshTokenSecret,
      "7d"
    );

    const newRefreshToken = new TokenCollection({ refreshToken });
    await newRefreshToken.save();

    return [accessToken, refreshToken];
  };

  public static RefreshAccessToken = async (
    refreshToken: any
  ): Promise<string> => {
    if (refreshToken === null) {
      throw { status: 401, message: "Invalid. Please try logging in again" };
    }
    const foundToken = await TokenCollection.findOne({ refreshToken });
    if (!foundToken) {
      console.log("Provided refresh token not in database");
      throw { status: 403, message: "Invalid. Please try logging in again" };
    }
    const user: any = await jwt.verify(refreshToken, config.refreshTokenSecret);

    const payload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
    };

    const accessToken = AuthService.generateAccessToken(
      payload,
      config.accessTokenSecret,
      "1d"
    );

    return accessToken;
  };

  public static SignOut = async (refreshToken: any): Promise<void> => {
    await TokenCollection.deleteOne({ refreshToken });
    return;
  };

  private static generateAccessToken = (
    payload: any,
    secret: any,
    expires: any
  ): string => {
    return jwt.sign(payload, secret, { expiresIn: expires });
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
