import mongoose, { Schema, model } from "mongoose";
import Token from "./Token";

const TokenSchema: Schema = new Schema({
  refreshToken: {
    type: String,
    required: true,
  },
});

const TokenCollection = model<Token>("token", TokenSchema);
export default TokenCollection;
