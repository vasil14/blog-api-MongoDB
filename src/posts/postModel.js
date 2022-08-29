const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    autorName: {
      type: mongoose.Schema.Types.String,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Posts", postSchema);

module.exports = Post;
