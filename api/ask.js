export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const modifiedPrompt = `Act like a helpful AI assistant. Answer precisely. User asked: ${prompt}`;

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: modifiedPrompt }] }]
    }),
  });

  const data = await response.json();
  res.status(200).json({ text: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response" });
}
