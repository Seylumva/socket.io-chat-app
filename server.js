const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors({ origin: "*" }));

let userCount = 0;

io.on("connection", (socket) => {
  userCount += 1;
  socket.on("sign-in", (username) => {
    io.emit("welcome-user", { username, userCount });
  });
  socket.on("new-message", (messageObj) => {
    socket.broadcast.emit("message-received", messageObj);
  });

  socket.on("disconnect", () => {
    userCount -= 1;
    io.emit("user-leaving", userCount);
  });
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
