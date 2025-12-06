const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  cookSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CookSession",
    required: true,
  },
  cookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  taste: { type: Number, required: true },
  hygiene: { type: Number, required: true },
  effort: { type: Number, required: true },
  comment: { type: String },
  overall: { type: Number, required: true },
});

// 👉 VERY IMPORTANT: Prevent duplicate ratings
ratingSchema.index(
  { cookSession: 1, ratedBy: 1 },
  { unique: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
