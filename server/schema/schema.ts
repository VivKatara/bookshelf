import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
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

const BookshelfBookType = new GraphQLObjectType({
  name: "BookshelfBook",
  fields: () => ({
    isbn: { type: GraphQLString },
    display: { type: GraphQLBoolean },
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
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
