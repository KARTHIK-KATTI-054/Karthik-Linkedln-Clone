import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", postSchema);
