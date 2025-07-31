const { Schema, model } = require("mongoose");

const verseLikeSchema = new Schema(
  {
    verseId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

// Ensure one like per user per verse
verseLikeSchema.index({ verseId: 1, userId: 1 }, { unique: true });

module.exports = model("VerseLike", verseLikeSchema);
