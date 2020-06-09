const express = require("express");
const axios = require("axios");
const router = express.Router();

const Book = require("../models/Books");
const UserBook = require("../models/UserBooks");

const CurrentBook = require("../models/CurrentBooks");
const PastBook = require("../models/PastBooks");
const FutureBook = require("../models/FutureBooks");

const authenticateToken = require("../validation/authenticateToken");

router.get("/add", authenticateToken, async (req, res) => {
  const title = req.query.title;
  const author = req.query.author;
  const shelf = req.query.shelf;
  const newTitle = title.split(" ").join("+");
  const newAuthor = author.split(" ").join("+");

  const searchTerms = `${newTitle}+intitle:${newTitle}+inauthor:${newAuthor}`;
  const googleBooksApiUrl = process.env.GOOGLE_BOOKS_VOLUME_BASE_API;

  const bookApiResponse = await axios.get(googleBooksApiUrl, {
    params: { q: searchTerms, key: process.env.GOOGLE_BOOKS_API_KEY },
  });
  if (!bookApiResponse.status === 200) {
    // Throw an error that the request failed
  }
  const items = bookApiResponse.data.items;
  const newItems = items.filter((item) => {
    return item.volumeInfo.title.toUpperCase() === title.toUpperCase();
  });
  if (!newItems.length) {
    // Throw an error that there were no matches
  }
  const finalItem = newItems[0];
  const email = req.user.email;
  const finalTitle = finalItem.volumeInfo.title;
  const finalAuthors = finalItem.volumeInfo.authors;
  const industryIdentifiers = finalItem.volumeInfo.industryIdentifiers;
  const filteredIsbn = industryIdentifiers.filter((identifer) => {
    return identifer.type === "ISBN_13";
  });
  const finalIsbn = filteredIsbn[0].identifier;
  const finalImageLink = finalItem.volumeInfo.imageLinks.thumbnail
    ? finalItem.volumeInfo.imageLinks.thumbnail
    : finalItem.volumeInfo.imageLinks.smallThumbnail;

  // Add to the book database, and then aslo add by user
  const foundBook = await Book.findOne({ isbn: finalIsbn });
  if (!foundBook) {
    const newBook = new Book({
      title: finalTitle,
      authors: finalAuthors,
      isbn: finalIsbn,
      coverImage: finalImageLink,
    });
    await newBook.save();
  }

  const userBook = await UserBook.findOne({ email }); // This has to exist from register
  if (!userBook) {
    // Some crazy error
  }
  const desiredShelf = userBook[shelf];
  if (!desiredShelf.includes(finalIsbn)) {
    desiredShelf.push(finalIsbn);
    await UserBook.updateOne({ email }, { $push: { [shelf]: finalIsbn } });
  }
  return res
    .status(200)
    .json({ msg: "Successful addition of book", success: true });
});

router.get("/getBooks", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const shelf = req.query.shelf;
  const userBooks = await UserBook.findOne({ email });
  const desiredShelf = userBooks[shelf];
  return res.status(200).json({ isbn: desiredShelf });
});

router.get("/getCover", authenticateToken, async (req, res) => {
  const isbn = req.query.isbn;
  const book = await Book.findOne({ isbn });
  if (book) {
    const { title, coverImage } = book;
    return res.status(200).json({ coverImage, title });
  } else {
    return res.status(400).json({ msg: "Book not found", success: false });
  }
});

module.exports = router;
