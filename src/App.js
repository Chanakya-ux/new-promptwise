import React, { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [optimized, setOptimized] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const askLLM = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOptimized("");
    setExplanation("");

    const systemPrompt = `
You are an expert prompt engineer. Your task is to improve the following prompt to generate the most detailed, controversial, or practical response possible from an advanced LLM (like ChatGPT, Claude, or Gemini). The optimized version should enhance clarity, specificity, and depth while retaining the original intent.

Original Prompt:
"${prompt}"

Please return:

1. The optimized version of the prompt.

2. A brief explanation of what changes you made and why.
`;

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: systemPrompt }),
    });

    const data = await res.json();

    // Simple parsing
    const [optimizedOut, ...rest] = data.text.split("2. ");
    setOptimized(optimizedOut.replace("1. ", "").trim());
    setExplanation(rest.join("").trim());
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">🎯 Prompt Engineer Assistant</h1>

      <div className="max-w-3xl mx-auto">
        <textarea
          className="w-full p-4 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
          placeholder="Enter your raw prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={askLLM}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white mt-4 transition disabled:opacity-50"
        >
          {loading ? "Optimizing..." : "Optimize Prompt"}
        </button>

        {(optimized || explanation) && (
          <motion.div
            className="mt-8 space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {optimized && (
              <div className="bg-gray-800 p-4 rounded-md border border-green-600">
                <h2 className="text-lg font-semibold mb-2">✏️ Optimized Prompt</h2>
                <p className="text-gray-100 whitespace-pre-wrap">{optimized}</p>
              </div>
            )}

            {explanation && (
              <div className="bg-gray-800 p-4 rounded-md border border-yellow-600">
                <h2 className="text-lg font-semibold mb-2">🧠 Explanation</h2>
                <p className="text-gray-300 whitespace-pre-wrap">{explanation}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
