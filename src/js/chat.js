const { user, room, img } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

const chatInfo = document.querySelector(".chat_info");
const userList = document.querySelector(".user_list");
const chatList = document.querySelector(".chat_list");
const inputBox = document.querySelector("#input_box");
const sendButton = document.querySelector(".send-button");

// join
socket.emit("joinRoom", { user, room, img });

// users
socket.on("roomUsers", (data) => {
  outputUsers(data.users);
});

// 서버부터 메시지
socket.on("message", (message) => {
  outputMessage(message);
  chatList.scrollTop = chatList.scrollHeight;
});

// 채팅 메시지
socket.on("chatMessage", (data) => {
  if (user === data.msg.user) {
    const div = document.createElement("div");
    div.classList.add("chat_my");
    div.innerHTML = `<span>${data.msg.msg}</span>`;
    chatList.appendChild(div);
  } else {
    const div = document.createElement("div");
    div.classList.add("chat_other");
    div.innerHTML = `<div class="chat_profile">
    <img src="https://storage.googleapis.com/${data.img}" alt="" />
  </div>
  <span>${data.msg.user}</span>
  <p>${data.msg.msg}</p>`;
    chatList.appendChild(div);
  }

  chatList.scrollTop = chatList.scrollHeight;
});

const sendMessage = () => {
  if (window.event.keyCode == 13 && inputBox.value !== "") {
    const msg = inputBox.value;
    socket.emit("chatMessage", { user: user, msg: msg });
    inputBox.value = "";
  }
};

sendButton.addEventListener("click", () => {
  const msg = inputBox.value;
  socket.emit("chatMessage", { user: user, msg: msg });
  inputBox.value = "";
  inputBox.focus();
});

const outputMessage = (message) => {
  const span = document.createElement("span");
  span.innerHTML = message;
  span.classList.add("chat_info");
  chatList.appendChild(span);
};

const outputUsers = (users) => {
  userList.innerHTML = `<div class="user_list_icon"></div>${users.map(
    (user) => `<li>${user.name}</li>`
  )}`;
};

$(() => {
  $(".chat_title").text(room);
});
