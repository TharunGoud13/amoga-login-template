import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request to extract the prompt.pp\
    const { prompt } = await request.json();

    // Call OpenAI’s Chat Completions API with stream enabled.
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use your OpenAI API key from environment variables.
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4", // or whichever model you prefer
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that can answer questions and help with tasks.",
            },
            { role: "user", content: prompt },
          ],
          stream: true, // Enable streaming
        }),
      }
    );

    // If OpenAI returns an error, forward the error message.
    if (!openaiResponse.ok) {
      const err = await openaiResponse.text();
      return new Response(err, { status: openaiResponse.status });
    }
    console.log("openaiResponse----", openaiResponse);
    // Return the streaming response directly to the client.
    return new Response(openaiResponse.body, {
      headers: {
        // The OpenAI API streams server-sent events.
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return new Response("Error fetching from OpenAI", { status: 500 });
  }
}
