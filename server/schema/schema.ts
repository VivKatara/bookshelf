import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} from "graphql";
import UserService from "../services/user";
import BookService from "../services/book";
import BookshelfService from "../services/bookshelf";
import AuthService from "../services/auth";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    email: { type: GraphQLString },
    fullName: { type: GraphQLString },
    username: { type: GraphQLString },
    profilePhoto: { type: GraphQLString },
    bookshelf: {
      type: BookshelfType,
      resolve: async (parent, args) => {
        return await BookshelfService.getBookshelf(parent.username);
      },
    },
  }),
});

const BookshelfType = new GraphQLObjectType({
  name: "Bookshelf",
  fields: () => ({
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    currentBooks: {
      type: ShelfType,
      args: {
        page: { type: GraphQLInt },
        pageSize: { type: GraphQLInt },
        display: { type: GraphQLBoolean },
      },
      resolve: (parent, args) => {
        let shelfInfo = BookshelfService.extractShelfInfo(
          parent.currentBooksCount,
          args.page,
          args.pageSize
        );
        let bookshelfBooks;
        if (args.display) {
          bookshelfBooks = BookshelfService.getDisplayBooks(
            parent.currentBooks
          );
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
    },
    currentBooksCount: { type: GraphQLInt },
    currentBooksDisplayCount: { type: GraphQLInt },
    pastBooks: {
      type: ShelfType,
      args: {
        page: { type: GraphQLInt },
        pageSize: { type: GraphQLInt },
        display: { type: GraphQLBoolean },
      },
      resolve: (parent, args) => {
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
    },
    pastBooksCount: { type: GraphQLInt },
    pastBooksDisplayCount: { type: GraphQLInt },
    futureBooks: {
      type: ShelfType,
      args: {
        page: { type: GraphQLInt },
        pageSize: { type: GraphQLInt },
        display: { type: GraphQLBoolean },
      },
      resolve: (parent, args) => {
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
    futureBooksCount: { type: GraphQLInt },
    futureBooksDisplayCount: { type: GraphQLInt },
  }),
});

const ShelfType = new GraphQLObjectType({
  name: "Shelf",
  fields: () => ({
    shelfInfo: {
      type: ShelfInfoType,
      resolve: (parent, args) => {
        return parent.shelfInfo;
      },
    },
    bookshelfBooks: {
      type: new GraphQLList(BookshelfBookType),
      resolve: (parent, args) => {
        return parent.bookshelfBooks;
      },
    },
  }),
});

const ShelfInfoType = new GraphQLObjectType({
  name: "ShelfInfo",
  fields: () => ({
    totalPages: { type: GraphQLInt },
    hasNextPage: { type: GraphQLBoolean },
    hasPreviousPage: { type: GraphQLBoolean },
  }),
});

const BookshelfBookType = new GraphQLObjectType({
  name: "BookshelfBook",
  fields: () => ({
    isbn: { type: GraphQLString },
    display: { type: GraphQLBoolean },
    details: {
      type: BookType,
      resolve: async (parent, args) => {
        return await BookService.getBook(parent.isbn);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    title: { type: GraphQLString },
    authors: { type: GraphQLList(GraphQLString) },
    description: { type: GraphQLString },
    isbn: { type: GraphQLString },
    coverImage: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    homepage: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        page: { type: GraphQLInt },
        pageSize: { type: GraphQLInt },
        display: { type: GraphQLBoolean },
      },
      resolve: async (parent, args) => {
        return await UserService.getUser(args.username);
      },
    },
    fullshelf: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        currentBooks: { type: GraphQLBoolean },
        pastBooks: { type: GraphQLBoolean },
        futureBooks: { type: GraphQLBoolean },
        page: { type: GraphQLInt },
        pageSize: { type: GraphQLInt },
        display: { type: GraphQLBoolean },
      },
      resolve: async (parent, args) => {
        return await UserService.getUser(args.username);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        fullName: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        return await AuthService.SignUp(
          args.email,
          args.fullName,
          args.password
        );
      },
    },
    addBook: {
      type: BookType,
      args: {
        email: { type: GraphQLString },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        shelf: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const book = await BookService.addBook(args.title, args.author);
        await BookshelfService.addBookToShelf(
          args.email,
          book.isbn,
          args.shelf,
          true
        );
        return book;
      },
    },
    // checkUser: { // This isn't that easy because we would need to figure out authentication
    //   type: GraphQLBoolean,
    //   args: {
    //     email: { type: GraphQLString },
    //     password: { type: GraphQLString },
    //   },
    //   resolve: async (parent, args) => {
    //     return await AuthService.SignIn(args.email, args.password);
    //   },
    // },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;
