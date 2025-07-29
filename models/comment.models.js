const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    verseId: { type: String, required: true }, // Which verse or devotion this comment is on
    userId: { type: String, required: true }, // Can later change to ObjectId if you have User model
    content: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, // For replies
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }], // Array of userIds
    isDeleted: { type: Boolean, default: false }, // For soft delete
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
