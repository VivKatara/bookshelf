import UserResolvers from "./user";
import BookshelfResolvers from "./bookshelf";
import ShelfResolvers from "./shelf";
import BookshelfBookResolvers from "./bookshelfBook";
import MutationResolvers from "./mutation";
import QueryResolvers from "./query";

const resolvers = {
  ...QueryResolvers,
  ...MutationResolvers,
  ...UserResolvers,
  ...BookshelfResolvers,
  ...ShelfResolvers,
  ...BookshelfBookResolvers,
};

export default resolvers;
