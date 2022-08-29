const express = require("express");
const auth = require("../middleware/auth");
const UserController = require("../users/userController");
const router = new express.Router();

// Create a new User
router.post("/users", UserController.user_create);

// Login User
router.post("/users/login", UserController.user_login);

// Logout User
router.post("/users/logout", auth, UserController.user_logout);

// Logout User all
router.post("/users/logoutAll", auth, UserController.user_logoutAll);

// Get Users
router.get("/users/me", auth, UserController.user_getUser);

// Update User
router.patch("/users/me", auth, UserController.user_update);

// Delete User
router.delete("/users/me", auth, UserController.user_delete);

// All user totaComments
router.get("/users/totalComments", UserController.user_totalComments);

module.exports = router;
