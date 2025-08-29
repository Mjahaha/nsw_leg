"use client";
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';

export default function MainUserTextbox({ submitStageOneFunction, submitStageTwoFunction, question, setQuestion, addStageTwoResponseForLegislation, legislationList, stageTwoCommenced }) {
  const [loading, setLoading] = useState(false);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && question.trim() !== "") {
      setLoading(true);
      try {
        const data = await submitStageOneFunction(question);
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
        className={`px-4 py-2 rounded-xl w-120 h-15 my-6 
        ${stageTwoCommenced 
          ? "bg-gray-800 text-gray-400 border-gray-700 cursor-not-allowed opacity-70" 
          : "px-4 py-2 border border-gray-300 rounded-xl w-120 h-15 my-6 text-lightgray-800"
        }`}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        animate={{ scale: stageTwoCommenced ? 0.95 : 1, opacity: stageTwoCommenced ? 0.7 : 1 }}
        transition={{ duration: 0.4 }}
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
        className={legislationList.length > 0 && !stageTwoCommenced? 
        "ml-8 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition" :
        "hidden"}
        onClick={ async () => {
            try {
              const responseArray = await submitStageTwoFunction(question, legislationList);
              responseArray.forEach(response => {
                addStageTwoResponseForLegislation(response.legislationKey, response.response);
              });
              console.log("MainUserTextBoxComponent has stage two response in front end:", responseArray);
              console.log("Legislation list updated with stage two responses:", legislationList);
            } catch (err) {
              console.error("MainUserTextBoxComponent has an error occurred while processing stage two request:", err);
            }
          }
        }
      >
        Proceed →
      </button>

    </div>
  );
}
