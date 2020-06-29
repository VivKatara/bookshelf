import mongoose from "mongoose";

export default interface Token extends mongoose.Document {
  refreshToken: string;
}
