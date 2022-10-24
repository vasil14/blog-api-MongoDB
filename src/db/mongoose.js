const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog-post-api', {
  useNewUrlParser: true,
  // useCreateIndex: true,
});
