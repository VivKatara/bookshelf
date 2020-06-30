import { Router, Request, Response, NextFunction } from "express";
import authenticateToken from "../middleware/authenticateToken";
import BookService from "../../services/book";
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
import UserService from "../../services/user";

const router = Router();

router.post(
  "/add",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = req.user;
      const email: any = user.email;
      const {
        title,
        author,
        shelf,
      }: { title: string; author: string; shelf: string } = req.body;

      // add to Book DB
      const isbn = await BookService.addBook(title, author);

      await UserService.addBookToShelf(email, isbn, shelf, true);

      return res
        .status(200)
        .json({ msg: "Book is on shelf or has been added to it" });
    } catch (err) {
      next(err);
    }
  }
);

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
