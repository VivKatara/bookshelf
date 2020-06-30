import crypto from "crypto";
import bcrypt from "bcryptjs";
import UserCollection from "../../models/UserCollection";
import UserBooksCollection from "../../models/UserBooksCollection";
import TokenCollection from "../../models/TokenCollection";

export const SignUp = async (
  email: string,
  fullName: string,
  password: string
): Promise<{ user: { email: string; name: string } }> => {
  const user = await UserCollection.findOne({ email });
  if (user) throw { status: 409, message: "This email already exists" };

  const username = await createUsername(fullName);
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

export const SignOut = async (refreshToken: any): Promise<void> => {
  await TokenCollection.deleteOne({ refreshToken });
  return;
};

const createUsername = async (fullName: string): Promise<string> => {
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
