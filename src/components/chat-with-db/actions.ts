"use server";

import { Config, configSchema, Result } from "@/lib/types";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { Client } from "pg";
import { z } from "zod";

export const generateQuery = async (input: string) => {
  "use server";
  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      system: `You are a SQL (Postgres) and data visualization expert. Your job is to help the user write a SQL query to retrieve the data they need. The table schema is as follows:

      user_catalog (
        user_catalog_id SERIAL PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL UNIQUE,
        user_mobile VARCHAR(255) NOT NULL UNIQUE,
        user_name VARCHAR(255) NOT NULL,
      );

     The queries should be dynamic and retrieve data based on the user's request. For instance:
      - If the user asks for users, generate a query to retrieve user_name or user_email or both.
      - If the user requests mobile numbers, generate a query to retrieve user_mobile.
      - The query must return meaningful data in a form suitable for chart visualization.

      Every query must be a SELECT statement and only retrieval queries are allowed.

      When querying by string fields (like user_name, user_email, user_mobile), use the ILIKE operator and convert both the search term and the field to lowercase using the LOWER() function. For example: LOWER(user_name) ILIKE LOWER('%search_term%').
    `,
      prompt: `Generate the query necessary to retrieve the data the user wants: ${input}`,
      schema: z.object({
        query: z.string(),
      }),
    });
    return result.object.query;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to generate query");
  }
};

export const runGenerateSQLQuery = async (query: string) => {
  "use server";
  if (
    !query.trim().toLowerCase().startsWith("select") ||
    query.trim().toLowerCase().includes("drop") ||
    query.trim().toLowerCase().includes("delete") ||
    query.trim().toLowerCase().includes("insert") ||
    query.trim().toLowerCase().includes("update") ||
    query.trim().toLowerCase().includes("alter") ||
    query.trim().toLowerCase().includes("truncate") ||
    query.trim().toLowerCase().includes("create") ||
    query.trim().toLowerCase().includes("grant") ||
    query.trim().toLowerCase().includes("revoke")
  ) {
    throw new Error("Only SELECT queries are allowed");
  }

  let data: any;
  try {
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
    });
    await client.connect();
    data = await client.query(query);
    console.log("data----", data);
    await client.end();
  } catch (e: any) {
    console.error("Error message:", e.message);
    console.error("Error stack:", e.stack);
    if (e.message.includes('relation "user_catalog" does not exist')) {
      console.log(
        "Table does not exist, creating and seeding it with dummy data now..."
      );
      throw Error("Table does not exist");
    } else {
      throw e;
    }
  }

  return data.rows as Result[];
};

export const generateChartConfig = async (
  results: Result[],
  userQuery: string
) => {
  "use server";
  const system = `You are a data visualization expert. `;

  try {
    const { object: config } = await generateObject({
      model: openai("gpt-4o"),
      system,
      prompt: `Given the following data from a SQL query result, generate the chart config that best visualizes the data and answers the user's query.
      Use appropriate chart types such as bar, line, or pie depending on the data.

      Here is an example complete config:
      export const chartConfig = {
        type: "bar",
        xKey: "country",
        yKeys: ["user_count"],
        colors: {
          user_count: "#4CAF50" // Green for user count
        },
        legend: true
      }

      User Query:
      ${userQuery}

      Data:
      ${JSON.stringify(results, null, 2)}`,
      schema: configSchema,
    });

    const colors: Record<string, string> = {};
    config.yKeys.forEach((key, index) => {
      colors[key] = `hsl(var(--chart-${index + 1}))`;
    });

    const updatedConfig: Config = { ...config, colors };
    return { config: updatedConfig };
  } catch (e) {
    console.error((e as Error).message);
    throw new Error("Failed to generate chart suggestion");
  }
};
