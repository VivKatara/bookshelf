import UserCollection from "../models/UserCollection";
import UserBooksCollection from "../models/UserBooksCollection";

export default class UserService {
  public static checkUsername = async (username: string): Promise<boolean> => {
    const user = await UserCollection.findOne({ username });
    if (!user) {
      throw { status: 400, message: "Can't find user" };
    }
    return true;
  };

  public static getUserFullName = async (username: string): Promise<string> => {
    const user = await UserCollection.findOne({ username });
    if (!user) {
      throw { status: 400, message: "Can't find user" };
    }
    if (!user.fullName) {
      throw { status: 400, message: "Can't find user's full name" };
    }
    return user.fullName;
  };

  public static addBookToShelf = async (
    email: string,
    isbn: string,
    shelf: string,
    display: boolean
  ): Promise<void> => {
    const userBooks = await UserBooksCollection.findOne({ email });
    if (!userBooks)
      throw { status: 500, message: "Something unexpected occurred." };

    const desiredShelf = userBooks.get(shelf);
    const countLabel = `${shelf}Count`;
    const desiredCount = userBooks.get(countLabel);
    const displayCountLabel = `${shelf}DisplayCount`;
    const desiredDisplayCount = userBooks.get(displayCountLabel);

    for (let i = 0; i < desiredCount; i++) {
      if (desiredShelf[i].isbn === isbn) {
        // Get out of function, since this book already exists on the user's shelf
        return;
      }
    }

    // Set display to true on update
    if (display && desiredDisplayCount < 6) {
      await UserBooksCollection.updateOne(
        { email },
        {
          $push: { [shelf]: { isbn: isbn, display: true } },
          $inc: { [countLabel]: 1, [displayCountLabel]: 1 },
        }
      );
    } else {
      // Set display to false on update
      await UserBooksCollection.updateOne(
        { email },
        {
          $push: { [shelf]: { isbn: isbn, display: false } },
          $inc: { [countLabel]: 1 },
        }
      );
    }
  };
}
