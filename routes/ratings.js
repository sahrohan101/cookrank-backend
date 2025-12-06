const express = require("express");
const Rating = require("../models/Rating");
const CookSession = require("../models/CookSession");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Give rating
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { cookSessionId, taste, hygiene, effort, comment } = req.body;

    const session = await CookSession.findById(cookSessionId);
    if (!session) {
      return res.status(400).json({ message: "Invalid session!" });
    }

    // Self rating prevented
    if (session.cookedBy.toString() === req.userId.toString()) {
      return res.status(400).json({ message: "You cannot rate yourself!" });
    }

    // Check already rated by this user
    const exists = await Rating.findOne({
      cookSession: cookSessionId,
      ratedBy: req.userId,
    });

    if (exists) {
      return res.status(400).json({ message: "You already rated!" });
    }

    const overall = (taste + hygiene + effort) / 3;

    const rating = await Rating.create({
      cookSession: cookSessionId,
      cookedBy: session.cookedBy,
      ratedBy: req.userId,
      taste,
      hygiene,
      effort,
      comment,
      overall,
    });

    res.json({ message: "Rating submitted!", rating });

  } catch (err) {
    console.error("Rating error:", err);
    res.status(500).json({ message: "Server error!" });
  }
});

// Reset user's rating for today
router.delete("/:cookSessionId", authMiddleware, async (req, res) => {
  try {
    await Rating.deleteOne({
      cookSession: req.params.cookSessionId,
      ratedBy: req.userId,
    });

    res.json({ message: "Your rating reset. You can rate again!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove rating!" });
  }
});

// Optional: Reset ALL ratings for today (admin)
router.delete("/all/:cookSessionId", authMiddleware, async (req, res) => {
  try {
    await Rating.deleteMany({ cookSession: req.params.cookSessionId });
    res.json({ message: "All ratings reset!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset ratings!" });
  }
});

module.exports = router;
