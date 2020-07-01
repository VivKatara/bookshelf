import mongoose from "mongoose";

export default interface TokenDocument extends mongoose.Document {
  refreshToken: string;
}
