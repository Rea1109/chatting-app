const {
  userJoin,
  getRoomUsers,
  userLeave,
  getCurrentUser,
} = require("./utils/user");

const express = require("express");
const http = require("http");

const app = express();
const path = require("path");
const server = http.createServer(app);
const socketIO = require("socket.io");

const io = socketIO(server);

app.use(express.static(path.join(__dirname, "src")));

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    const user = userJoin(socket.id, data.user, data.room, data.img);

    socket.join(user.room);

    socket.emit("message", `${user.room} 채팅방 입니다.`);

    socket.broadcast
      .to(user.room)
      .emit("message", `${user.name} 님이 들어오셨습니다.`);

    const users = getRoomUsers(data.room);
    io.to(user.room).emit("roomUsers", { users: getRoomUsers(user.room) });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("chatMessage", { msg: msg, img: user.img });
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit("message", `${user.name} 님이 퇴장하셨습니다.`);
      io.to(user.room).emit("roomUsers", { users: getRoomUsers(user.room) });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log("server is running"));
