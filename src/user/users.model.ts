import * as mongoose from 'mongoose';
import User from "./user.interface";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  nickname: String,
  id: String,
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);


export default userModel;