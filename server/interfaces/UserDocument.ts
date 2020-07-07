import mongoose from "mongoose";

interface MongoResult {
  _doc: any;
}

export default interface UserDocument extends mongoose.Document, MongoResult {
  email: string;
  fullName: string;
  username: string;
  password: string;
  profilePhoto: string;
}
