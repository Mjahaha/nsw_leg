import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { type } from "os";
import { act } from "react";

// Load .env file
dotenv.config();
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
});

// Listing acts and codes to explore 
// We can easily add to this list and the code will update the prompt and structured output
const acts = [
  { 
    act_name: "Gas and Electricity (Consumer Safety) Act 2017", 
    key_name: "gasAndElectricityConsumerSafetyAct"
  },
  { 
    act_name: "Gas and Electricity (Consumer Safety) Regulation 2018", 
    key_name: "gasAndElectricityConsumerSafetyRegulation"
  },
  { 
    act_name: "Plumbing and Drainage Act 2011", 
    key_name: "plumbingDrainageAct"
  },
  { 
    act_name: "Plumbing and Drainage Regulation 2023", 
    key_name: "plumbingDrainageRegulation"
  },
  { 
    act_name: "National Construction Code – Building Code of Australia (BCA)", 
    key_name: "nationalConstructionCodeBCA"
  },
  { 
    act_name: "National Construction Code – Plumbing Code of Australia (PCA)", 
    key_name: "nationalConstructionCodePCA"
  },
  { 
    act_name: "AS/NZS 3000:2018 Wiring Rules", 
    key_name: "asNz3000WiringRules"
  },
  { 
    act_name: "AS/NZS 3500 Plumbing and Drainage Standards", 
    key_name: "asNz3500PlumbingDrainage"
  },
  { 
    act_name: "NSW Service and Installation Rules", 
    key_name: "nswServiceInstallationRules"
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

You are checking which NSW Acts or Codes are likely relevant to the following question: 
"I want to install a powerpoint outside the house".

Instructions:
- Base your reasoning on the most common or likely interpretation of what the user is doing.
- If the question is ambiguous as to what the user is doing, briefly consider other reasonable interpretations before deciding.
- Be conservative: assume Acts apply only when there is a clear and probable link. Do not assume rare or unusual scenarios.

Acts to check:
1. Electricity (Consumer Safety) Act 2004 (NSW)
2. Electricity (Consumer Safety) Regulation 2015 (NSW)
3. Plumbing and Drainage Act 2011 (NSW)
4. Plumbing and Drainage Regulation 2023 (NSW)
5. National Construction Code – Building Code of Australia (BCA) (NSW)
6. National Construction Code – Plumbing Code of Australia (PCA) (NSW)
7. AS/NZS 3000:2018 Wiring Rules (NSW)
8. AS/NZS 3500 Plumbing and Drainage Standards (NSW)
9. NSW Service and Installation Rules (NSW)

For each Act, return:
- applies: boolean (true only if it is clearly or very likely relevant)
- comment: short explanation why it does or does not apply

Respond ONLY as valid JSON, matching EXACTLY the following schema:
{
"electricityConsumerSafetyAct": { "applies": boolean, "comment": string },
"electricityConsumerSafetyRegulation": { "applies": boolean, "comment": string },
"plumbingDrainageAct": { "applies": boolean, "comment": string },
"plumbingDrainageRegulation": { "applies": boolean, "comment": string },
"nationalConstructionCodeBCA": { "applies": boolean, "comment": string },
"nationalConstructionCodePCA": { "applies": boolean, "comment": string },
"asNz3000WiringRules": { "applies": boolean, "comment": string },
"asNz3500PlumbingDrainage": { "applies": boolean, "comment": string },
"nswServiceInstallationRules": { "applies": boolean, "comment": string }
}

*/

// Prompt builder
const ai_prompt = (question) => {
  const prompt = `
You are checking which NSW Acts or Codes are likely relevant to the following question: "${question}".

Instructions:
- Base your reasoning on the most common or likely interpretation of what the user is doing.  
- If the question is ambiguous as to what the user is doing, briefly consider other reasonable interpretations before deciding.  
- Be conservative: assume Acts apply only when there is a clear and probable link. Do not assume rare or unusual scenarios.  

Acts to check:
${acts_ordered_list.join("\n")}

For each Act, return:
- applies: boolean (true only if it is clearly or very likely relevant)  
- comment: short explanation why it does or does not apply  

Respond ONLY as valid JSON, matching EXACTLY the following schema:
${acts_response_schema(acts)}\n
`;
  console.log("AI Prompt:\n" + prompt);
  return prompt;
};



// Call main API function to query AI our prompt and return a structured output result 
const stage_one_api_call = async (question) => {
  console.log("Calling AI with question:", question);
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
  //console.dir(result.candidates, { depth: null }); // shows full object
  return result.candidates[0].content.parts[0].text; // Return the first candidate's response
};


// Clean and return ai output 
export const main = async (question) => {
  // Cleaning data to prepare final output
  let aiStageOneOutput = await stage_one_api_call(question);
  aiStageOneOutput = aiStageOneOutput.replace(/```json|```/g, "").trim();  
  const parsed = JSON.parse(aiStageOneOutput); 
  //console.log("Parsed AI output:\n" + JSON.stringify(parsed, null, 2));
  const legislationsReturned = Object.keys(parsed);
  //console.log("Legislation array returned:\n" + legislationsReturned.join(", "));
  
  // Transform output to array with all options
  const finalArrayOutput = [];
  
  legislationsReturned.map(legislationKeyName => {
    const actObj = acts.find(a => a.key_name === legislationKeyName);
    const legislationFullName = actObj.act_name;
    finalArrayOutput.push({
      id: legislationKeyName,
      name: legislationFullName,
      applies: parsed[legislationKeyName].applies,
      comment: parsed[legislationKeyName].comment
    });
  })

  //console.log("Final array output:\n" + JSON.stringify(finalArrayOutput, null, 2));
  return finalArrayOutput;
}

//const example_question ="I'm building a sewerage treatment plant, what do I need to consider?";
