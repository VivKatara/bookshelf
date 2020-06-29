import mongoose, { Schema, model } from "mongoose";
import Book from "./Book";

const BookSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
});

const BookCollection = model<Book>("book", BookSchema);

export default BookCollection;
