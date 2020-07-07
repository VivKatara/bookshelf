import BookshelfCollection from "../models/BookshelfCollection";
import { errorNames } from "../errors";

export default class BookshelfService {
  public static addBookToShelf = async (
    username: string,
    isbn: string,
    shelf: string,
    display: boolean
  ): Promise<void> => {
    const bookshelf = await BookshelfCollection.findOne({ username });
    if (!bookshelf) {
      throw new Error(errorNames.SOMETHING_UNEXPECTED_OCCURRED);
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
        { username },
        {
          $push: { [shelf]: { isbn: isbn, display: true } },
          $inc: { [countLabel]: 1, [displayCountLabel]: 1 },
        }
      );
    } else {
      // Set display to false on update
      await BookshelfCollection.updateOne(
        { username },
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

  // public static getTotalPages = async (
  //   username: string,
  //   pageSize: string,
  //   shelf: string
  // ): Promise<number> => {
  //   const bookshelf = await BookshelfCollection.findOne({ username });
  //   if (!bookshelf) {
  //     throw { status: 500, message: "Something unexpected occurred." };
  //   }
  //   const desiredShelf = bookshelf.get(shelf);
  //   const countLabel = `${shelf}Count`;
  //   const desiredShelfCount = bookshelf.get(countLabel);
  //   const totalPages = Math.ceil(desiredShelfCount / parseInt(pageSize));
  //   return totalPages;
  // };

  // public static getDisplayOfBook = async (
  //   email: string,
  //   shelf: string,
  //   isbn: string
  // ): Promise<boolean> => {
  //   const bookshelf = await BookshelfCollection.findOne({ email });
  //   if (!bookshelf) {
  //     throw { status: 500, message: "Something unexpected occurred." };
  //   }
  //   const desiredShelf = bookshelf.get(shelf);
  //   const desiredBooks = desiredShelf.filter((book: any) => book.isbn === isbn);
  //   if (!desiredBooks.length) {
  //     throw {
  //       status: 400,
  //       message:
  //         "Something unexpected occurred. Cannot show display state of book",
  //     };
  //   }
  //   // There should only be one item in the desiredBooks array
  //   const desiredBook = desiredBooks[0];
  //   return desiredBook.display;
  // };

  public static changeDisplayOfBook = async (
    username: string,
    isbn: string,
    shelf: string,
    desiredDisplay: boolean
  ): Promise<void> => {
    const bookshelf = await BookshelfCollection.findOne({ username });
    if (!bookshelf) {
      throw new Error(errorNames.SOMETHING_UNEXPECTED_OCCURRED);
    }

    const displayCountLabel = `${shelf}DisplayCount`;
    const desiredShelf = bookshelf.get(shelf);
    const displayCount = bookshelf.get(displayCountLabel);

    if (desiredDisplay && displayCount >= 6) {
      throw new Error(errorNames.MAIN_DISPLAY_FULL);
    } else if (!desiredDisplay && displayCount <= 0) {
      // This case should enver occur. If it does, it is an error.
      throw new Error(errorNames.NO_BOOKS_TO_TAKE_AWAY);
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
        { username },
        {
          $set: { [shelf]: newBookShelf },
          $inc: { [displayCountLabel]: incrementCount },
        }
      );
    }
  };

  public static deleteBookFromShelf = async (
    username: string,
    isbn: string,
    shelf: string
  ): Promise<void> => {
    const bookshelf = await BookshelfCollection.findOne({ username });
    if (!bookshelf) {
      throw new Error(errorNames.SOMETHING_UNEXPECTED_OCCURRED);
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
      throw new Error(errorNames.COULD_NOT_DELETE_BOOK);
    }

    // Update the db
    await BookshelfCollection.updateOne(
      { username },
      {
        $set: { [shelf]: newShelf },
        $inc: {
          [countLabel]: -1,
          [displayCountLabel]: displayIncrement,
        },
      }
    );
  };

  public static getBookshelf = async (username: string) => {
    return await BookshelfCollection.findOne({ username });
  };

  public static getDisplayBooks = (bookshelfBooks: any) => {
    return bookshelfBooks.filter((book: any) => {
      if (book.display) {
        return book;
      }
    });
  };

  public static paginateBookshelfBooks = (
    bookshelfBooks: any,
    length: any,
    pageNumber: any,
    pageSize: any
  ): any => {
    if ((pageNumber - 1) * pageSize + pageSize <= length) {
      // Check to make sure that it isn't a problem that this returns a shallow copy
      return bookshelfBooks.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize
      );
    } else if ((pageNumber - 1) * pageSize < length) {
      return bookshelfBooks.slice((pageNumber - 1) * pageSize);
    } else {
      // Here the pageNumber must be too high, so we're out of range
      return [];
    }
  };

  public static extractShelfInfo = (
    length: any,
    pageNumber: any,
    pageSize: any
  ) => {
    return {
      totalPages: Math.ceil(length / pageSize),
      hasNextPage: Math.ceil(length / pageSize) > pageNumber,
      hasPreviousPage: pageNumber > 1,
    };
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
