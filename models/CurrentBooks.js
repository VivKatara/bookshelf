const mongoose = require("mongoose");

const { Schema } = mongoose;

const CurrentBookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
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

module.exports = CurrentBooks = mongoose.model(
  "currentBooks",
  CurrentBookSchema
);
