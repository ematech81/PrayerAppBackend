const { Schema, model } = require("mongoose");

const verseSchema = new Schema(
  {
    verseId: { type: String, required: true, unique: true },
    text: String,
    reference: String,
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    likedBy: [String], // store user IDs
  },
  { timestamps: true }
);

module.exports = model("Verse", verseSchema);
