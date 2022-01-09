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
    const user = userJoin(socket.id, data.user, data.room);

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
    console.log(msg);

    io.to(user.room).emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit("message", `${user.name} 님이 퇴장하셨습니다.`);
      io.to(user.room).emit("roomUsers", { users: getRoomUsers(user.room) });
    }
  });
});

server.listen(3000, () => console.log("server is running"));
