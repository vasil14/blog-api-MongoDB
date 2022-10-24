const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();

const postController = require('../posts/postsController');

// Create a new Post
router.post('/create', auth, postController.post_create);

// Get all posts
router.get('/', postController.post_getPosts);

// Get post
router.get('/:id', postController.post_GetPostById);

// Update Post
router.patch('/:id', auth, postController.post_update);

// Get post with comments and replies
router.get('/comments/replies', postController.post_postsCommentReplies);

// Get posts with more then 10 comments
router.get('/totalcomments/10', postController.post_totalComments10);

module.exports = router;
