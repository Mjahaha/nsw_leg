import { processStageTwoRequest } from "../../../../lib/stageTwo";

export async function POST(req) {
  console.log("Stage two route running");
  let question;
  let legislationKeyArray;

  // Validate request body 
  try {
    const body = await req.json(); 
    ({ question, legislationKeyArray } = body);

    // Handle response for missing params
    if (!question) {
      return new Response(JSON.stringify({ error: "Missing question" }), { status: 400 });
    }
    if (!legislationKeyArray || typeof legislationKeyArray !== 'object') {
      return new Response(JSON.stringify({ error: `Invalid legislationKeyArray = ${legislationKeyArray}` }), { status: 400 });
    }
    console.log("Params sent for stage two seem valid, passing them to backend.");
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
  }
  

  // Send the request to the stage two backend
  try {
    const response = await processStageTwoRequest(question, legislationKeyArray);
    console.log("Stage two response retrieved by route.");
    //console.log(response);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error occurred while processing stage two request:", error);
    return new Response(JSON.stringify({ error: "Failed to process stage two request" }), { status: 500 });
  }
}

/*

export async function POST(req) {
  console.log("Stage two route running (STATIC MOCK MODE)");

  // Static response for testing 
  const mockResponse = [
    {
      legislationKey: "plumbingDrainageAct",
      response: `Here's an analysis of your question based on the provided legislation:

**1. User's Intent:**
The user wants to modify their home's rainwater gutter system to redirect the collected water onto their lawn. The primary goal is to use this rainwater for irrigation, potentially improving lawn watering efficiency.

**2. Legislation Review and Requirements:**
After carefully reviewing the entire legislation text, the proposed work on gutters to drain onto a lawn does not fall under the definition of "plumbing and drainage work" as described in this Act. Specifically, Section 4(5)(a) excludes work on stormwater pipes.

**No relevant requirements found.**

... (trimmed for sanity, keep full if needed)
      `,
    },
    {
      legislationKey: "plumbingDrainageRegulation",
      response: `Here's a breakdown of the legislation's applicability to your question:

**1. User's Intent:**
The user intends to modify their existing gutter downspouts to redirect rainwater directly onto their lawn, primarily for the purpose of watering the lawn.

**2. Review of Legislation Text:**
After carefully reviewing the entire "Plumbing and Drainage Regulation 2017" text provided... 

**No relevant requirements found in this Regulation.**
      `,
    },
    {
      legislationKey: "asNz3000WiringRules",
      response: "No legislation text found for asNz3000WiringRules",
    },
  ];

  return new Response(JSON.stringify(mockResponse), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
*/