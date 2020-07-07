import mongoose from "mongoose";

interface BookObject {
  isbn: string;
  display: boolean;
}

export default interface BookshelfDocument extends mongoose.Document {
  username: string;
  currentBooks: Array<BookObject>;
  currentBooksCount: number;
  currentBooksDisplayCount: number;
  pastBooks: Array<BookObject>;
  pastBooksCount: number;
  pastBooksDisplayCount: number;
  futureBooks: Array<BookObject>;
  futureBooksCount: number;
  futureBooksDisplayCount: number;
}
