import mongoose from "mongoose";

interface Post {
  _id?: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
  title: string;
}

export default Post;
