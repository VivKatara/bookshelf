const UserBooks = require("../models/UserBooks");

module.exports = async function addUserBook(email, shelf, finalIsbn) {
  const mongoShelf = `${shelf}`;
  const mongoCount = `${shelf}Count`;
  const mongoDisplayCount = `${shelf}DisplayCount`;

  let displayBook = false;
  let foundIsbn = false;
  const userBooks = await UserBooks.findOne({ email });
  if (!userBooks) {
    // Return some crazy error here, becasue this should never happen
    return { msg: "Something unexpected occurred", success: false };
  }
  // Search if the book already exists in database
  const desiredShelf = userBooks[mongoShelf];
  for (let i = 0; i < desiredShelf.length; i++) {
    if (desiredShelf[i].isbn === finalIsbn) {
      foundIsbn = true;
      break;
    }
  }

  if (foundIsbn) {
    // If the book was found, return something that we can pass to the user letting them know so
    return { msg: "This book already exists on this shelf!", success: false };
  }

  // Book was not found, so now check if there is room on main display shelf
  // Ideally the 6 should be an env variable for how many books can fit on shelf
  if (userBooks[mongoDisplayCount] < 6) {
    displayBook = true;
  }

  const newObject = { isbn: finalIsbn, display: displayBook };
  if (displayBook) {
    await UserBooks.updateOne(
      { email },
      {
        $push: { [mongoShelf]: newObject },
        $inc: { [mongoCount]: 1, [mongoDisplayCount]: 1 },
      }
    );
  } else {
    await UserBooks.updateOne(
      { email },
      { $push: { [mongoShelf]: newObject }, $inc: { [mongoCount]: 1 } }
    );
  }
  return { msg: "Book successfully added to shelf", success: true };
};
