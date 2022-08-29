const socket = io();
const comments = document.querySelector("#comments");
const comForm = document.querySelector("#comment-form");
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const postForm = document.querySelector("#post-form");
const postList = document.querySelector("#post-list");

// SIGN UP
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email1").value;
  const password = document.getElementById("password1").value;

  await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
});

// LOG IN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const { token } = await response.json();

  localStorage.setItem("token", token);

  const savedToken = localStorage.getItem("token");
});

socket.on("message", (data) => {
  const status = document.getElementById("status");
  status.innerHTML = `<h2>${data}</h2>`;
});

// Create post
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const body = document.querySelector("#body").value;
  const savedToken = localStorage.getItem("token");

  const response = await fetch("http://localhost:3000/posts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    body: JSON.stringify({ title, body }),
  });

  const res = await response.json();

  if (response.status === 400) {
    alert(res.message);
  } else socket.emit("post", res);
});

socket.on("appendPost", (post) => {
  appendPost(post);
});

function appendPost(post) {
  const div = document.createElement("div"),
    button = document.createElement("button");

  div.id = `${post._id}`;
  div.innerHTML = `<hr>
  <p>Post by: ${post.autorName}
  <p>Title: ${post.title}</p>
   <p>Body: ${post.body}</p>
  `;

  button.innerHTML = "Add comment";

  div.appendChild(button);

  postList.appendChild(div);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    const div2 = document.createElement("div"),
      formComment = document.createElement("form"),
      inputComment = document.createElement("input"),
      addComment = document.createElement("button");

    inputComment.placeholder = "Write a comment...";
    inputComment.id = "commentValue";

    addComment.innerHTML = "Send";

    formComment.appendChild(inputComment);
    formComment.appendChild(addComment);
    div2.appendChild(formComment);
    div.appendChild(div2);
    button.disabled = true;

    formComment.addEventListener("submit", async (e) => {
      e.preventDefault();
      const comment = document.querySelector("#commentValue").value;

      const savedToken = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/posts/${post._id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + savedToken,
          },
          body: JSON.stringify({ comment }),
        }
      );

      const res = await response.json();

      if (response.status === 400) {
        alert(res.message);
      } else socket.emit("commentMsg", res);
      div2.removeChild(formComment);
      button.disabled = false;
    });
  });
}

socket.on("append-comments", (comment) => {
  appendComments(comment);
});

function appendComments(comments) {
  const { comment, postId } = comments;
  const id = document.getElementById(postId);
  const div = document.createElement("div"),
    replyBtn = document.createElement("button");
  div.innerHTML = `<div id='${comments._id}'>
  <p>Comment By: ${comments.autorName}</p>
  <p>Comment: ${comment}</p></div>`;
  replyBtn.innerHTML = "Add Reply";

  if (comments._id != undefined) {
    div.appendChild(replyBtn);
    id.appendChild(div);
  }

  replyBtn.addEventListener("click", (e) => {
    const div1 = document.createElement("div"),
      formReply = document.createElement("form"),
      inputReply = document.createElement("input"),
      addReply = document.createElement("button");

    inputReply.placeholder = "Write a reply...";
    inputReply.id = "replyValue";

    addReply.innerHTML = "Send";

    formReply.appendChild(inputReply);
    formReply.appendChild(addReply);
    div1.appendChild(formReply);
    div.appendChild(div1);
    replyBtn.disabled = true;

    formReply.addEventListener("submit", async (e) => {
      e.preventDefault();

      const comment = document.querySelector("#replyValue").value;

      const savedToken = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/posts/comment/${comments._id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + savedToken,
          },
          body: JSON.stringify({ comment }),
        }
      );

      const res = await response.json();

      if (response.status === 400) {
        alert(res.message);
      } else socket.emit("replyMsg", res);
      div1.removeChild(formReply);
      replyBtn.disabled = false;
    });
  });
}

socket.on("appendReply", (reply) => {
  appendReply(reply);
});

function appendReply(replys) {
  const { comment, parentId, _id } = replys;
  const id = document.getElementById(parentId);
  const div = document.createElement("div");

  div.innerHTML = `<p>Reply By: ${replys.autorName}</p>
  <p>Reply: ${comment}</p>`;
  if (parentId != null) {
    id.appendChild(div);
  }
}

// Output Posts
socket.on("output-posts", async () => {
  const response = await fetch("http://localhost:3000/posts/comments/replies", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const posts = await response.json();
  if (posts.length) {
    posts.forEach((post) => {
      appendPost(post);

      if (post.comments.length) {
        post.comments.forEach((comment) => {
          appendComments(comment);

          if (comment.reply.length) {
            comment.reply.forEach((reply) => appendReply(reply));
          }
        });
      }
    });
  }
});
