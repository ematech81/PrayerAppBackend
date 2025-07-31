const { Schema, model } = require("mongoose");

// Keep events 90 days by default; adjust as needed
const verseShareEventSchema = new Schema(
  {
    verseId: { type: String, required: true, index: true },
    userId: { type: String }, // optional if you don’t have auth
    channel: {
      type: String,
      enum: ["whatsapp", "twitter", "copy", "system", "other"],
      default: "other",
    },
    ip: { type: String },
    ua: { type: String, maxlength: 256 },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      expires: 60 * 60 * 24 * 90,
    }, // 90 days
  },
  { timestamps: false }
);

module.exports = model("VerseShareEvent", verseShareEventSchema);
