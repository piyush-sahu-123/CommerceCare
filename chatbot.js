async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const userMessage = inputField.value.trim();
  if (userMessage === "") return;

  addMessage("You", userMessage);
  inputField.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await res.json();
    addMessage("CommerceCare", data.reply);
  } catch (err) {
    addMessage("CommerceCare", "⚠️ Error connecting to server.");
  }
}

function addMessage(sender, text) {
  const messagesDiv = document.getElementById("messages");
  const message = document.createElement("div");
  message.classList.add("message", sender.toLowerCase());
  message.innerHTML = `<strong>${sender}:</strong> ${text}`;
  messagesDiv.appendChild(message);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
