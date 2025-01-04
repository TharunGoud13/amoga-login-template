"use server";

import { Config, configSchema, Result } from "@/lib/types";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { Client } from "pg";
import { z } from "zod";

export const generateQuery = async (input: string, session: any) => {
  "use server";
  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      system: `You are a SQL (Postgres) and data visualization expert. Your job is to help the user write a SQL query to retrieve the data they need and provide query based on user session details. The table schemas are as follows:

      user_catalog (
        user_catalog_id SERIAL PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL UNIQUE,
        user_mobile VARCHAR(255) NOT NULL UNIQUE
      );

      order_sample (
        order_id INTEGER,
        created_date TIMESTAMP,
        product_id INTEGER,
        product_name VARCHAR(255),
        sku VARCHAR(50),
        product_quantity INTEGER,
        product_base_price VARCHAR(50),
        product_total VARCHAR(50),
        partial_refund_amount TEXT,
        transaction_id TEXT,
        customer_id INTEGER,
        order_paid_date TIMESTAMP,
        order_notes TEXT,
        order_status VARCHAR(50),
        currency VARCHAR(3),
        tax_total VARCHAR(50),
        order_total VARCHAR(50),
        payment_method VARCHAR(100),
        billing_postcode VARCHAR(20),
        shipping_country VARCHAR(2),
        shipping_company VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        customer VARCHAR(255),
      );

      The queries should be dynamic and retrieve data based on the user's request. If the user asks about orders or customer or products, the query should be based on the order_sample table.

      The query must return meaningful data in a form suitable for chart visualization. Every query must be a SELECT statement and only retrieval queries are allowed.

      When querying by string fields (like user_name, user_email, user_mobile, or product_name), use the ILIKE operator and convert both the search term and the field to lowercase using the LOWER() function. For example: LOWER(user_name) ILIKE LOWER('%search_term%').

      For date-based queries (e.g., year 2024), use EXTRACT(YEAR FROM date_field)::INTEGER for comparing years:
      Example: EXTRACT(YEAR FROM created_date)::INTEGER = 2024

      If the user asks for company details like Give me top 10 orders for a company then note that company names are in customer field

      If a numeric field like 'product_total' is stored as VARCHAR, the query should use REGEXP_REPLACE to clean it and cast it to DECIMAL for proper calculations.`,
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
  // Basic SQL injection prevention with better whitespace handling
  const sanitizedQuery = query.replace(/\s+/g, " ").trim().toLowerCase();
  console.log("Sanitized query:", sanitizedQuery);

  // Improved validation
  if (!sanitizedQuery.split(" ")[0].includes("select")) {
    throw new Error("Query must start with SELECT");
  }

  // Check for dangerous keywords with word boundaries
  const dangerousKeywords = [
    "drop",
    "delete",
    "insert",
    "update",
    "alter",
    "truncate",
    "create",
    "grant",
    "revoke",
  ];
  const containsDangerousKeywords = dangerousKeywords.some((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    return regex.test(sanitizedQuery);
  });

  if (containsDangerousKeywords) {
    throw new Error("Query contains unauthorized operations");
  }

  let data: any;
  try {
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
    });
    await client.connect();

    // Handle date-based queries
    let processedQuery = query;
    if (
      sanitizedQuery.includes("created_date") ||
      sanitizedQuery.includes("order_paid_date")
    ) {
      console.log("Date-based query detected");

      // Try both EXTRACT and TO_CHAR formats
      try {
        if (sanitizedQuery.includes("to_char")) {
          processedQuery = query.replace(
            /TO_CHAR\(\s*(created_date|order_paid_date)\s*,\s*'YYYY'\s*\)\s*=\s*'(\d{4})'/gi,
            "EXTRACT(YEAR FROM $1)::INTEGER = $2"
          );
        }
        console.log("Processed query:", processedQuery);
      } catch (e) {
        console.error("Error processing date query:", e);
        // Continue with original query if conversion fails
        processedQuery = query;
      }
    }

    data = await client.query(processedQuery);
    console.log("Query executed successfully");
    await client.end();
  } catch (e: any) {
    console.error("Database error:", e.message);
    if (e.message.includes('relation "order_sample" does not exist')) {
      throw new Error("Table does not exist");
    }
    throw new Error(`Database error: ${e.message}`);
  }

  return data.rows as Result[];
};

export const generateChartConfig = async (
  results: Result[],
  userQuery: string
) => {
  "use server";
  const system = `You are a data visualization expert.`;

  try {
    const { object: config } = await generateObject({
      model: openai("gpt-4o"),
      system,
      prompt: `Given the following data from a SQL query result, generate the chart config that best visualizes the data and answers the user's query.
      Use appropriate chart types such as bar, line, bar horizontal, or pie or "Data Card Text",
    "Data Card Line Chart",
    "Data Card Bar Chart",
    "Data Card Bar Chart Horizontal",
    "Data Card Donut Chart", depending on the data.

      Here is an example complete config:
      export const chartConfig = {
       
        xKey: "country",
        yKeys: ["user_count"],
        colors: {
          user_count: "#4CAF50"
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
