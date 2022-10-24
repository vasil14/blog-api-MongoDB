const express = require('express');
const auth = require('../middleware/auth');
const UserController = require('../users/userController');
const router = new express.Router();

// Create a new User
router.post('/', UserController.user_create);

// Login User
router.post('/login', UserController.user_login);

// Logout User
router.post('/logout', auth, UserController.user_logout);

// Logout User all
router.post('/logoutAll', auth, UserController.user_logoutAll);

// Get Users
router.get('/me', auth, UserController.user_getUser);

// Update User
router.patch('/me', auth, UserController.user_update);

// Delete User
router.delete('/me', auth, UserController.user_delete);

// All user totaComments
router.get('/totalComments', UserController.user_totalComments);

module.exports = router;
