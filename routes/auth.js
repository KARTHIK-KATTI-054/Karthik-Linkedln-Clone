import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "verysecretkey";

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.json({ error: "Missing fields" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ error: "Incorrect password" });

    const token = jwt.sign({ id: user._id, name: user.name }, SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login success",
      token,
      name: user.name
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
