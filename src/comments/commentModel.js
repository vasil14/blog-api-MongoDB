const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: String,
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    autorName: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comments", commentSchema);

module.exports = Comment;
