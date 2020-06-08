const mongoose = require("mongoose");

const { Schema } = mongoose;

const TokenSchema = new Schema({
  refreshToken: {
    type: String,
    required: true,
  },
});

module.exports = Token = mongoose.model("token", TokenSchema);
