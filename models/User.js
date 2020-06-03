const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
