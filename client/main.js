import "./style.css";
import "./reset.css";
import { io } from "socket.io-client";
import ChatMessage from "./js/ChatMessage";

const signInForm = document.querySelector(".sign-in");
const chatForm = document.querySelector(".chat-form");
const messageInput = document.querySelector(".chat-form textarea");
const messageContainer = document.querySelector(".messages");
const userCountLabel = document.querySelector(".user-count span");

messageInput.addEventListener("keydown", (e) => {
  if (e.which === 13 && !e.shiftKey) {
    e.preventDefault();
    e.target.form.dispatchEvent(new Event("submit"));
  }
});

let username = "";
let activeUsers = 0;

function handleSignIn(e) {
  e.preventDefault();
  if (e.target.username.value.length < 3) {
    window.alert("Your username must at least 3 letters");
    return;
  }
  username = e.target.username.value;
  [...e.target.elements].forEach((el) => (el.disabled = true));
  socket.emit("sign-in", username);
  [...chatForm.elements].forEach((el) => (el.disabled = false));
  signInForm.classList.add("hidden");
  signInForm.removeEventListener("submit", handleSignIn);
}

signInForm.addEventListener("submit", handleSignIn);

function handleSendMessage(e) {
  e.preventDefault();
  if (e.target.message.value.trim().length === 0) {
    return;
  }
  const message = e.target.message.value;
  socket.emit("new-message", { message, username });
  new ChatMessage(message, "me", messageContainer);
  e.target.message.value = "";
}

chatForm.addEventListener("submit", handleSendMessage);

const socket = io("http://localhost:8080", { transports: ["websocket"] });

socket.on("welcome-user", ({ username, userCount }) => {
  activeUsers = userCount;
  userCountLabel.textContent = activeUsers;
  new ChatMessage(
    `${username} has entered the chat.`,
    "server",
    messageContainer
  );
});

socket.on("message-received", (messageObj) => {
  const { message, username } = messageObj;
  new ChatMessage(message, username, messageContainer);
});

socket.on("user-leaving", (userCount) => {
  activeUsers = userCount;
  userCountLabel.textContent = activeUsers;
});
