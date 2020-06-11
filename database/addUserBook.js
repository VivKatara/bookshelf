const NewUserBook = require("../models/NewUserBooks");

module.exports = async function addUserBook(email, shelf, finalIsbn) {
  const mongoShelf = `${shelf}`;
  const mongoCount = `${shelf}Count`;
  const mongoDisplayCount = `${shelf}DisplayCount`;

  let displayBook = false;
  let foundIsbn = false;
  const newUserBook = await NewUserBook.findOne({ email });
  if (!newUserBook) {
    // Return some crazy error here, becasue this should never happen
    return;
  }
  // Search if the book already exists in database
  const desiredShelf = newUserBook[mongoShelf];
  for (let i = 0; i < desiredShelf.length; i++) {
    if (desiredShelf[i].isbn === finalIsbn) {
      foundIsbn = true;
      break;
    }
  }

  if (foundIsbn) {
    // If the book was found, return something that we can pass to the user letting them know so
    return;
  }

  // Book was not found, so now check if there is room on main display shelf
  // Ideally the 6 should be an env variable for how many books can fit on shelf
  if (newUserBook[mongoDisplayCount] < 6) {
    displayBook = true;
  }

  const newObject = { isbn: finalIsbn, display: displayBook };
  if (displayBook) {
    await NewUserBook.updateOne(
      { email },
      {
        $push: { [mongoShelf]: newObject },
        $inc: { [mongoCount]: 1, [mongoDisplayCount]: 1 },
      }
    );
  } else {
    await NewUserBook.updateOne(
      { email },
      { $push: { [mongoShelf]: newObject }, $inc: { [mongoCount]: 1 } }
    );
  }
  // Return a success to let the user know that the book was added
};
