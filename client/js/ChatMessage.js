class ChatMessage {
  constructor(message, author, root) {
    this.message = message;
    this.author = author;
    this.root = root;
    this.el = this.createElement(this.message, this.author);
  }

  createElement(message, author) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.textContent = message;
    if (author === "me") {
      messageElement.setAttribute("data-me", "");
    } else if (author === "server") {
      messageElement.setAttribute("data-server", "");
    } else {
      messageElement.setAttribute("data-other", author);
    }
    this.root.append(messageElement);
  }
}

export default ChatMessage;
