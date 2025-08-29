import { processStageThreeRequest } from "../../../../lib/stageThree";

export async function POST(req) {
  console.log("Stage three route running");
  let question;
  let legislationList;

  // Validate request body 
  try {
    const body = await req.json(); 
    ({ question, legislationList } = body);

    // Handle response for missing params
    if (!question) {
      return new Response(JSON.stringify({ error: "Missing question" }), { status: 400 });
    }
    if (!legislationList || typeof legislationList !== 'object') {
      return new Response(JSON.stringify({ error: `Invalid legislationList = ${legislationList}` }), { status: 400 });
    }
    console.log("Params sent for stage three seem valid, passing them to backend.");
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
  }
  
  // Send the request to the stage three backend
  console.log("Stage three data appears valid for sending to")
  try {
    const response = await processStageThreeRequest(question, legislationList);
    console.log("Stage three response retrieved by route.");
    console.log(response);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error occurred while processing stage three request:", error);
    return new Response(JSON.stringify({ error: "Failed to process stage three request" }), { status: 500 });
  }
}

