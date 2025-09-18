import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Gemini API endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Guardrails: Top 5 intents
const SYSTEM_PROMPT = `
You are CommerceCare, a support copilot.
Resolve only these 5 intents with clear, structured answers:
1) Order Tracking
2) Returns & Refunds
3) Payment Issues
4) Product Information
5) Account Support
If query is outside these, politely say you'll connect to a human agent.
Keep responses short, friendly, task-oriented.
`;

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "user", parts: [{ text: userMessage }] },
        ],
      }),
    });

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t process that.";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "⚠️ Server error." });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
