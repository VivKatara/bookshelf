import UserService from "../../services/user";
import AuthService from "../../services/auth";

const QueryResolvers = {
  Query: {
    homepage: async (parent: any, args: any, ctx: any) => {
      const user = await UserService.getUser(args.username);
      if (user) {
        return { ...user._doc, password: null };
      }
      return user;
    },
    fullshelf: async (parent: any, args: any, ctx: any) => {
      const user = await UserService.getUser(args.username);
      if (user) {
        return { ...user._doc, password: null };
      }
      return user;
    },
    login: async (parent: any, args: any, ctx: any) => {
      const [accessToken, refreshToken] = await AuthService.SignIn(
        args.email,
        args.password
      );
      // TODO: Consider splitting the headers.payload and .signature of these tokens into separate cookies
      ctx.res.cookie("accessToken", accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", TODO: Set this because over production it should just be https
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days => Same time as refresh token
      });
      ctx.res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", TODO: Set this because over production is should be just https
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
      return true;
    },
  },
};

export default QueryResolvers;
