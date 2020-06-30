import mongoose, { Schema, model } from "mongoose";
import TokenDocument from "../interfaces/TokenDocument";

const TokenSchema: Schema = new Schema({
  refreshToken: {
    type: String,
    required: true,
  },
});

const TokenCollection = model<TokenDocument>("token", TokenSchema);
export default TokenCollection;
