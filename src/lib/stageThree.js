import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load .env file
dotenv.config();
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
});

// Retrieve an array of all the stage two responses for the prompt
const getStageTwoResponsesArray = (legislationList) => {
    let stageTwoResponseArray = []
    legislationList.map((legislation) => stageTwoResponseArray.push(legislation.stageTwoResponse));
    return stageTwoResponseArray;
}

// Building the prompt to consolidate answers from stage two into a summary
const buildSummaryPrompt = (question, stageTwoResponses) => {
  return `
You are a careful legal analysis assistant. Your job now is to refine and consolidate multiple prior analyses into a single, clear response for the user.

User Question:
"${question}"

Instructions:
1. Review the following prior answers, each of which analysed a different piece of legislation:
""" 
${stageTwoResponses.join("\n\n---\n\n")}
"""
2. Identify and merge overlapping or duplicate requirements across legislations.  
3. Remove unnecessary repetition, but preserve any unique and important requirements.  
4. Present the consolidated response in clear plain language, structured by topic or obligation.  
5. Where helpful, quote **key phrases verbatim** from the legislation to preserve accuracy.  
6. Conclude with a brief summary of the most important things the user should know.  

Your output should be a single, user-friendly answer that captures all relevant obligations without overwhelming the user.
  `;
}


// Function to process all stage three requests 
export const processStageThreeRequest = async (question, legislationList) => {
    console.log("Running gemini call for Stage Three, start");
    const stageTwoResponseArray = getStageTwoResponsesArray(legislationList);
    const prompt = buildSummaryPrompt(question, stageTwoResponseArray);
    try {
        const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        safetySettings: [
            {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
            },
            {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
            },
            {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
            },
            {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
            },
        ],
        contents: [
            { role: "user", text: prompt }
        ]
        });

        // Usually there is only one part, but just in case, idk
        const text = result.candidates[0].content.parts.map(p => p.text).join("\n");
        console.log("\n=== Summary AI Text ===");
        console.log(text);

        return text;

    } catch (error) {
        console.error("Error during API call:", error);
        return "Error";
    }
}