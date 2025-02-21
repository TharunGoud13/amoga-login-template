import { myProvider } from "@/lib/vercel-ai/ai/models";
import { sheetPrompt, updateDocumentPrompt } from "@/lib/vercel-ai/ai/prompts";
import { createDocumentHandler } from "@/lib/vercel-ai/artifacts/server";
import { streamObject } from "ai";
import { z } from "zod";

export const sheetDocumentHandler = createDocumentHandler<"sheet">({
  kind: "sheet",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const { fullStream } = streamObject({
      model: myProvider.languageModel("artifact-model"),
      system: sheetPrompt,
      prompt: title,
      schema: z.object({
        csv: z.string().describe("CSV data"),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { csv } = object;

        if (csv) {
          dataStream.writeData({
            type: "sheet-delta",
            content: csv,
          });

          draftContent = csv;
        }
      }
    }

    dataStream.writeData({
      type: "sheet-delta",
      content: draftContent,
    });

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";

    const { fullStream } = streamObject({
      model: myProvider.languageModel("artifact-model"),
      system: updateDocumentPrompt(document.content, "sheet"),
      prompt: description,
      schema: z.object({
        csv: z.string(),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { csv } = object;

        if (csv) {
          dataStream.writeData({
            type: "sheet-delta",
            content: csv,
          });

          draftContent = csv;
        }
      }
    }

    return draftContent;
  },
});
