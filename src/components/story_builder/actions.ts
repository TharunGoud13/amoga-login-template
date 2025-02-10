"use server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const generateTemplate = async (dataModel: any, userPrompt: string) => {
  try {
    // Sample templates for reference
    const sampleTemplates = `
    Examples:

    1. Input Fields:
       {
         "product_name": "string",
         "order_total": "number",
         "total": "number"
       }
       User Prompt: "Generate a Pug template for this."
       Output Template:
       p | The order includes #{product_name} and its price is #{order_total}.
       p | The total value of all items are #{total}.
       p | The product #{product_name} price is #{order_total}.

    2. Input Fields:
       {
         "order_id": "number",
         "created_date": "string",
         "product_quantity": "number",
         "product_name": "string",
         "sku": "string",
         "currency": "string",
         "product_base_price": "number",
         "product_total": "number",
         "partial_refund_amount": "number",
         "transaction_id": "string",
         "customer_id": "number",
         "payment_method": "string",
         "order_paid_date": "string",
         "shipping_country": "string",
         "shipping_company": "string",
         "order_notes": "string",
         "order_status": "string",
         "tax_total": "number",
         "order_total": "number",
         "email": "string",
         "phone": "string",
         "billing_postcode": "string"
       }
       User Prompt: "Generate a detailed order summary template."
       Output Template:
       p | Order # #{order_id} was placed on #{created_date}.
       p | The order includes #{product_quantity} unit(s) of #{product_name} (SKU: #{sku}), priced at #{currency}#{product_base_price} each, totaling #{currency}#{product_total}.
       if partial_refund_amount > 0
         p | A partial refund of #{currency}#{partial_refund_amount} was issued for this order.
       p | The transaction ID for this order is #{transaction_id}.
       p | The customer (ID: #{customer_id}) completed the payment via #{payment_method} on #{order_paid_date}.
       p | The order was shipped to #{shipping_country} via #{shipping_company}.
       if order_notes != ""
         p | Special Notes: #{order_notes}.
       p | The order status is #{order_status}.
       p | The total order value, including taxes (#{currency}#{tax_total}), was #{currency}#{order_total}.
       p | Customer contact: Email - #{email}, Phone - #{phone}.
       p | Billing postcode: #{billing_postcode}.
    `;

    // Dynamically generate the system prompt
    const systemPrompt = `
      You are tasked with generating a Pug template based on a user-provided prompt and a list of fields with types. Use the examples below as references to format the output dynamically. The placeholders for fields should be written as #{field_name}.
      
      ${sampleTemplates}
      
      Task:
      Given the following:
      1. A dataModel object with field_name and field_type.
      2. A user-provided prompt.

      Generate a Pug template dynamically, following the format and examples above. Ensure that:
      - All fields in the dataModel are utilized.
      - Conditional logic (e.g., if field_name > 0 or if field_name != "") is included for applicable fields based on their type.

      Input Example:
      {
        "dataModel": ${JSON.stringify(dataModel, null, 2)},
        "prompt": "${userPrompt}"
      }

      Expected Output:
      A valid Pug template that uses the fields in dataModel to match the user's prompt.
    `;

    // Call AI model to generate the template
    const result = await generateObject({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `Generate a Pug template with the above providing template samples based on user prompt ${userPrompt}`,
      schema: z.object({
        template: z.string(),
      }),
    });

    const template = result.object.template.trim();

    return template;
  } catch (err) {
    console.error(`Failed to generate template: ${err}`);
    throw err;
  }
};
