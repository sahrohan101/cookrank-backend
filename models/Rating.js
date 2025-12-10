import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  date: String,
  chef: String,
  taste: Number,
  hygiene: Number,
  effort: Number
});

export default mongoose.model("Rating", ratingSchema);
