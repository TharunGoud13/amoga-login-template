import type {
  CoreAssistantMessage,
  CoreMessage,
  CoreToolMessage,
  Message,
  ToolInvocation,
} from "ai";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { js_beautify } from "js-beautify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sentenceCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const lowerCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
};

export const isNotEmpty = (value: string | undefined) =>
  value!.trim().length > 0;

export function formatJSXCode(code: string): string {
  return js_beautify(code, {
    indent_size: 2,
    indent_char: " ",
    max_preserve_newlines: 2,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: false,
    wrap_line_length: 0,
    comma_first: false,
    e4x: true,
    indent_empty_lines: false,
  });
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): any {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map(
          (toolInvocation: { toolCallId: any }) => {
            const toolResult = toolMessage.content.find(
              (tool: { toolCallId: any }) =>
                tool.toolCallId === toolInvocation.toolCallId
            );

            if (toolResult) {
              return {
                ...toolInvocation,
                state: "result",
                result: toolResult.result,
              };
            }

            return toolInvocation;
          }
        ),
      };
    }

    return message;
  });
}

export function sanitizeResponseMessages(
  messages: any
): Array<CoreToolMessage | CoreAssistantMessage> {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === "tool") {
      for (const content of message.content) {
        if (content.type === "tool-result") {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map(
    (message: { role: string; content: any[] }) => {
      if (message.role !== "assistant") return message;

      if (typeof message.content === "string") return message;

      const sanitizedContent: any = message.content.filter(
        (content: { type: string; toolCallId: string; text: string | any[] }) =>
          content.type === "tool-call"
            ? toolResultIds.includes(content.toolCallId)
            : content.type === "text"
            ? content.text.length > 0
            : true
      );

      return {
        ...message,
        content: sanitizedContent,
      };
    }
  );

  return messagesBySanitizedContent.filter(
    (message: { content: string | any[] }) => message.content.length > 0
  );
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === "result") {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation: { state: string; toolCallId: string }) =>
        toolInvocation.state === "result" ||
        toolResultIds.includes(toolInvocation.toolCallId)
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0)
  );
}
