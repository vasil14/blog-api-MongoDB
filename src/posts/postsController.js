const Post = require('../posts/postModel');

// Create a new Post
exports.post_create = async (req, res) => {
  if (!req.body.title || !req.body.body) {
    return res.status(400).send({ message: 'Title and body Required!' });
  }
  try {
    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      autor: req.user._id,
      autorName: req.user.name,
    });

    await post.save();
    res.status(201).send(post);
  } catch (e) {
    res.status(400).send(e);
  }
};

// Get all posts
exports.post_getPosts = async (req, res) => {
  try {
    const post = await Post.find({});
    res.send(post);
  } catch (e) {
    res.status(500).send(e);
  }
};

// Get post
exports.post_GetPostById = async (req, res) => {
  const _id = req.params.id;

  try {
    const post = await Post.findById(_id);

    if (!post) {
      return res.status(404).send();
    }

    res.send(post);
  } catch (e) {
    res.status(500).send();
  }
};

// Update Post
exports.post_update = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'body'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const post = await Post.findOne({
      _id: req.params.id,
      autor: req.user._id,
    });
    if (!post) {
      return res.status(404).send();
    }

    updates.forEach((update) => (post[update] = req.body[update]));
    await post.save();
    res.send(post);
  } catch (e) {
    res.status(400).send(e);
  }
};

// Get post with comments and replies
exports.post_postsCommentReplies = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: { post_Id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$$post_Id', '$postId'] },
                    { $eq: ['$parentId', null] },
                  ],
                },
              },
            },
          ],
          as: 'comments',
        },
      },
      {
        $unwind: {
          path: '$comments',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments._id',
          foreignField: 'parentId',
          as: 'reply',
        },
      },

      {
        $unwind: {
          path: '$reply',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            title: '$title',
            body: '$body',
            autor: '$autor',
            autorName: '$autorName',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt',
            comments: {
              _id: '$comments._id',
              comment: '$comments.comment',
              autor: '$comments.autor',
              autorName: '$comments.autorName',
              postId: '$comments.postId',
              createdAt: '$comments.createdAt',
              updatedAt: '$comments.updatedAt',
            },
          },
          replies: {
            $push: {
              $cond: [{ $gt: ['$reply', 0] }, '$reply', '$$REMOVE'],
            },
          },
          replyCount: { $sum: 1 },
        },
      },
      { $sort: { replyCount: -1 } },
      {
        $group: {
          _id: '$_id._id',
          title: { $first: '$_id.title' },
          body: { $first: '$_id.body' },
          autor: { $first: '$_id.autor' },
          autorName: { $first: '$_id.autorName' },
          createdAt: { $first: '$_id.createdAt' },
          updatedAt: { $first: '$_id.updatedAt' },
          commentCount: { $sum: 1 },
          comments: {
            $push: {
              _id: '$_id.comments._id',
              comment: '$_id.comments.comment',
              autor: '$_id.comments.autor',
              autorName: '$_id.comments.autorName',
              postId: '$_id.comments.postId',
              createdAt: '$_id.comments.createdAt',
              updatedAt: '$_id.comments.updatedAt',
              replyCount: {
                $cond: {
                  if: { $isArray: '$replies' },
                  then: { $size: '$replies' },
                  else: 0,
                },
              },
              reply: '$replies',
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (!posts) {
      return res.status(404).send();
    }

    const mapped = posts.map((post) => {
      const { comments } = post;

      const repliesCount = comments.reduce((total, comment) => {
        return total + comment.reply.length;
      }, 0);

      return {
        ...post,
        totalComments: repliesCount + comments.length,
      };
    });
    res.send(mapped);
  } catch (e) {
    res.status(400).send(e);
  }
};

// Get posts with more then 10 comments
exports.post_totalComments10 = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: { post_Id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$$post_Id', '$postId'] },
                    { $eq: ['$parentId', null] },
                  ],
                },
              },
            },
          ],
          as: 'comments',
        },
      },
      {
        $unwind: {
          path: '$comments',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments._id',
          foreignField: 'parentId',
          as: 'reply',
        },
      },
      {
        $unwind: {
          path: '$reply',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            title: '$title',
            body: '$body',
            autor: '$autor',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt',
            comments: {
              _id: '$comments._id',
              comment: '$comments.comment',
              autor: '$comments.autor',
              postId: '$comments.postId',
              createdAt: '$comments.createdAt',
              updatedAt: '$comments.updatedAt',
            },
          },
          // replyCount: { $sum: 1 },
          replies: { $push: '$reply' },
        },
      },
      { $sort: { replyCount: -1 } },
      {
        $group: {
          _id: '$_id._id',
          title: { $first: '$_id.title' },
          body: { $first: '$_id.body' },
          autor: { $first: '$_id.autor' },
          createdAt: { $first: '$_id.createdAt' },
          updatedAt: { $first: '$_id.updatedAt' },
          commentCount: { $sum: 1 },
          totalRep: { $sum: '$replyCount' },
          comments: {
            $push: {
              _id: '$_id.comments._id',
              comment: '$_id.comments.comment',
              autor: '$_id.comments.autor',
              postId: '$_id.comments.postId',
              createdAt: '$_id.comments.createdAt',
              updatedAt: '$_id.comments.updatedAt',
              replyCount: {
                $cond: {
                  if: { $isArray: '$replies' },
                  then: { $size: '$replies' },
                  else: 0,
                },
              },
              reply: '$replies',
            },
          },
        },
      },
      { $sort: { totalComments: -1 } },
    ]);

    if (!posts) {
      return res.status(404).send();
    }

    const mapped = posts.map((post) => {
      const { comments } = post;

      const repliesCount = comments.reduce((total, comment) => {
        return total + comment.reply.length;
      }, 0);

      return {
        ...post,
        totalComments: repliesCount + comments.length,
      };
    });

    const postsMoreComments = mapped.filter((post) => {
      return post.totalComments > 0;
    });

    if (!postsMoreComments) {
      return res.status(404).send();
    }

    res.send(postsMoreComments);
  } catch (e) {
    res.status(400).send(e);
  }
};
