import { Router, Request, Response } from "express";
import {
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
} from "../endpoints";
import authenticateToken from "../middleware/authenticateToken";
import extractBookFields from "../../utils/extractBookFields";

const router = Router();

router.post("/add", authenticateToken, async (req: Request, res: Response) => {
  const user: any = req.user;
  const email: any = user.email;
  const {
    title,
    author,
    shelf,
  }: { title: string; author: string; shelf: string } = req.body;
  let isbn: string = "";

  // Look in current database for the book
  const searchBook = await searchBookDatabase(title, author);
  if (searchBook.success) {
    isbn = searchBook.isbn as string;
  } else {
    // Search google books API for the book
    const googleBook = await searchGoogleBooksAPI(title, author);
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
router.get("/getDisplayBooks", async (req: Request, res: Response) => {
  // const email = req.user.email;
  const { username, shelf } = req.query;
  const displayBooksIsbn = await getBooksOnDisplay(
    username as string,
    shelf as string
  );
  return res.status(200).json({ isbn: displayBooksIsbn });
});

// Called to get all the books on a given shelf, paginated
router.get("/getBooks", async (req: Request, res: Response) => {
  const { username, page, pageSize, shelf } = req.query;
  const desiredIsbns = await getBooksOnShelfPaginated(
    username as string,
    page as string,
    pageSize as string,
    shelf as string
  );
  // This assumes that empty list is not returned
  // If empty list is returned, then there must have been an out of range page number
  return res.status(200).json({ isbn: desiredIsbns });
});

// Get the number of pages a paginated bookshelf has
router.get("/getTotalPages", async (req: Request, res: Response) => {
  const { username, pageSize, shelf } = req.query;
  const totalPages = await getTotalPages(
    username as string,
    pageSize as string,
    shelf as string
  );
  return res.status(200).json({ totalPages });
});

// Get the details of a given book
router.get("/getBookDetails", async (req: Request, res: Response) => {
  const isbn = req.query.isbn;
  const {
    success,
    title,
    authors,
    description,
    coverImage,
  } = await getBookDetails(isbn as string);
  if (success) {
    return res.status(200).json({ title, authors, description, coverImage });
  } else {
    return res.status(400).json({ msg: "Book not found" });
  }
});

// Get whether a given book is on display or not
router.get(
  "/getBookDisplay",
  authenticateToken,
  async (req: Request, res: Response) => {
    const user: any = req.user;
    const email: any = user.email;
    const { shelf, isbn } = req.query;
    const { success, display } = await getDisplayOfBook(
      email,
      shelf as string,
      isbn as string
    );
    if (!success) {
      return res.status(400).json({
        msg:
          "Something unexpected occurred. Cannot show display state of book.",
      });
    }
    return res.status(200).json({ display });
  }
);

// Change the display of a given book
router.post(
  "/changeBookDisplay",
  authenticateToken,
  async (req: Request, res: Response) => {
    const user: any = req.user;
    const email: any = user.email;
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
  }
);

// Delete a book from a given shelf
router.delete(
  "/deleteFromShelf",
  authenticateToken,
  async (req: Request, res: Response) => {
    const user: any = req.user;
    const email: any = user.email;
    const { isbn, shelf } = req.query;
    const { success, msg } = await deleteBookFromShelf(
      email,
      isbn as string,
      shelf as string
    );
    if (!success) {
      return res.status(404).json({ msg });
    } else {
      return res.status(200).json({ msg });
    }
  }
);

// Add a book to new shelf
router.post(
  "/addBookToNewShelf",
  authenticateToken,
  async (req: Request, res: Response) => {
    const user: any = req.user;
    const email: any = user.email;
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
  }
);

export default router;
