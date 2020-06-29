import mongoose, { Schema, model } from "mongoose";
import UserBooks from "./UserBooks";

const UserBooksSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
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

const UserBooksCollection = model<UserBooks>("userBooks", UserBooksSchema);
export default UserBooksCollection;
