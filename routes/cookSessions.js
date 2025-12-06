const express = require("express");
const CookSession = require("../models/CookSession");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper: get today as "YYYY-MM-DD"
function getTodayString() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

// Create cook session (aaj ka cook set karna)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { date, cookedBy, menu } = req.body;

    const dateStr = date || getTodayString();

    // optional: same date pe ek hi session
    const existing = await CookSession.findOne({ date: dateStr });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Session already exists for this date" });
    }

    const session = await CookSession.create({
      date: dateStr,
      cookedBy,
      menu,
    });

    res.json(session);
  } catch (err) {
    console.error("CookSession error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get today's session
router.get("/today", authMiddleware, async (req, res) => {
  try {
    const dateStr = getTodayString();
    const session = await CookSession.findOne({ date: dateStr }).populate(
      "cookedBy",
      "name"
    );

    if (!session) {
      return res.status(404).json({ message: "No session for today" });
    }

    res.json(session);
  } catch (err) {
    console.error("Get today session error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
