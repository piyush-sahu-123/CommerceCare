export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

  const { message } = req.body;

  const SYSTEM_PROMPT = `
  You are CommerceCare, a support copilot.
  Resolve only these 5 intents:
  1) Order Tracking
  2) Returns & Refunds
  3) Payment Issues
  4) Product Information
  5) Account Support
  If query is outside these, politely say you'll connect to a human agent.
  Keep responses short, clear, task-oriented.
  `;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "user", parts: [{ text: message }] },
        ],
      }),
    });

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t process that.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "⚠️ Server error." });
  }
}
