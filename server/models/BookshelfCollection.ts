import { Schema, model } from "mongoose";
import BookshelfDocument from "../interfaces/BookshelfDocument";

const BookshelfSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  currentBooks: {
    type: [
      {
        isbn: {
          type: String,
          required: true,
        },
        display: {
          type: Boolean,
          required: true,
        },
      },
    ],
    required: true,
  },
  currentBooksCount: {
    type: Number,
    required: true,
  },
  currentBooksDisplayCount: {
    type: Number,
    required: true,
  },
  pastBooks: {
    type: [
      {
        isbn: {
          type: String,
          required: true,
        },
        display: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  pastBooksCount: {
    type: Number,
    required: true,
  },
  pastBooksDisplayCount: {
    type: Number,
    required: true,
  },
  futureBooks: {
    type: [
      {
        isbn: {
          type: String,
          required: true,
        },
        display: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  futureBooksCount: {
    type: Number,
    required: true,
  },
  futureBooksDisplayCount: {
    type: Number,
    required: true,
  },
});

const BookshelfCollection = model<BookshelfDocument>(
  "bookshelf",
  BookshelfSchema
);
export default BookshelfCollection;
