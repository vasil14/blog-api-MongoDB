const socket = io();

const loginForm = document.querySelector("#login-form");
const postForm = document.querySelector("#post-form");
const postList = document.querySelector("#post-list");

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

// postForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const title = document.querySelector("#title").value;
//   const body = document.querySelector("#body").value;
//   const savedToken = localStorage.getItem("token");

//   const response = await fetch("http://localhost:3000/posts/create", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + savedToken,
//     },
//     body: JSON.stringify({ title, body }),
//   });
//   const res = await response.json();

//   socket.emit("post", res);
// });

// socket.on("appendPost", (post) => {
//   appendPost(post);
// });

// function appendPost(post) {
//   postList.innerHTML += `<div id=${post._id}><p>Title: ${post.title}</p>
//    <p>Body: ${post.body}</p>
//       <button  onclick=createComment(this.parentNode.id)>Comment</button>
//       </div>
//   <hr>`;
// }
