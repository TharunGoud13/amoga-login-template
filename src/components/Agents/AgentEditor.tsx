"use client";
import {
  ArrowUp,
  Bookmark,
  Bot,
  Code,
  Copy,
  Edit,
  Eye,
  FileText,
  FileUp,
  History,
  Image,
  Loader2,
  Menu,
  Mic,
  Paperclip,
  Pencil,
  Plus,
  RefreshCcw,
  RefreshCw,
  Share2,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import SideBar from "./SideBar";
import { ScrollArea } from "../ui/scroll-area";
import { useSession } from "next-auth/react";
import { toast } from "../ui/use-toast";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { generateAIResponse } from "./actions";

const favoritePrompts = [
  { id: 1, text: "Explain quantum computing in simple terms" },
  { id: 2, text: "Write a poem about artificial intelligence" },
  { id: 3, text: "Describe the process of photosynthesis" },
  { id: 4, text: "Compare and contrast renewable energy sources" },
  { id: 5, text: "Outline the major events of World War II" },
];

const promptHistory = [
  { id: 1, text: "What are the benefits of meditation?", date: "2023-04-01" },
  { id: 2, text: "How does blockchain technology work?", date: "2023-04-02" },
  { id: 3, text: "Explain the theory of relativity", date: "2023-04-03" },
  {
    id: 4,
    text: "What are the main causes of climate change?",
    date: "2023-04-04",
  },
  {
    id: 5,
    text: "Describe the process of machine learning",
    date: "2023-04-05",
  },
];

const chatAgents = [
  { id: 1, text: "General Assistant", icon: Bot },
  { id: 2, text: "Code Helper", icon: Code },
  { id: 3, text: "Creative Writer", icon: Pencil },
  { id: 4, text: "Data Analyst", icon: FileText },
  { id: 5, text: "Image Creator", icon: Image },
];

const AgentEditor = () => {
  const suggestions = ["Chat with Data", "Chat with Doc"];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [openFavorites, setOpenFavorites] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;
    setIsLoading(true);

    setMessages((prev) => [...prev, { text: prompt, role: "user" }]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      // here we will get streaming response from response.body and it will be in chunks
      if (!response.body) throw new Error("No response body");

      // it is used to read the stream of data in chunks
      const reader = response.body.getReader();
      // it is used to convert the binary format data to string
      const decoder = new TextDecoder("utf-8");

      // it is used to check if the stream is done
      let done = false;
      // it is used to store the stream of data texts
      let buffer = "";
      // it is used to store the final response
      let aiResponse = "";

      // it is used to read the stream chunk by chunk.
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        // Append the newly received chunk (decoded to string) to our buffer.
        buffer += decoder.decode(value, { stream: true });

        // Split the buffer by newline to process each line.
        const lines = buffer.split("\n");
        // Process each complete line except the last (could be incomplete).
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();

          // Only process lines that start with "data:".
          if (line.startsWith("data:")) {
            const dataStr = line.replace(/^data:\s*/, "");

            // Check if the stream signals the end.
            if (dataStr === "[DONE]") {
              done = true;
              break;
            }

            try {
              // Parse the JSON data.
              const parsed = JSON.parse(dataStr);

              // Extract the 'content' from the delta if available.
              const delta = parsed.choices?.[0]?.delta;
              if (delta && delta.content) {
                aiResponse += delta.content;

                // Update the assistant message incrementally.
                setMessages((prev) => {
                  // Keep all previous messages except the last one if it's from assistant
                  const messages = [...prev];
                  if (
                    messages.length > 0 &&
                    messages[messages.length - 1].role === "assistant"
                  ) {
                    messages.pop(); // Remove last assistant message
                  }
                  return [...messages, { text: aiResponse, role: "assistant" }];
                });
              }
            } catch (err) {
              console.error("Error parsing SSE data:", err);
            }
          }
        }

        // Keep the last partial line (could be incomplete) in the buffer.
        buffer = lines[lines.length - 1];
      }

      // Clear the prompt input when done.
      setPrompt("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error during streaming:", error);
      toast({ description: "Error fetching response", variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between">
        <h1 className="flex text-xl font-semibold items-center gap-2">
          <Bot className="w-5 h-5 text-muted-foreground" />
          General Assistant
        </h1>
        <div className="flex items-center justify-end gap-5">
          <span
            className="text-muted-foreground cursor-pointer"
            onClick={() => setOpenHistory(true)}
          >
            <History className="w-5 h-5" />
          </span>
          <span
            className="text-muted-foreground cursor-pointer"
            onClick={() => setOpenFavorites(true)}
          >
            <Star className="w-5 h-5" />
          </span>
          <span
            className="text-muted-foreground cursor-pointer"
            onClick={() => setOpenMenu(true)}
          >
            <Menu className="w-5 h-5" />
          </span>
        </div>
      </div>
      <SideBar
        open={openHistory}
        setOpen={setOpenHistory}
        data={promptHistory}
        title="History"
      />
      <SideBar
        open={openFavorites}
        setOpen={setOpenFavorites}
        data={favoritePrompts}
        title="Favorites"
      />
      <SideBar
        open={openMenu}
        setOpen={setOpenMenu}
        data={chatAgents}
        title="Menu"
      />
      <div className="mt-4">
        <ScrollArea className="h-[calc(70vh-100px)] w-full relative">
          <div className="flex flex-col gap-4 w-full md:p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex items-center gap-2 w-full justify-start "
              >
                <div className="flex bg-secondary rounded-full h-10 w-10 flex-col items-center justify-center">
                  {message.role === "user" ? (
                    <p className="flex flex-col items-center justify-center">
                      {session?.user?.name?.[0].toUpperCase()}
                    </p>
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div className="flex flex-col w-full gap-2">
                  <div
                    className={` rounded-t-md rounded-l-lg p-3 ${
                      message.role === "user" ? "bg-muted" : "bg-muted"
                    }`}
                  >
                    {message.text}
                  </div>
                  <div>
                    {message.role === "assistant" && (
                      <div className="flex  md:ml-3 items-center gap-5">
                        <div className="flex items-center gap-5">
                          <Eye className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <Star className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <Copy className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <RefreshCw className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <Share2 className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <Bookmark className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <Edit className="w-5 h-5 cursor-pointer text-muted-foreground" />
                        </div>
                        <div className="flex items-center  gap-5 justify-end w-full">
                          <ThumbsUp className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <ThumbsDown className="w-5 h-5 cursor-pointer text-muted-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center h-full mt-5 justify-center"
        >
          <div className="border flex items-center rounded-full mt-10  p-2.5  w-full md:w-full">
            <Input
              placeholder="Type your message here..."
              className="bg-transparent border-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className=" justify-between flex items-center gap-2 ml-2">
              <div className="flex items-center gap-5 mr-3">
                <span className="text-muted-foreground cursor-pointer">
                  <Mic className="w-5 h-5" />
                </span>
                <span className="text-muted-foreground cursor-pointer">
                  <FileUp
                    onClick={() => fileInputRef.current?.click()}
                    className="w-5 h-5"
                  />
                  <input type="file" className="hidden" ref={fileInputRef} />
                </span>
              </div>
              <div>
                <Button
                  disabled={!prompt || isLoading}
                  size="icon"
                  className="rounded-full"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowUp className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              {suggestions.map((suggestion: string, index: number) => (
                <div key={index}>
                  <Button className="rounded-full" variant="outline">
                    {suggestion}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentEditor;
