import { main } from "../../../lib/stage_one";

export async function GET(req) {
  console.log("router running")
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  if (!query) return new Response(JSON.stringify({ error: "Missing query" }), { status: 400 });

  try {
    const candidates = await main(query);
    return new Response(JSON.stringify({ candidates }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
