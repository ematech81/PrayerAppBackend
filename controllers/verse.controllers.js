const mongoose = require("mongoose");
const VerseMetrics = require("../models/verseMetrics.models");
const VerseLike = require("../models/verseLikes.model");
const VerseShareEvent = require("../models/verseShareEvent.models"); // optional

// Toggle like (idempotent & atomic)
exports.toggleLike = async (req, res) => {
  const { id: verseId } = req.params;
  const { userId } = req.body;

  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    return res.status(400).json({ error: "userId is required" });
  }

  const session = await mongoose.startSession();
  let liked, metrics;

  try {
    await session.withTransaction(async () => {
      // Ensure metrics doc exists
      await VerseMetrics.updateOne(
        { verseId },
        { $setOnInsert: { verseId, likes: 0, shares: 0 } },
        { upsert: true, session }
      );

      // Try to create a like
      try {
        await VerseLike.create([{ verseId, userId }], { session });
        liked = true;

        metrics = await VerseMetrics.findOneAndUpdate(
          { verseId },
          { $inc: { likes: 1 } },
          { new: true, session }
        ).lean();
      } catch (err) {
        // If already liked (unique index violation), then unlike
        if (err && err.code === 11000) {
          await VerseLike.deleteOne({ verseId, userId }, { session });
          liked = false;

          metrics = await VerseMetrics.findOneAndUpdate(
            { verseId },
            // clamp at 0 defensively
            [{ $set: { likes: { $max: [{ $subtract: ["$likes", 1] }, 0] } } }],
            { new: true, session }
          ).lean();
        } else {
          throw err;
        }
      }
    });

    return res.json({
      verseId,
      liked,
      likes: metrics.likes,
    });
  } catch (err) {
    console.error("toggleLike error:", err);
    return res.status(500).json({ error: "Internal error" });
  } finally {
    session.endSession();
  }
};

// Read-only count (fast and cheap)
exports.getLikeCount = async (req, res) => {
  const { id: verseId } = req.params;
  try {
    const doc = await VerseMetrics.findOne(
      { verseId },
      { _id: 0, verseId: 1, likes: 1 }
    ).lean();

    return res.json({ verseId, likes: doc?.likes || 0 });
  } catch (err) {
    console.error("getLikeCount error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};

// Share (increment counter + optional event log)
exports.shareVerse = async (req, res) => {
  const { id: verseId } = req.params;
  const { channel, userId } = req.body || {};

  try {
    const metrics = await VerseMetrics.findOneAndUpdate(
      { verseId },
      [
        { $setOnInsert: { verseId, likes: 0, shares: 0 } },
        { $set: { shares: { $add: ["$shares", 1] } } },
      ],
      { upsert: true, new: true }
    ).lean();

    // Optional: log event (non-blocking)
    if (channel || userId) {
      VerseShareEvent?.create({
        verseId,
        userId,
        channel: ["whatsapp", "twitter", "copy", "system"].includes(channel)
          ? channel
          : "other",
        ip: req.ip,
        ua: req.get("user-agent")?.slice(0, 256),
      }).catch(() => {});
    }

    return res.json({
      verseId,
      shares: metrics.shares,
    });
  } catch (err) {
    console.error("shareVerse error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};

// const Verse = require("../models/verse.models");

// // like / unlike toggle (without auth yet)
// exports.likeVerse = async (req, res) => {
//   const { id } = req.params; // verseId
//   const { userId } = req.body; // sent by app

//   if (!userId) return res.status(400).json({ error: "userId required" });

//   try {
//     let verse = await Verse.findOne({ verseId: id });

//     if (!verse) {
//       verse = await Verse.create({ verseId: id, likedBy: [userId], likes: 1 });
//       return res.json(verse);
//     }

//     const already = verse.likedBy.includes(userId);
//     verse.likes += already ? -1 : 1;

//     if (already) {
//       verse.likedBy = verse.likedBy.filter((u) => u !== userId);
//     } else {
//       verse.likedBy.push(userId);
//     }

//     await verse.save();
//     res.json(verse);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // share increments
// exports.shareVerse = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const verse = await Verse.findOneAndUpdate(
//       { verseId: id },
//       { $inc: { shares: 1 } },
//       { new: true, upsert: true }
//     );
//     res.json(verse);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
