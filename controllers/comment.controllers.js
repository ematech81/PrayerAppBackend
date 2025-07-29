const Comment = require("../models/comment.models");

// create comment or reply
exports.createComment = async (req, res) => {
  try {
    const { userId, content, postId, parentId } = req.body;

    const comment = await Comment.create({
      userId,
      content,
      postId,
      parentId: parentId || null, // for replies
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// like comment
exports.likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const already = comment.likedBy.includes(userId);
    comment.likes = Math.max(0, comment.likes + (already ? -1 : 1));
    comment.likedBy = already
      ? comment.likedBy.filter((u) => u !== userId)
      : [...comment.likedBy, userId];

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete (soft)
exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    if (!comment || comment.isDeleted)
      return res.status(404).json({ error: "Comment not found." });

    comment.isDeleted = true;
    await comment.save();

    res.json({ message: "Comment soft-deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
