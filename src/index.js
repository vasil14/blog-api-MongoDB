const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
require("./db/mongoose");
const userRouter = require("./users/userRout");
const postRouter = require("./posts/postRout");
const commentRouter = require("./comments/commentRout");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

app.use(express.json());
app.use(userRouter);
app.use(postRouter);
app.use(commentRouter);

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.emit("message", "Welcome");

  socket.emit("output-posts");

  socket.on("commentMsg", (msg) => {
    io.emit("append-comments", msg);
  });

  socket.on("post", (post) => {
    // console.log(post);
    io.emit("appendPost", post);
  });

  socket.on("replyMsg", (reply) => {
    io.emit("appendReply", reply);
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
