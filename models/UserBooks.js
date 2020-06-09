const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserBookSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  currentBooks: {
    // Array of ISBN 13 numbers. Soon will have to be array of objects that have {isbn: (13 digit number as string) display: (0 or 1), favorite: (0 or 1)}
    type: [String],
    required: true,
  },
  pastBooks: {
    type: [String],
    required: true,
  },
  futureBooks: {
    type: [String],
    required: true,
  },
});

module.exports = UserBooks = mongoose.model("userBooks", UserBookSchema);
