import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
} from "graphql";
import BookCollection from "../models/BookCollection";

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
    book: {
      type: BookType,
      args: { isbn: { type: GraphQLString } },
      async resolve(parent, args) {
        return await BookCollection.findOne({ isbn: args.isbn });
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
