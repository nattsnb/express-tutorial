import mongoose from "mongoose";

interface User {
  email: string;
  password: string;
  nickname: string;
  _id: mongoose.Types.ObjectId;
}

export default User;
