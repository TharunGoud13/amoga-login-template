"use server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const generateAIStory = async (aiPrompt: string, pugStory: string) => {
  try {
    const trimmedPugStory =
      pugStory.length > 4000 ? pugStory.slice(0, 4000) : pugStory;
    const trimmedAiPrompt =
      aiPrompt.length > 500 ? aiPrompt.slice(0, 500) : aiPrompt;

    console.log("trimmedPugStory-----", trimmedPugStory);
    console.log("trimmedAiPrompt-----", trimmedAiPrompt);
    // Create a dynamic system prompt based on user-provided aiPrompt
    const systemPrompt = `
      You are tasked with generating a detailed and engaging story based on the provided input story (pugStory) and user-entered prompt (aiPrompt).

      Requirements:
      - Use the pugStory to craft a narrative that aligns closely with the user prompt.
      - Ensure the output is detailed, creative, and fits the context described in the aiPrompt.
      - Maintain a professional and polished tone, adapting to the specific style or context suggested by the aiPrompt.
      - Use all relevant details from pugStory to create a cohesive and engaging narrative.

      Example Format:
      If the pugStory describes product sales and the aiPrompt asks for a marketing pitch, structure the story to highlight the success of the products in a promotional tone.
      
      If the pugStory discusses order details and the aiPrompt requests a customer satisfaction story, focus on how the products met or exceeded expectations.

      Inputs:
      1. Pug Story:
         "${pugStory}"

      2. User Prompt:
         "${aiPrompt}"

      Task:
      Generate a detailed story that reflects the context of the aiPrompt while utilizing the details from the pugStory.
    `;

    // Generate the story using the AI model
    const result = await generateObject({
      model: openai("gpt-3.5-turbo"),
      system: systemPrompt,
      prompt: "Create a detailed story based on the inputs.",
      schema: z.object({
        story: z.string(),
      }),
    });

    const story = result.object.story.trim();
    return story;
  } catch (err) {
    console.error(`Failed to generate story: ${err}`);
    throw err;
  }
};
