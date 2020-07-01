import mongoose from "mongoose";

export default interface BookDocument extends mongoose.Document {
  title: string;
  authors: Array<string>;
  description: string;
  isbn: string;
  coverImage: string;
}
