import UserCollection from "../../models/UserCollection";
import BookshelfCollection from "../../models/BookshelfCollection";

const resolvers = {
  Query: {
    user: async (parent: any, args: any) => {
      console.log(parent);
      console.log(args);
      const user = await UserCollection.findOne({ email: args.email });
      return user;
    },
  },
  User: {
    bookshelf: async (parent: any, args: any) => {
      const bookshelf = await BookshelfCollection.findOne({
        email: parent.email,
      });
      return bookshelf;
    },
  },
};

export default resolvers;
