const express = require("express");
const Rating = require("../models/Rating");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Leaderboard
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await Rating.aggregate([
      {
        $group: {
          _id: "$cookedBy",
          avgScore: { $avg: "$overall" },
          ratingCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          avgScore: { $round: ["$avgScore", 2] },
          ratingCount: 1,
        },
      },
      { $sort: { avgScore: -1 } },
    ]);

    res.json(result);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
