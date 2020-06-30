import mongoose from "mongoose";

export default interface UserDocument extends mongoose.Document {
  email: string;
  fullName: string;
  username: string;
  password: string;
  profilePhoto: string;
}
