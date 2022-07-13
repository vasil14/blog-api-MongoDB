const express = require("express");
const Comment = require("./commentModel");
const auth = require("../middleware/auth");

const commentController = require("./commentController");

const router = new express.Router();

// Create a comment
router.post("/posts/:id/comment", auth, commentController.comment_create);

// Create reply comment
router.post(
  "/posts/comment/:commentId/reply",
  auth,
  commentController.comment_replyCreate
);

// Edit comment
router.patch("/posts/comment/:id", auth, commentController.comment_update);

// Edit reply comment
router.patch(
  "/posts/comment/reply/:id",
  auth,
  commentController.comment_replyUpdate
);

// get all comments
// router.get("/comments", async (req, res) => {
//   try {
//     const comments = await Comment.find({});
//     res.send(comments);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

// router.get("/comments/:id", async (req, res) => {
//   const comment = await Comment.findById(req.params.id);

//   res.send(comment);
// });

module.exports = router;
