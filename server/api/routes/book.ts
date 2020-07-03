import { Router, Request, Response, NextFunction } from "express";
import authenticateToken from "../middleware/authenticateToken";
import BookService from "../../services/book";
import BookshelfService from "../../services/bookshelf";

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

      // add to User's Book Shelf
      await BookshelfService.addBookToShelf(email, isbn, shelf, true);

      return res
        .status(200)
        .json({ msg: "Book is on shelf or has been added to it" });
    } catch (err) {
      next(err);
    }
  }
);

// Called to get all the books on display for a given shelf
// router.get(
//   "/getDisplayBooks",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { username, shelf } = req.query;
//       const displayBooksIsbn = await BookshelfService.getBooksOnDisplay(
//         username as string,
//         shelf as string
//       );
//       return res.status(200).json({ isbn: displayBooksIsbn });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// Called to get all the books on a given shelf, paginated
// router.get(
//   "/getBooks",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { username, page, pageSize, shelf } = req.query;
//       const desiredIsbns = await BookshelfService.getBooksOnShelfPaginated(
//         username as string,
//         page as string,
//         pageSize as string,
//         shelf as string
//       );
//       // This assumes that empty list is not returned
//       // If empty list is returned, then there must have been an out of range page number
//       return res.status(200).json({ isbn: desiredIsbns });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// Get the number of pages a paginated bookshelf has
// router.get(
//   "/getTotalPages",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { username, pageSize, shelf } = req.query;
//       const totalPages = await BookshelfService.getTotalPages(
//         username as string,
//         pageSize as string,
//         shelf as string
//       );
//       return res.status(200).json({ totalPages });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// Get the details of a given book
// router.get(
//   "/getBookDetails",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const isbn = req.query.isbn;
//       const {
//         title,
//         authors,
//         description,
//         coverImage,
//       } = await BookService.getBookDetails(isbn as string);
//       return res.status(200).json({ title, authors, description, coverImage });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// Get whether a given book is on display or not
router.get(
  "/getBookDisplay",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = req.user;
      const email: any = user.email;
      const { shelf, isbn } = req.query;
      const display = await BookshelfService.getDisplayOfBook(
        email as string,
        shelf as string,
        isbn as string
      );
      return res.status(200).json({ display });
    } catch (err) {
      next(err);
    }
  }
);

// Change the display of a given book
router.post(
  "/changeBookDisplay",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = req.user;
      const email: any = user.email;
      const { isbn, shelf, desiredDisplay } = req.body;
      await BookshelfService.changeDisplayOfBook(
        email as string,
        isbn as string,
        shelf as string,
        desiredDisplay as boolean
      );
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

// Delete a book from a given shelf
router.delete(
  "/deleteFromShelf",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = req.user;
      const email: any = user.email;
      const { isbn, shelf } = req.query;
      await BookshelfService.deleteBookFromShelf(
        email as string,
        isbn as string,
        shelf as string
      );
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

// Add a book to new shelf
router.post(
  "/addBookToNewShelf",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = req.user;
      const email: any = user.email;
      const { isbn, shelf, displayState } = req.body;
      await BookshelfService.addBookToShelf(email, isbn, shelf, displayState);
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
