// import UserCollection from "../models/UserCollection";

// export default class UserService {
//   public static checkUsername = async (username: string): Promise<boolean> => {
//     const user = await UserCollection.findOne({ username });
//     if (!user) {
//       throw { status: 400, message: "Can't find user" };
//     }
//     return true;
//   };

//   public static getUserFullName = async (username: string): Promise<string> => {
//     const user = await UserCollection.findOne({ username });
//     if (!user) {
//       throw { status: 400, message: "Can't find user" };
//     }
//     if (!user.fullName) {
//       throw { status: 400, message: "Can't find user's full name" };
//     }
//     return user.fullName;
//   };
// }
