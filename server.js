import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Rating from "./models/Rating.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error", err));

// ---- Auth Middleware ----
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not Authorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: "Invalid Token" });
    req.user = user;
    next();
  });
}

// ---- Auth Routes ----

// Register (only once use karna hai users create karne ke liye)
app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ username: req.body.username, password: hashed });
  res.json(user);
});

// Login
app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
  res.json({ token });
});

// ---- Ratings Routes ----
app.post("/rating", auth, async (req, res) => {
  const rating = await Rating.create(req.body);
  res.status(201).json(rating);
});

app.get("/rating", auth, async (req, res) => {
  const ratings = await Rating.find().sort({ date: -1 });
  res.json(ratings);
});

app.delete("/rating", auth, async (req, res) => {
  await Rating.deleteMany({});
  res.json({ message: "All data deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
