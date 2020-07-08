import AuthService from "../../services/auth";
import BookshelfService from "../../services/bookshelf";
import BookService from "../../services/book";

const MutationResolvers = {
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
};

export default MutationResolvers;
