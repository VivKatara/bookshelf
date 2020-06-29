const express = require("express");
const router = express.Router();

const {
  searchBookDatabase,
  searchGoogleBooksAPI,
  addBookToShelf,
  addBook,
  getBooksOnDisplay,
  getBooksOnShelfPaginated,
  getTotalPages,
  getBookDetails,
  getDisplayOfBook,
  changeDisplayOfBook,
  deleteBookFromShelf,
} = require("../api/endpoints");

const authenticateToken = require("../authentication/authenticateToken");
const extractBookFields = require("../utils/extractBookFields");

router.post("/add", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { title, author, shelf } = req.body;
  let isbn = "";

  // Look in current database for the book
  const searchBook = await searchBookDatabase(title, author);

  if (searchBook.success) {
    isbn = searchBook.isbn;
  } else {
    // Search google books API for the book
    const googleBook = await searchGoogleBooksAPI(title, author);
    console.log(googleBook);
    if (!googleBook.success) {
      return res
        .status(404)
        .json({ msg: "Error! Could not find this particular book." });
    }
    const [
      finalTitle,
      finalAuthors,
      finalDescription,
      finalIsbn,
      finalImageLink,
      matchFound,
    ] = extractBookFields(googleBook.items, title, author);
    // Could not find exact match
    if (!matchFound) {
      return res
        .status(404)
        .json({ msg: "Error! Could not find this particular book." });
    }
    // Add found book to the book database
    await addBook(
      finalTitle,
      finalAuthors,
      finalDescription,
      finalIsbn,
      finalImageLink
    );
    isbn = finalIsbn;
  }

  // Add book to userBook
  // If possible, put a new book on default display
  const display = true;
  const { success, msg } = await addBookToShelf(email, isbn, shelf, display);
  if (!success) {
    return res.status(400).json({ msg });
  } else {
    return res.status(200).json({ msg });
  }
});

// Called to get all the books on display for a given shelf
router.get("/getDisplayBooks", async (req, res) => {
  // const email = req.user.email;
  const { username, shelf } = req.query;
  const displayBooksIsbn = await getBooksOnDisplay(username, shelf);
  return res.status(200).json({ isbn: displayBooksIsbn });
});

// Called to get all the books on a given shelf, paginated
router.get("/getBooks", async (req, res) => {
  const { username, page, pageSize, shelf } = req.query;
  const desiredIsbns = await getBooksOnShelfPaginated(
    username,
    page,
    pageSize,
    shelf
  );
  // This assumes that empty list is not returned
  // If empty list is returned, then there must have been an out of range page number
  return res.status(200).json({ isbn: desiredIsbns });
});

// Get the number of pages a paginated bookshelf has
router.get("/getTotalPages", async (req, res) => {
  const { username, pageSize, shelf } = req.query;
  const totalPages = await getTotalPages(username, pageSize, shelf);
  return res.status(200).json({ totalPages });
});

// Get the details of a given book
router.get("/getBookDetails", async (req, res) => {
  const isbn = req.query.isbn;
  const {
    success,
    title,
    authors,
    description,
    coverImage,
  } = await getBookDetails(isbn);
  if (success) {
    return res.status(200).json({ title, authors, description, coverImage });
  } else {
    return res.status(400).json({ msg: "Book not found" });
  }
});

// Get whether a given book is on display or not
router.get("/getBookDisplay", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { shelf, isbn } = req.query;
  const { success, display } = await getDisplayOfBook(email, shelf, isbn);
  if (!success) {
    return res.status(400).json({
      msg: "Something unexpected occurred. Cannot show display state of book.",
    });
  }
  return res.status(200).json({ display });
});

// Change the display of a given book
router.post("/changeBookDisplay", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { isbn, shelf, desiredDisplay } = req.body;
  const { success, msg } = await changeDisplayOfBook(
    email,
    isbn,
    shelf,
    desiredDisplay
  );
  if (!success) {
    return res.status(400).json({ msg });
  } else {
    return res.status(200).json({ msg });
  }
});

// Delete a book from a given shelf
router.delete("/deleteFromShelf", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { isbn, shelf } = req.query;
  const { success, msg } = await deleteBookFromShelf(email, isbn, shelf);
  if (!success) {
    return res.status(404).json({ msg });
  } else {
    return res.status(200).json({ msg });
  }
});

// Add a book to new shelf
router.post("/addBookToNewShelf", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { isbn, shelf, displayState } = req.body;
  const { success, msg } = await addBookToShelf(
    email,
    isbn,
    shelf,
    displayState
  );
  if (!success) {
    return res.status(400).json({ msg });
  } else {
    return res.status(200).json({ msg });
  }
});

module.exports = router;
