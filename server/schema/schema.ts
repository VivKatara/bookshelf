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

// const Viewer = new GraphQLObjectType({
//   name: "Viewer",
//   fields: () => ({
//     id: {
//       type: new GraphQLNonNull(GraphQLID),
//     },
//     allBooks: {
//       type: BookConnection,
//       resolve() {
//         return {};
//       },
//     },
//   }),
// });

// const PageInfo = new GraphQLObjectType({
//   name: "PageInfo",
//   fields: () => ({
//     hasNextPage: {
//       type: GraphQLNonNull(GraphQLBoolean),
//     },
//     hasPreviousPage: {
//       type: GraphQLNonNull(GraphQLBoolean),
//     },
//   }),
// });

// const BookConnection = new GraphQLObjectType({
//   name: "BookConnection",
//   fields: () => ({
//     edges: {
//       type: new GraphQLList(BookEdge),
//       resolve() {
//         return [];
//       },
//     },
//     pageInfo: {
//       type: new GraphQLNonNull(PageInfo),
//     },
//   }),
// });

// const BookEdge = new GraphQLObjectType({
//   name: "BookEdge",
//   fields: () => ({
//     cursor: { type: GraphQLString },
//     node: {
//       type: BookType,
//     },
//   }),
// });

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
      },
      resolve: async (parent, args) => {
        return await UserCollection.findOne({ username: args.username });
      },
    },
    // viewer: {
    //   type: Viewer,
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
