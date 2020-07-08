import UserService from "../../services/user";

const QueryResolvers = {
  Query: {
    homepage: async (parent: any, args: any) => {
      const user = await UserService.getUser(args.username);
      if (user) {
        return { ...user._doc, password: null };
      }
      return user;
    },
    fullshelf: async (parent: any, args: any) => {
      const user = await UserService.getUser(args.username);
      if (user) {
        return { ...user._doc, password: null };
      }
      return user;
    },
  },
};

export default QueryResolvers;
