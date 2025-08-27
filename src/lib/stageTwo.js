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

// Load legislation text from file for prompt generation 
const getLegislationText = (legislationKey) => {
  try {
    let legislationText = fs.readFileSync(
      `src/app/data/buildingLegislation/${legislationKey}.txt`,
      "utf8"
    );
    return legislationText;
  }
  catch (error) {
    console.error("Error reading legislation file:", error);
    return null;
  }
};


// Building the prompt for us to ask our questions about the legislation
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


// Function to call the Gemini API and send the prompt 
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

    // Usually there is only one part, but just in case, idk
    const text = result.candidates[0].content.parts.map(p => p.text).join("\n");
    console.log("\n=== Drilled AI Text ===");
    console.log(text);

    return text;

  } catch (error) {
    console.error("Error during API call:", error);
  }
};


// Function to process all stage two requests
export const processStageOneRequest = async (question, legislationKeyArray) => {
  let allResponses = [];
  console.log("Processing Stage Two Request... commenced");

  // Make a call for each legislation called
  legislationKeyArray.map(async (legislationKey) => {
    let legislationText = getLegislationText(legislationKey);                           // Get legislation full text
    if (!legislationText) { return `No legislation text found for ${legislationKey}` }  // Error handling if none
    let prompt = buildLegislationPrompt(question, legislationText);                     // Build prompt
    let response = await stageTwoAPICall(prompt);                                       // Call AI API
    allResponses.push({ legislationKey, response });                                    // Save results
  });

  return allResponses;
};


// An example to call the API
const legislationArrayForExample = ["gasAndElectricityConsumerSafetyRegs", "plumbingDrainageRegulation"];
const questionForExample = "What are the safety requirements for gas ovens?";
const stageTwoExampleResults = await processStageOneRequest(questionForExample, legislationArrayForExample);
stageTwoExampleResults.map(result => {
  console.log(`\n=== Results for ${result.legislationKey} ===`);
  console.log(result.response);
});


