import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

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
    const [optimizedOut, ...rest] = data.text.split("2. ");
    setOptimized(optimizedOut.replace("1. ", "").trim());
    setExplanation(rest.join("").trim());
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#0e0e0e] to-[#121212] min-h-screen text-white p-6 font-sans">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-center mb-2 text-orange-400 tracking-tight">
        PromptWise <span className="text-pink-400">🧠</span>
      </h1>
      <p className="text-center text-gray-400 mb-10">
        Refine prompts using insights from multiple AI models.
      </p>

      {/* Card */}
      <div className="max-w-3xl mx-auto bg-[#1b1b1b] rounded-lg overflow-hidden shadow-lg">
        {/* Orange top bar */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-4">
          <h2 className="text-lg font-bold">Enter Your Prompt</h2>
          <p className="text-sm text-white/80">Let multiple AIs refine it!</p>
        </div>

        <div className="p-6">
          <textarea
            className="w-full p-4 rounded-md bg-[#121212] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:italic"
            rows={4}
            placeholder='e.g., "Create a workout plan for a beginner."'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={askLLM}
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:brightness-110 transition disabled:opacity-50"
          >
            <ArrowRightIcon className="h-4 w-4" />
            {loading ? "Refining..." : "Refine Prompt"}
          </button>
        </div>
      </div>

      {/* Output */}
      {(optimized || explanation) && (
        <motion.div
          className="max-w-3xl mx-auto mt-10 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {optimized && (
            <div className="bg-[#1b1b1b] p-5 rounded-md border-l-4 border-orange-500">
              <h3 className="text-lg font-semibold mb-2 text-orange-300">✏️ Optimized Prompt</h3>
              <p className="text-gray-100 whitespace-pre-wrap">{optimized}</p>
            </div>
          )}

          {explanation && (
            <div className="bg-[#1b1b1b] p-5 rounded-md border-l-4 border-yellow-400">
              <h3 className="text-lg font-semibold mb-2 text-yellow-300">🧠 Explanation</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{explanation}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
