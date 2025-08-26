import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

// Load .env file
dotenv.config();
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
});


let legislationText = fs.readFileSync(
  "src/app/data/buildingLegislation/gasAndElectricityConsumerSafetyRegs.txt",
  "utf8"
);
console.log("File content loaded.");

//legislationText = "[Pretend there is text to some generic legislation here]"

function buildLegislationPrompt(question, legislationText) {
  return `
You are a careful legal analysis assistant. Your job is to read the legislation provided and check if it imposes any requirements based on the user's question.

User Question:
"${question}"

Instructions:
1. Infer what the user is trying to do. If ambiguous, list up to five possible interpretations of their intent.  
2. Carefully review the entire legislation text below.  
3. For each section that applies, copy the **verbatim text** of the requirement.  
4. Under each excerpt, explain in plain language why this section is relevant to the user’s question.  
5. If multiple sections apply, repeat the process until all relevant sections are covered.  
6. If nothing applies, clearly state "No relevant requirements found."

Legislation Text:
""" 
${legislationText}
"""
  `;
}


const stageTwoAPICall = async (prompt) => {
  console.log("running gemini call, start");
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

    console.log("=== Full Response Object ===");
    console.dir(result, { depth: null });

    const candidate = result.candidates?.[0];
    if (!candidate) {
      console.log("No candidates returned!");
      return;
    }

    console.log("\n=== Candidates Array ===");
    console.dir(result.candidates, { depth: null });

    console.log("\n=== First Candidate Content Keys ===");
    console.log(Object.keys(candidate.content));

    // Often the text is inside candidate.content[0].text or candidate.content.parts[0].text
    let text;
    if (Array.isArray(candidate.content)) {
      text = candidate.content.map(p => p.text).join("\n");
    } else if (candidate.content?.parts) {
      text = candidate.content.parts.map(p => p.text).join("\n");
    } else if (candidate.content?.text) {
      text = candidate.content.text;
    }

    console.log("\n=== Drilled AI Text ===");
    console.log(text);

    return text;

  } catch (error) {
    console.error("Error during API call:", error);
  }
};


// Call the API
const examplePrompt = buildLegislationPrompt("What are the safety requirements for gas ovens?", legislationText);  
stageTwoAPICall(examplePrompt);
