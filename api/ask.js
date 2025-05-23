export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  const payload = {
    model: "mistralai/mistral-7b-instruct",
    messages: [
      { role: "user", content: prompt }
    ]
  };
  if (!apiKey) {
    console.error("❌ No OPENROUTER_API_KEY set");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response from model";

    res.status(200).json({ text: reply });

  } catch (err) {
    console.error("OpenRouter API error:", err);
    res.status(500).json({ text: "Failed to contact OpenRouter" });
  }
}
