const express = require("express");
const axios = require("axios");
const router = express.Router();

const Book = require("../models/Books");
const UserBook = require("../models/UserBooks");
const NewUserBook = require("../models/NewUserBooks");

const CurrentBook = require("../models/CurrentBooks");
const PastBook = require("../models/PastBooks");
const FutureBook = require("../models/FutureBooks");

const authenticateToken = require("../validation/authenticateToken");
const extractBookFields = require("../utils/extractBookFields");
const paginate = require("../utils/paginate");
const addBook = require("../database/addBook");
const addUserBook = require("../database/addUserBook");

router.get("/add", authenticateToken, async (req, res) => {
  const email = req.user.email;
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
  // Takes in API response and gets the requisite book fields
  const [
    finalTitle,
    finalAuthors,
    finalIsbn,
    finalImageLink,
    matchFound,
  ] = extractBookFields(items, title, author);
  if (!matchFound) {
    // Return an error becasue no match was found on the API
  }

  // Add to the book database
  await addBook(finalTitle, finalAuthors, finalIsbn, finalImageLink);

  // Add book to the user's UserBook document if necessary
  await addUserBook(email, shelf, finalIsbn);

  // const userBook = await UserBook.findOne({ email }); // This has to exist from register
  // if (!userBook) {
  //   // Some crazy error
  // }
  // const desiredShelf = userBook[shelf];
  // if (!desiredShelf.includes(finalIsbn)) {
  //   desiredShelf.push(finalIsbn);
  //   await UserBook.updateOne({ email }, { $push: { [shelf]: finalIsbn } });
  // }
  return res
    .status(200)
    .json({ msg: "Successful addition of book", success: true });
});

router.get("/getDisplayBooks", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const shelf = req.query.shelf;
  const userBooks = await UserBook.findOne({ email });
  const desiredShelf = userBooks[shelf];
  return res.status(200).json({ isbn: desiredShelf });
});

router.get("/getBooks", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { shelf } = req.query;
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);
  const userBooks = await UserBook.findOne({ email });
  const desiredShelf = userBooks[shelf];
  const desiredBooks = paginate(
    desiredShelf,
    desiredShelf.length,
    page,
    pageSize
  );
  // This assumes that empty list is not returned
  // If empty list is returned, then there must have been an out of range page number
  return res.status(200).json({ isbn: desiredBooks });
});

router.get("/getTotalPages", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { shelf, pageSize } = req.query;
  const userBooks = await UserBook.findOne({ email });
  const desiredShelf = userBooks[shelf];
  const totalPages = Math.ceil(desiredShelf.length / pageSize);
  return res.status(200).json({ totalPages });
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
