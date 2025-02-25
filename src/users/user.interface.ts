import {Types} from "mongoose";
import ObjectId = module

interface User {
  email: string;
  password: string;
  nickname: string;
  _id: ObjectId;
}

export default User;