const User = require('../users/userModel');

// Create a new User
exports.user_create = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

// Login User
exports.user_login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

// Get Users
exports.user_getUser = async (req, res) => {
  res.send(req.user);
};

// Logout User
exports.user_logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

// Logout User all
exports.user_logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
};

// Update User
exports.user_update = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
};

// Delete User
exports.user_delete = async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
};

// All user totaComments
exports.user_totalComments = async (req, res) => {
  try {
    const comments = await User.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'autor',
          as: 'userComments',
        },
      },
      { $unwind: '$userComments' },
      {
        $group: {
          _id: '$name',
          numOfComments: { $sum: 1 },
        },
      },
      { $sort: { numOfComments: -1 } },
      { $limit: 5 },
    ]);

    if (!comments) {
      return res.status(404).send();
    }
    res.send(comments);
  } catch (e) {
    res.status(500).send(e);
  }
};
