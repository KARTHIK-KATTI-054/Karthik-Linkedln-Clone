import express from "express";
import Post from "../models/Post.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "verysecretkey";

function auth(req, res, next) {
  const token = req.headers.token;
  if (!token) return res.json({ error: "No token provided" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

router.post("/add", auth, async (req, res) => {
  try {
    const post = new Post({
      userId: req.user.id,
      userName: req.user.name,
      text: req.body.text
    });
    await post.save();
    res.json({ message: "Post created" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
