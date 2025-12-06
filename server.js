const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// App init
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect("mongodb://127.0.0.1:27017/apartment-chef")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// Simple test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// Routes import (aage add karenge)
const authRoutes = require("./routes/auth");
const cookSessionRoutes = require("./routes/cookSessions");
const ratingRoutes = require("./routes/ratings");
const leaderboardRoutes = require("./routes/leaderboard");

app.use("/api/auth", authRoutes);
app.use("/api/cook-sessions", cookSessionRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
