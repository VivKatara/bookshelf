const crypto = require("crypto");
const User = require("../models/User");

module.exports = async function (fullName) {
  let username = fullName.toLowerCase().split(" ").join("");
  let user = await User.findOne({ username });
  if (!user) {
    return username;
  }
  while (user) {
    username =
      fullName.toLowerCase().split(" ").join("-") +
      "-" +
      crypto.randomBytes(4).toString("hex");
    user = await User.findOne({ username });
  }
  return username;
};
