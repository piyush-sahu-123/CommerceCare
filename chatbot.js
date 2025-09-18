async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const userMessage = inputField.value.trim();
  if (userMessage === "") return;

  addMessage("You", userMessage);
  inputField.value = "";

  // Call backend API
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
