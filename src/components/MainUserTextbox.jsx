"use client";
import { useState } from "react";
import { motion } from 'framer-motion';

export default function MainUserTextbox({ submitFunction, legislationList }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      setLoading(true);
      try {
        const data = await submitFunction(query);
        console.log("AI response:", data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-row items-center">
      <div>
      <input
        type="text"
        placeholder="Type your query..."
        className="px-4 py-2 border border-gray-300 rounded-xl w-120 h-15 my-6 text-lightgray-800"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      {loading && legislationList.length === 0 && (   
        <div className="flex justify-center items-center h-40">
          <motion.div
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </div>
      )}
      </div>
      <button 
        className={legislationList.length > 0 ? 
        "ml-8 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition" :
        "hidden"
        }
      >
        Proceed →
      </button>

    </div>
  );
}
