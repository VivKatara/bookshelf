import mongoose, { Schema, model } from "mongoose";
import UserDocument from "../interfaces/UserDocument";

export const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  username: {
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

const UserCollection = model<UserDocument>("user", UserSchema);
export default UserCollection;
