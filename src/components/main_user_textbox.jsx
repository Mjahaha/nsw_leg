"use client";
import { useState } from "react";

export default function MainUserTextbox() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      setLoading(true);
      try {
        const res = await fetch(`/api/legislation?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        console.log("AI response:", data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setQuery("");
      }
    }
  };

  return (
    <input
      type="text"
      placeholder="Type your query..."
      className="px-4 py-2 border border-gray-300 rounded-xl w-120 h-15 mt-6 text-lightgray-800"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={loading}
    />
  );
}
