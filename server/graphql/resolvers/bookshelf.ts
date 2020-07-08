import BookshelfService from "../../services/bookshelf";

const BookshelfResolvers = {
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
};

export default BookshelfResolvers;
