const mongoose = require("mongoose");

const { Schema } = mongoose;

const PastBookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
});

module.exports = PastBooks = mongoose.model("pastBooks", PastBookSchema);
