import BookshelfService from "../../services/bookshelf";
import UserService from "../../services/user";
import BookService from "../../services/book";
import AuthService from "../../services/auth";

const resolvers = {
  Query: {
    homepage: async (parent: any, args: any) => {
      const user = await UserService.getUser(args.username);
      if (user) {
        return { ...user._doc, password: null };
      }
      return user;
    },
    fullshelf: async (parent: any, args: any) => {
      const user = await UserService.getUser(args.username);
      if (user) {
        return { ...user._doc, password: null };
      }
      return user;
    },
  },
  Mutation: {
    addUser: async (parent: any, args: any) => {
      const newUser = await AuthService.SignUp(
        args.email,
        args.fullName,
        args.password
      );
      return { ...newUser._doc, password: null };
    },
    addBook: async (parent: any, args: any) => {
      const book = await BookService.addBook(args.title, args.author);
      await BookshelfService.addBookToShelf(
        args.username,
        book.isbn,
        args.shelf,
        true
      );
      return book;
    },
    changeBook: async (parent: any, args: any) => {
      let change = false;
      if (
        args.desiredShelf === args.initialShelf &&
        args.desiredDisplay !== args.initialDisplay
      ) {
        change = true;
        await BookshelfService.changeDisplayOfBook(
          args.username,
          args.isbn,
          args.initialShelf,
          args.desiredDisplay
        );
      } else if (args.desiredShelf !== args.initialShelf) {
        change = true;
        await BookshelfService.deleteBookFromShelf(
          args.username,
          args.isbn,
          args.initialShelf
        );
        if (args.desiredShelf !== "delete") {
          await BookshelfService.addBookToShelf(
            args.username,
            args.isbn,
            args.desiredShelf,
            args.desiredDisplay
          );
        }
      }
      return change;
    },
  },
  User: {
    bookshelf: async (parent: any, args: any) => {
      return await BookshelfService.getBookshelf(parent.username);
    },
  },
  Bookshelf: {
    currentBooks: (parent: any, args: any) => {
      let shelfInfo = BookshelfService.extractShelfInfo(
        parent.currentBooksCount,
        args.page,
        args.pageSize
      );
      let bookshelfBooks;
      if (args.display) {
        bookshelfBooks = BookshelfService.getDisplayBooks(parent.currentBooks);
      } else {
        bookshelfBooks = BookshelfService.paginateBookshelfBooks(
          parent.currentBooks,
          parent.currentBooksCount,
          args.page,
          args.pageSize
        );
      }
      return { shelfInfo, bookshelfBooks };
    },
    pastBooks: (parent: any, args: any) => {
      let shelfInfo = BookshelfService.extractShelfInfo(
        parent.pastBooksCount,
        args.page,
        args.pageSize
      );
      let bookshelfBooks;
      if (args.display) {
        bookshelfBooks = BookshelfService.getDisplayBooks(parent.pastBooks);
      } else {
        bookshelfBooks = BookshelfService.paginateBookshelfBooks(
          parent.pastBooks,
          parent.pastBooksCount,
          args.page,
          args.pageSize
        );
      }
      return { shelfInfo, bookshelfBooks };
    },
    futureBooks: (parent: any, args: any) => {
      let shelfInfo = BookshelfService.extractShelfInfo(
        parent.futureBooksCount,
        args.page,
        args.pageSize
      );
      let bookshelfBooks;
      if (args.display) {
        bookshelfBooks = BookshelfService.getDisplayBooks(parent.futureBooks);
      } else {
        bookshelfBooks = BookshelfService.paginateBookshelfBooks(
          parent.futureBooks,
          parent.futureBooksCount,
          args.page,
          args.pageSize
        );
      }
      return { shelfInfo, bookshelfBooks };
    },
  },
  Shelf: {
    shelfInfo: (parent: any, args: any) => {
      return parent.shelfInfo;
    },
    bookshelfBooks: (parent: any, args: any) => {
      return parent.bookshelfBooks;
    },
  },
  BookshelfBook: {
    details: async (parent: any, args: any) => {
      return await BookService.getBook(parent.isbn);
    },
  },
};

export default resolvers;
