const express = require("express");
require("./db/mongoose");
const userRouter = require("./users/userRout");
const postRouter = require("./posts/postRout");
const commentRouter = require("./comments/commentRout");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(postRouter);
app.use(commentRouter);

app.listen(port, () => {
  console.log("Server is up on " + port);
});
