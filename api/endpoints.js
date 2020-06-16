const axios = require("axios");

const Books = require("../models/Books");
const UserBooks = require("../models/UserBooks");

const paginate = require("../utils/paginate");

module.exports = {
  // Searches Book Database for a book by title
  searchBookDatabase: async function (title, author) {
    const book = await Books.findOne({ title });
    if (book) {
      return {
        success: true,
        isbn: book.isbn,
      };
    } else {
      return {
        success: false,
        isbn: null,
      };
    }
  },

  // Searches Google Book Database for book by title and author
  searchGoogleBooksAPI: async function (title, author) {
    const newTitle = title.split(" ").join("+");
    const newAuthor = author.split(" ").join("+");
    const searchTerms = `${newTitle}+intitle:${newTitle}+inauthor:${newAuthor}`;
    const googleBooksApiUrl = process.env.GOOGLE_BOOKS_VOLUME_BASE_API;
    const bookApiResponse = await axios.get(googleBooksApiUrl, {
      params: { q: searchTerms, key: process.env.GOOGLE_BOOKS_API_KEY },
    });
    if (bookApiResponse.status === 200) {
      return {
        success: true,
        items: bookApiResponse.data.items,
      };
    } else {
      return {
        success: false,
        items: [],
      };
    }
  },

  // Searches UserBook database for all books on display for a given shelf
  getBooksOnDisplay: async function (email, shelf) {
    const userBooks = await UserBooks.findOne({ email });
    const desiredShelf = userBooks[shelf];
    const displayBooks = desiredShelf.filter((book) => {
      if (book.display) {
        return book;
      }
    });
    const displayBooksIsbn = displayBooks.map(
      (displayBook) => displayBook.isbn
    );
    return displayBooksIsbn;
  },

  // Adds a book to the Books database
  addBook: async function (title, authors, description, isbn, coverImage) {
    const foundBook = await Books.findOne({ isbn });
    if (!foundBook) {
      const newBook = new Books({
        title,
        authors,
        description,
        isbn,
        coverImage,
      });
      await newBook.save();
    }
  },

  // Add a book to new shelf
  addBookToShelf: async function (email, isbn, shelf, display) {
    const userBooks = await UserBooks.findOne({ email });
    const desiredShelf = userBooks[shelf];
    const desiredShelfCount = `${shelf}Count`;
    const desiredShelfDisplayCount = `${shelf}DisplayCount`;
    const currentDisplayItems = userBooks[desiredShelfDisplayCount];

    // Make sure the book doesn't already exist on the target shelf
    for (let i = 0; i < desiredShelfCount; i++) {
      if (desiredShelf[i].isbn == isbn) {
        return {
          success: false,
          msg: "This book already exists on the target shelf",
        };
      }
    }

    // User wanted to display and successfully can do so
    if (display && currentDisplayItems < 6) {
      await UserBooks.updateOne(
        { email },
        {
          $push: { [shelf]: { isbn: isbn, display: true } },
          $inc: { [desiredShelfCount]: 1, [desiredShelfDisplayCount]: 1 },
        }
      );
      return {
        success: true,
        msg: "Successfully added book to shelf and displayed",
      };
    }

    // User wanted display, but there are too many items to do so
    if (display && currentDisplayItems >= 6) {
      await UserBooks.updateOne(
        { email },
        {
          $push: { [shelf]: { isbn: isbn, display: false } },
          $inc: { [desiredShelfCount]: 1 },
        }
      );
      return {
        success: true,
        msg:
          "Successfully added book to shelf, but could not display it because display is full",
      };
    }

    // User didn't want display anyways, so just added to desired shelf
    await UserBooks.updateOne(
      { email },
      {
        $push: { [shelf]: { isbn: isbn, display: false } },
        $inc: { [desiredShelfCount]: 1 },
      }
    );
    return { success: true, msg: "Successfully added book to shelf" };
  },

  // Gets the books on a user's shelf with pagination
  getBooksOnShelfPaginated: async function (email, page, pageSize, shelf) {
    const currentPage = parseInt(page);
    const currentPageSize = parseInt(pageSize);
    const userBooks = await UserBooks.findOne({ email });
    const desiredShelf = userBooks[shelf];
    const desiredShelfLength = userBooks[`${shelf}Count`];
    const desiredBooks = paginate(
      desiredShelf,
      desiredShelfLength,
      currentPage,
      currentPageSize
    );
    const desiredIsbns = desiredBooks.map((book) => book.isbn);
    return desiredIsbns;
  },

  // Gets the total number of pages for a paginated bookshelf
  getTotalPages: async function (email, pageSize, shelf) {
    const userBooks = await UserBooks.findOne({ email });
    const desiredShelf = userBooks[shelf];
    const desiredShelfLength = userBooks[`${shelf}Count`];
    const totalPages = Math.ceil(desiredShelfLength / pageSize);
    return totalPages;
  },

  // Get the details of a given book
  getBookDetails: async function (isbn) {
    const book = await Books.findOne({ isbn });
    let success = false;
    let title = "";
    let authors = [];
    let descirpiton = "";
    let coverImage = "";
    if (book) {
      success = true;
      title = book.title;
      authors = book.authors;
      description = book.description;
      coverImage = book.coverImage;
    }
    return {
      success,
      title,
      authors,
      description,
      coverImage,
    };
  },

  // Get whether a given book is on display or not
  getDisplayOfBook: async function (email, shelf, isbn) {
    const userBooks = await UserBooks.findOne({ email });
    const desiredShelf = userBooks[shelf];
    const desiredBooks = desiredShelf.filter((book) => book.isbn === isbn);
    if (!desiredBooks.length) {
      return {
        success: false,
        display: false,
      };
    }
    const desiredBook = desiredBooks[0];
    return {
      success: true,
      display: desiredBook.display,
    };
  },

  // Change the display of a given book
  changeDisplayOfBook: async function (email, isbn, shelf, desiredDisplay) {
    const userBooks = await UserBooks.findOne({ email });
    const displayKey = `${shelf}DisplayCount`;
    const desiredShelf = userBooks[shelf];
    const displayCount = userBooks[displayKey];
    if (desiredDisplay && displayCount >= 6) {
      return {
        success: false,
        msg:
          "There are already 6 books on your main display. Please take one off before updating this book",
      };
    }
    if (!desiredDisplay && displayCount <= 0) {
      return {
        success: false,
        msg:
          "There are no books to take away from the main shelf! This won't work",
      };
    }
    const incrementCount = desiredDisplay ? 1 : -1;
    // Must be a valid display change request
    const newBookShelf = desiredShelf.map((book) => {
      if (book.isbn === isbn) {
        book.display = desiredDisplay;
      }
      return book;
    });
    await UserBooks.updateOne(
      { email },
      {
        $set: { [shelf]: newBookShelf },
        $inc: { [displayKey]: incrementCount },
      }
    );
    return { success: true, msg: "Successfully changed display" };
  },

  // Delete a book from a given shelf
  deleteBookFromShelf: async function (email, isbn, shelf) {
    const userBooks = await UserBooks.findOne({ email });
    const desiredShelf = userBooks[shelf];
    const desiredShelfCount = `${shelf}Count`;
    const desiredShelfDisplayCount = `${shelf}DisplayCount`;

    // Figure out if the book we're deleting is displayed or not
    let displayIncrement = 0;
    const newShelf = desiredShelf.filter((book) => {
      if (book.isbn !== isbn) {
        return book;
      } else {
        if (book.display === true) {
          displayIncrement = -1;
        }
      }
    });

    // This essentially means that we could not find the book to be deleted
    if (newShelf.length === desiredShelf.length) {
      return { success: false, msg: "Could not find book to be deleted" };
    }

    // Update the db
    await UserBooks.updateOne(
      { email },
      {
        $set: { [shelf]: newShelf },
        $inc: {
          [desiredShelfCount]: -1,
          [desiredShelfDisplayCount]: displayIncrement,
        },
      }
    );
    return { success: true, msg: "Successfully removed book from shelf" };
  },
};
