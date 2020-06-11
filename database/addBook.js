const Book = require("../models/Books");

module.exports = async function addBook(title, authors, isbn, coverImage) {
  const foundBook = await Book.findOne({ isbn });
  if (!foundBook) {
    console.log("Not found");
    const newBook = new Book({
      title,
      authors,
      isbn,
      coverImage,
    });
    await newBook.save();
  }
};
