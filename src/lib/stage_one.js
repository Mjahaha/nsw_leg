import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { type } from "os";

// Load .env file
dotenv.config();
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
});

// Listing acts to explore 
// We can easily add to this list and the code will update the prompt and structured output
const acts = [
  { 
    act_name: "Environmental Planning and Assessment Act 1979", 
    key_name: "environmentalPlanningAssessmentAct"
  },
  { 
    act_name: "Biodiversity Conservation Act 2016", 
    key_name: "biodiversityConservationAct"
  },
  { 
    act_name: "Protection of the Environment Operations Act 1997", 
    key_name: "protectionOfEnvironmentOperationsAct"
  },
  {
    act_name: "Pesticides Act 1999",
    key_name: "pesticidesAct"
  }
];


// Generate act ordered list for ai prompt 
const acts_ordered_list = acts.map((act, i=0) => { 
  return `${i + 1}. ${act.act_name} (NSW)`
})
//console.log("Acts ordered list for prompt:\n" + acts_ordered_list.join("\n"), "\n");


// Generate a response schema to show what we want back in the prompt 
const acts_response_schema = act => {
  const helper_array = [];
  acts.map(act => {
    helper_array.push(`"${act.key_name}": { "applies": boolean, "comment": string }`);
  });
  const final_result = `{\n${helper_array.join(",\n")}\n}`;
  return final_result;
};
//console.log("Acts response schema for prompt:\n" + acts_response_schema(acts), "\n");


// Generate 'Structured Output' for the AI, to add into responseSchema.properties 
const acts_structured_output_function = () => {
  const structured_output = {};
  acts.map( act => {
    structured_output[act.key_name] = {
      type: "object",
      properties: {
        applies: { type: "boolean" },
        comment: { type: "string" }
      },
      required: ["applies", "comment"]
    };
  });

  return structured_output;
};
//console.log("Acts structured output for response:\n" + JSON.stringify(acts_structured_output(), null, 2), "\n");


/*  -------   Example returned AI Prompt   --------

Given the question: "I'm building a sewerage treatment plant, what do I need to consider?",
return whether each of the following NSW Acts should be investigated further for relevance.
Acts:
1. Environmental Planning and Assessment Act 1979 (NSW)
2. Biodiversity Conservation Act 2016 (NSW)
3. Protection of the Environment Operations Act 1997 (NSW)

Responses to each Act should include:
- applies: boolean indicating if the Act applies
- comment: a brief explanation as to why the Act applies or does not apply

Respond ONLY as valid JSON, matching EXACTLY the following schema:
{
  "environmentalPlanningAssessmentAct": { "applies": boolean, "comment": string },
  "biodiversityConservationAct": { "applies": boolean, "comment": string },
  "protectionOfEnvironmentOperationsAct": { "applies": boolean, "comment": string }
}

*/

// Prompt builder
const ai_prompt = (question) => {
  const prompt = `
Given the question: "${question}", return whether each of the following NSW Acts should be investigated further for relevance.
Acts:
${acts_ordered_list.join("\n")}

Responses to each Act should include:
- applies: boolean indicating if the Act applies
- comment: a brief explanation as to why the Act applies or does not apply

Respond ONLY as valid JSON, matching EXACTLY the following schema:
${acts_response_schema(acts)}\n
`;
  return prompt;
};
console.log("AI Prompt:\n", ai_prompt("I'm building a sewerage treatment plant, what do I need to consider?"));


// Call main API function to query AI our prompt and return a structured output result 
export const main = async (question) => {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: ai_prompt(question) }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: acts_structured_output_function(),  // Call the function to generate structured output
        required: acts.map(act => act.key_name),        // Ensure all keys are required
      },
    },
  });

  // log results
  console.dir(result.candidates, { depth: null }); // shows full object
};

//const example_question ="I'm building a sewerage treatment plant, what do I need to consider?";
