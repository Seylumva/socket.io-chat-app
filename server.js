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
  socket.on("sign-in", (username) => {
    userCount++;
    io.emit("welcome-user", { username, userCount });
  });
  socket.on("new-message", (messageObj) => {
    socket.broadcast.emit("message-received", messageObj);
  });
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
