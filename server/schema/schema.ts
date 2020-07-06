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

const UserFullshelfType = new GraphQLObjectType({
  name: "UserFullshelf",
  fields: () => ({
    email: { type: GraphQLString },
    fullName: { type: GraphQLString },
    username: { type: GraphQLString },
    profilePhoto: { type: GraphQLString },
    bookshelf: {
      type: FullBookshelfType,
      resolve: async (parent, args) => {
        return await BookshelfService.getBookshelf(parent.username);
      },
    },
  }),
});

const FullBookshelfType = new GraphQLObjectType({
  name: "FullBookshelf",
  fields: () => ({
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    currentBooks: {
      type: ShelfInfoAndBookshelfBooks,
      args: { page: { type: GraphQLInt }, pageSize: { type: GraphQLInt } },
      resolve: (parent, args) => {
        const shelfInfo = BookshelfService.extractShelfInfo(
          parent.currentBooksCount,
          args.page,
          args.pageSize
        );
        const bookshelfBooks = BookshelfService.paginateBookshelfBooks(
          parent.currentBooks,
          parent.currentBooksCount,
          args.page,
          args.pageSize
        );
        return { shelfInfo, bookshelfBooks };
      },
    },
    currentBooksCount: { type: GraphQLInt },
    currentBooksDisplayCount: { type: GraphQLInt },
    pastBooks: {
      type: ShelfInfoAndBookshelfBooks,
      args: { page: { type: GraphQLInt }, pageSize: { type: GraphQLInt } },
      resolve: (parent, args) => {
        const shelfInfo = BookshelfService.extractShelfInfo(
          parent.pastBooksCount,
          args.page,
          args.pageSize
        );
        const bookshelfBooks = BookshelfService.paginateBookshelfBooks(
          parent.pastBooks,
          parent.pastBooksCount,
          args.page,
          args.pageSize
        );
        return { shelfInfo, bookshelfBooks };
      },
    },
    pastBooksCount: { type: GraphQLInt },
    pastBooksDisplayCount: { type: GraphQLInt },
    futureBooks: {
      type: ShelfInfoAndBookshelfBooks,
      args: { page: { type: GraphQLInt }, pageSize: { type: GraphQLInt } },
      resolve: (parent, args) => {
        const shelfInfo = BookshelfService.extractShelfInfo(
          parent.futureBooksCount,
          args.page,
          args.pageSize
        );
        const bookshelfBooks = BookshelfService.paginateBookshelfBooks(
          parent.futureBooks,
          parent.futureBooksCount,
          args.page,
          args.pageSize
        );
        return { shelfInfo, bookshelfBooks };
      },
    },
    futureBooksCount: { type: GraphQLInt },
    futureBooksDisplayCount: { type: GraphQLInt },
  }),
});

const ShelfInfoAndBookshelfBooks = new GraphQLObjectType({
  name: "ShelfInfoAndBookshelfBooks",
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
    currentBooks: { type: new GraphQLList(BookshelfBookType) },
    currentBooksCount: { type: GraphQLInt },
    currentBooksDisplayCount: { type: GraphQLInt },
    pastBooks: { type: new GraphQLList(BookshelfBookType) },
    pastBooksCount: { type: GraphQLInt },
    pastBooksDisplayCount: { type: GraphQLInt },
    futureBooks: { type: new GraphQLList(BookshelfBookType) },
    futureBooksCount: { type: GraphQLInt },
    futureBooksDisplayCount: { type: GraphQLInt },
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
    user: {
      type: UserType,
      args: { username: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await UserService.getUser(args.username);
      },
    },
    userExists: {
      type: GraphQLBoolean,
      args: { username: { type: GraphQLString } },
      resolve: async (parent, args) => {
        const user = await UserService.getUser(args.username);
        if (user) return true;
        else return false;
      },
    },
    book: {
      type: BookType,
      args: { isbn: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await BookService.getBook(parent.isbn);
      },
    },
    bookshelf: {
      type: BookshelfType,
      args: { username: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await BookshelfService.getBookshelf(parent.username);
      },
    },
    homepage: {
      type: UserType,
      args: { username: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await UserService.getUser(args.username);
      },
    },
    fullshelf: {
      type: UserFullshelfType,
      args: {
        username: { type: GraphQLString },
        currentBooks: { type: GraphQLBoolean },
        pastBooks: { type: GraphQLBoolean },
        futureBooks: { type: GraphQLBoolean },
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
    register: {
      type: UserType,
      args: {},
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
