const express = require("express");
const axios = require("axios");
const router = express.Router();

const Book = require("../models/Books");
const UserBooks = require("../models/UserBooks");

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
    return res.status(404).json({ msg: "Could not find book", success: false });
  }

  // Add to the book database
  await addBook(finalTitle, finalAuthors, finalIsbn, finalImageLink);

  // Add book to the user's UserBook document if necessary
  const addedBook = await addUserBook(email, shelf, finalIsbn);

  if (!addedBook.success) {
    return res.status(400).json({ msg: addedBook.msg, success: false });
  } else {
    return res
      .status(200)
      .json({ msg: "Successfully added book to shelf", success: true });
  }
});

router.get("/getDisplayBooks", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const shelf = req.query.shelf;
  const userBooks = await UserBooks.findOne({ email });
  const desiredShelf = userBooks[shelf];
  const displayBooks = desiredShelf.filter((book) => {
    if (book.display) {
      return book;
    }
  });
  const displayBooksIsbn = displayBooks.map((displayBook) => displayBook.isbn);
  return res.status(200).json({ isbn: displayBooksIsbn });
});

router.get("/getBooks", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { shelf } = req.query;
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);
  const userBooks = await UserBooks.findOne({ email });
  const desiredShelf = userBooks[shelf];
  const desiredShelfLength = userBooks[`${shelf}Count`];
  const desiredBooks = paginate(
    desiredShelf,
    desiredShelfLength,
    page,
    pageSize
  );
  const desiredIsbns = desiredBooks.map((book) => book.isbn);
  // This assumes that empty list is not returned
  // If empty list is returned, then there must have been an out of range page number
  return res.status(200).json({ isbn: desiredIsbns });
});

router.get("/getTotalPages", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { shelf, pageSize } = req.query;
  const userBooks = await UserBooks.findOne({ email });
  const desiredShelf = userBooks[shelf];
  const desiredShelfLength = userBooks[`${shelf}Count`];
  const totalPages = Math.ceil(desiredShelfLength / pageSize);
  return res.status(200).json({ totalPages });
});

router.get("/getBookDetails", authenticateToken, async (req, res) => {
  const isbn = req.query.isbn;
  const book = await Book.findOne({ isbn });
  if (book) {
    const { title, authors, coverImage } = book;
    return res.status(200).json({ title, authors, coverImage });
  } else {
    return res.status(400).json({ msg: "Book not found", success: false });
  }
});

router.get("/getBookDisplay", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { shelf, isbn } = req.query;

  const userBooks = await UserBooks.findOne({ email });
  if (!userBooks) {
    return res
      .status(400)
      .json({ msg: "Something unexpected occurred", success: false });
  }
  const desiredShelf = userBooks[shelf];
  const desiredBooks = desiredShelf.filter((book) => book.isbn === isbn);
  if (!desiredBooks.length) {
    return res.status(400).json({
      msg: "Could not find book. Something unexpected occurred",
      success: false,
    });
  }
  const desiredBook = desiredBooks[0];
  return res.status(200).json({ display: desiredBook.display, success: true });
});

module.exports = router;
