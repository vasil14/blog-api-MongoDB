const Comment = require("./commentModel");

// Create a comment
exports.comment_create = async (req, res) => {
  if (!req.body.comment) {
    return res.status(400).send({ message: "Comment is required!" });
  }

  const _id = req.params.id;

  const createdComment = new Comment({
    comment: req.body.comment,
    autor: req.user._id,
    autorName: req.user.name,
    postId: _id,
  });
  try {
    await createdComment.save();

    res.status(201).send(createdComment);
  } catch (e) {
    res.status(400).send();
  }
};

// Create reply comment
exports.comment_replyCreate = async (req, res) => {
  if (!req.body.comment) {
    return res.status(400).send({ message: "Reply is required!" });
  }

  try {
    const commentFound = await Comment.findById(req.params.commentId);

    if (!commentFound) {
      return res.status(404).send();
    }
    const reply = new Comment({
      comment: req.body.comment,
      autor: req.user._id,
      autorName: req.user.name,
      parentId: commentFound._id,
      postId: commentFound.postId,
    });
    reply.save();
    res.send(reply);
  } catch (e) {
    res.status(500).send();
  }
};

// Edit comment
exports.comment_update = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["comment"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      autor: req.user._id,
    });

    if (!comment) {
      return res.status(404).send();
    }

    updates.forEach((update) => (comment[update] = req.body[update]));
    await comment.save();
    res.send(comment);
  } catch (e) {
    res.status(400).send(e);
  }
};

// Edit reply comment
exports.comment_replyUpdate = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["comment"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      autor: req.user._id,
    });

    if (!comment) {
      return res.status(404).send();
    }

    updates.forEach((update) => (comment[update] = req.body[update]));
    await comment.save();
    res.send(comment);
  } catch (e) {
    res.status(400).send(e);
  }
};
