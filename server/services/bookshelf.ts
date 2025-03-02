import BookshelfCollection from "../models/BookshelfCollection";

export default class BookshelfService {
  public static addBookToShelf = async (
    email: string,
    isbn: string,
    shelf: string,
    display: boolean
  ): Promise<void> => {
    const bookshelf = await BookshelfCollection.findOne({ email });
    if (!bookshelf) {
      throw { status: 500, message: "Something unexpected occurred." };
    }
    const desiredShelf = bookshelf.get(shelf);
    const countLabel = `${shelf}Count`;
    const desiredCount = bookshelf.get(countLabel);
    const displayCountLabel = `${shelf}DisplayCount`;
    const desiredDisplayCount = bookshelf.get(displayCountLabel);

    for (let i = 0; i < desiredCount; i++) {
      if (desiredShelf[i].isbn === isbn) {
        // Get out of function, since this book already exists on the user's shelf
        return;
      }
    }

    // Set display to true on update
    if (display && desiredDisplayCount < 6) {
      await BookshelfCollection.updateOne(
        { email },
        {
          $push: { [shelf]: { isbn: isbn, display: true } },
          $inc: { [countLabel]: 1, [displayCountLabel]: 1 },
        }
      );
    } else {
      // Set display to false on update
      await BookshelfCollection.updateOne(
        { email },
        {
          $push: { [shelf]: { isbn: isbn, display: false } },
          $inc: { [countLabel]: 1 },
        }
      );
    }
  };

  public static getBooksOnDisplay = async (
    username: string,
    shelf: string
  ): Promise<Array<string>> => {
    const bookshelf = await BookshelfCollection.findOne({ username });
    if (!bookshelf) {
      throw { status: 500, message: "Something unexpected occurred." };
    }
    const desiredShelf = bookshelf.get(shelf);
    const displayBooks = desiredShelf.filter((book: any) => {
      if (book.display) {
        return book;
      }
    });

    const displayBooksIsbn = displayBooks.map(
      (displayBook: any) => displayBook.isbn
    );

    return displayBooksIsbn;
  };

  public static getBooksOnShelfPaginated = async (
    username: string,
    page: string,
    pageSize: string,
    shelf: string
  ): Promise<Array<string>> => {
    const currentPage = parseInt(page);
    const currentPageSize = parseInt(pageSize);
    const bookshelf = await BookshelfCollection.findOne({ username });
    if (!bookshelf) {
      throw { status: 500, message: "Something unexpected occurred." };
    }
    const desiredShelf = bookshelf.get(shelf);
    const countLabel = `${shelf}Count`;
    const desiredShelfCount = bookshelf.get(countLabel);
    const paginatedDesiredBooks = BookshelfService.paginateBooks(
      desiredShelf,
      desiredShelfCount,
      currentPage,
      currentPageSize
    );
    const desiredIsbns = paginatedDesiredBooks.map((book: any) => book.isbn);
    return desiredIsbns;
  };

  public static getTotalPages = async (
    username: string,
    pageSize: string,
    shelf: string
  ): Promise<number> => {
    const bookshelf = await BookshelfCollection.findOne({ username });
    if (!bookshelf) {
      throw { status: 500, message: "Something unexpected occurred." };
    }
    const desiredShelf = bookshelf.get(shelf);
    const countLabel = `${shelf}Count`;
    const desiredShelfCount = bookshelf.get(countLabel);
    const totalPages = Math.ceil(desiredShelfCount / parseInt(pageSize));
    return totalPages;
  };

  public static getDisplayOfBook = async (
    email: string,
    shelf: string,
    isbn: string
  ): Promise<boolean> => {
    const bookshelf = await BookshelfCollection.findOne({ email });
    if (!bookshelf) {
      throw { status: 500, message: "Something unexpected occurred." };
    }
    const desiredShelf = bookshelf.get(shelf);
    const desiredBooks = desiredShelf.filter((book: any) => book.isbn === isbn);
    if (!desiredBooks.length) {
      throw {
        status: 400,
        message:
          "Something unexpected occurred. Cannot show display state of book",
      };
    }
    // There should only be one item in the desiredBooks array
    const desiredBook = desiredBooks[0];
    return desiredBook.display;
  };

  public static changeDisplayOfBook = async (
    email: string,
    isbn: string,
    shelf: string,
    desiredDisplay: boolean
  ): Promise<void> => {
    const bookshelf = await BookshelfCollection.findOne({ email });
    if (!bookshelf) {
      throw { status: 500, message: "Something unexpected occurred." };
    }
    const displayCountLabel = `${shelf}DisplayCount`;
    const desiredShelf = bookshelf.get(shelf);
    const displayCount = bookshelf.get(displayCountLabel);

    if (desiredDisplay && displayCount >= 6) {
      throw {
        status: 400,
        message:
          "Your main display is full. Please take one book off before placing this on the main display.",
      };
    } else if (!desiredDisplay && displayCount <= 0) {
      // This case should enver occur. If it does, it is an error.
      throw {
        status: 400,
        message:
          "There are no books to take away from the main shelf! This won't work.",
      };
    } else {
      const incrementCount = desiredDisplay ? 1 : -1;
      // Must be a valid display change request
      const newBookShelf = desiredShelf.map(
        (book: { isbn: string; display: boolean }) => {
          if (book.isbn === isbn) {
            book.display = desiredDisplay;
          }
          return book;
        }
      );

      await BookshelfCollection.updateOne(
        { email },
        {
          $set: { [shelf]: newBookShelf },
          $inc: { [displayCountLabel]: incrementCount },
        }
      );
    }
  };

  public static deleteBookFromShelf = async (
    email: string,
    isbn: string,
    shelf: string
  ): Promise<void> => {
    const bookshelf = await BookshelfCollection.findOne({ email });
    if (!bookshelf) {
      throw { status: 500, message: "Something unexpected occurred." };
    }

    const desiredShelf = bookshelf.get(shelf);
    const countLabel = `${shelf}Count`;
    const displayCountLabel = `${shelf}DisplayCount`;

    // Figure out if the book we're deleting is displayed or not
    let displayIncrement = 0;
    const newShelf = desiredShelf.filter(
      (book: { isbn: string; display: boolean }) => {
        if (book.isbn !== isbn) {
          return book;
        } else {
          if (book.display === true) {
            displayIncrement = -1;
          }
        }
      }
    );

    // This essentially means that we could not find the book to be deleted
    if (newShelf.length === desiredShelf.length) {
      throw {
        status: 404,
        message:
          "Could not find book to remove from original shelf. Request unsuccessful.",
      };
    }

    // Update the db
    await BookshelfCollection.updateOne(
      { email },
      {
        $set: { [shelf]: newShelf },
        $inc: {
          [countLabel]: -1,
          [displayCountLabel]: displayIncrement,
        },
      }
    );
  };

  private static paginateBooks = (
    array: Array<{ isbn: string; display: boolean }>,
    length: number,
    pageNumber: number,
    pageSize: number
  ): Array<{ isbn: string; display: boolean }> => {
    if ((pageNumber - 1) * pageSize + pageSize <= length) {
      // Check to make sure that it isn't a problem that this returns a shallow copy
      return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    } else if ((pageNumber - 1) * pageSize < length) {
      return array.slice((pageNumber - 1) * pageSize);
    } else {
      // Here the pageNumber must be too high, so we're out of range
      return [];
    }
  };
}
