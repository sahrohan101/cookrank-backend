const mongoose = require("mongoose");

const cookSessionSchema = new mongoose.Schema({
  date: { type: String, required: true }, // "2025-12-03" format
  cookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  menu: { type: String },
});

module.exports = mongoose.model("CookSession", cookSessionSchema);
