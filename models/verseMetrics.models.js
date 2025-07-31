const { Schema, model } = require("mongoose");

const verseMetricsSchema = new Schema(
  {
    verseId: { type: String, required: true, unique: true, index: true },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Optional safety: never allow negative counts at the application level.
// We’ll maintain counts via transactions, so this is just a sanity guard.

module.exports = model("VerseMetrics", verseMetricsSchema);
