import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";
import BookCollection from "../models/BookCollection";
import BookshelfCollection from "../models/BookshelfCollection";
import UserCollection from "../models/UserCollection";
import { query } from "express";
import BookService from "../services/book";
import BookshelfService from "../services/bookshelf";

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
        return await BookshelfCollection.findOne({ username: parent.username });
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

// const Viewer = new GraphQLObjectType({
//   name: "Viewer",
//   fields: () => ({
//     id: { type: GraphQLString },
//     allBooks: {
//       type: BookConnection,
//       args: { page: { type: GraphQLInt }, pageSize: { type: GraphQLInt } },
//       resolve: async (parent, args) => {
//         const result = await BookService.getBooks(args);
//         const { pageInfo, query } = result;
//         return {
//           pageInfo,
//           query,
//         };
//       },
//     },
//   }),
// });

// const BookConnection = new GraphQLObjectType({
//   name: "BookConnection",
//   fields: () => ({
//     pageInfo: {
//       type: PageInfo,
//     },
//     edges: {
//       type: new GraphQLList(BookEdge),
//       resolve: (parent, args) => {
//         return parent.query;
//       },
//     },
//   }),
// });

// const PageInfo = new GraphQLObjectType({
//   name: "PageInfo",
//   fields: () => ({
//     totalPages: { type: GraphQLInt },
//     hasNextPage: { type: GraphQLBoolean },
//     hasPreviousPage: { type: GraphQLBoolean },
//   }),
// });

// const BookEdge = new GraphQLObjectType({
//   name: "BookEdge",
//   fields: () => ({
//     node: {
//       type: BookType,
//       resolve: (parent, args) => {
//         return parent;
//       },
//     },
//   }),
// });

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

const BookshelfBookType = new GraphQLObjectType({
  name: "BookshelfBook",
  fields: () => ({
    isbn: { type: GraphQLString },
    display: { type: GraphQLBoolean },
    details: {
      type: BookType,
      resolve: async (parent, args) => {
        return await BookCollection.findOne({ isbn: parent.isbn });
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
        return await UserCollection.findOne({ username: args.username });
      },
    },
    userExists: {
      type: GraphQLBoolean,
      args: { username: { type: GraphQLString } },
      resolve: async (parent, args) => {
        const user = await UserCollection.findOne({ username: args.username });
        if (user) return true;
        else return false;
      },
    },
    book: {
      type: BookType,
      args: { isbn: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await BookCollection.findOne({ isbn: args.isbn });
      },
    },
    bookshelf: {
      type: BookshelfType,
      args: { username: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await BookshelfCollection.findOne({ username: args.username });
      },
    },
    homepage: {
      type: UserType,
      args: { username: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await UserCollection.findOne({ username: args.username });
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
      },
      resolve: async (parent, args) => {
        return await UserCollection.findOne({ username: args.username });
      },
    },
    // viewer: {
    //   type: Viewer,
    //   args: { page: { type: GraphQLInt }, pageSize: { type: GraphQLInt } },
    //   resolve() {
    //     return { id: "VIEWER_ID" };
    //   },
    // },
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
