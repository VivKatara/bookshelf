import mongoose from "mongoose";

interface Book {
  isbn: string;
  display: boolean;
}

export default interface UserBooks extends mongoose.Document {
  email: string;
  username: string;
  currentBooks: Array<Book>;
  currentBooksCount: number;
  currentBooksDisplayCount: number;
  pastBooks: Array<Book>;
  pastBooksCount: number;
  pastBooksDisplayCount: number;
  futureBooks: Array<Book>;
  futureBooksCount: number;
  futureBooksDisplayCount: number;
}
