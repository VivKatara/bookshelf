const mongoose = require("mongoose");

const { Schema } = mongoose;

const PastBookSchema = new Schema({
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

module.exports = PastBooks = mongoose.model("pastBooks", PastBookSchema);
