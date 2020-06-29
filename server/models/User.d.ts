import mongoose from "mongoose";

export default interface User extends mongoose.Document {
  email: string;
  fullName: string;
  username: string;
  password: string;
  profilePhoto: string;
}
