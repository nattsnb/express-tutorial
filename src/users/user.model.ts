import * as mongoose from "mongoose";
import User from "./user.interface";

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    nickname: String,
  },
  { versionKey: false },
);

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;
