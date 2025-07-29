const Verse = require("../models/verse.models");

// like / unlike toggle (without auth yet)
exports.likeVerse = async (req, res) => {
  const { id } = req.params; // verseId
  const { userId } = req.body; // sent by app

  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    let verse = await Verse.findOne({ verseId: id });

    if (!verse) {
      verse = await Verse.create({ verseId: id, likedBy: [userId], likes: 1 });
      return res.json(verse);
    }

    const already = verse.likedBy.includes(userId);
    verse.likes += already ? -1 : 1;

    if (already) {
      verse.likedBy = verse.likedBy.filter((u) => u !== userId);
    } else {
      verse.likedBy.push(userId);
    }

    await verse.save();
    res.json(verse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// share increments
exports.shareVerse = async (req, res) => {
  const { id } = req.params;
  try {
    const verse = await Verse.findOneAndUpdate(
      { verseId: id },
      { $inc: { shares: 1 } },
      { new: true, upsert: true }
    );
    res.json(verse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
