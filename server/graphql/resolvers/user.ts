import BookshelfService from "../../services/bookshelf";

const UserResolvers = {
  User: {
    bookshelf: async (parent: any, args: any) => {
      return await BookshelfService.getBookshelf(parent.username);
    },
  },
};

export default UserResolvers;
