"use client";
import {
  ArrowUp,
  Bookmark,
  Bot,
  Check,
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
  X,
} from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import SideBar from "./SideBar/History";
import { ScrollArea } from "../ui/scroll-area";
import { useSession } from "next-auth/react";
import { toast } from "../ui/use-toast";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { generateAIResponse } from "./actions";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HistoryBar from "./SideBar/History";
import MenuBar from "./SideBar/Menu";
import BookmarkBar from "./SideBar/Bookmark";
import { Session } from "../doc-template/DocTemplate";

const favoritePrompts = [
  { id: 1, text: "Explain quantum computing in simple terms" },
  { id: 2, text: "Write a poem about artificial intelligence" },
  { id: 3, text: "Describe the process of photosynthesis" },
  { id: 4, text: "Compare and contrast renewable energy sources" },
  { id: 5, text: "Outline the major events of World War II" },
];

const chatAgents = [
  { id: 1, text: "General Assistant", icon: Bot },
  { id: 2, text: "Code Helper", icon: Code },
  { id: 3, text: "Creative Writer", icon: Pencil },
  { id: 4, text: "Data Analyst", icon: FileText },
  { id: 5, text: "Image Creator", icon: Image },
];

const AgentEditor = ({ chatId }: { chatId?: string }) => {
  const suggestions = ["Chat with Data", "Chat with Doc"];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [openFavorites, setOpenFavorites] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;
  const [deleteHistory, setDeleteHistory] = useState<boolean>(false);
  const [like, setLike] = useState<boolean>(false);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [bookmark, setBookmark] = useState<boolean>(false);
  const router = useRouter();
  const [userChatSession, setUserChatSession] = useState<any>({});
  const [chatData, setChatData] = useState<any>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [refreshBookmarkState, setRefreshBookmarkState] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("https://amogaagents.morr.biz/User", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });
      const data = await response.json();
      if (data.length > 0) {
        const existingUser = data.find(
          (user: any) => user?.email === session?.user?.email
        );

        setUserChatSession(existingUser);
        if (!existingUser) {
          const newUser = await fetch("https://amogaagents.morr.biz/User", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
            body: JSON.stringify({
              email: session?.user?.email,
              mobile: session?.user?.mobile,
            }),
          });
          const newUserData = await newUser.json();
          setUserChatSession(newUserData);
        }
      }
    };
    fetchUsers();
  }, [session]);

  const fetchHistory = async (userChatSession: any, setHistory: any) => {
    const response = await fetch("https://amogaagents.morr.biz/Chat", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
    });
    if (!response.ok) {
      toast({
        description: "Failed to fetch history",
        variant: "destructive",
      });
      return;
    }
    const data = await response.json();
    const filteredData = data.filter(
      (item: any) => item.user_id == userChatSession?.id
    );
    setHistory(filteredData);
  };

  useEffect(() => {
    if (userChatSession) {
      fetchHistory(userChatSession, setHistory);
    }
  }, [userChatSession, openHistory]);

  // useEffect(() => {
  //   const fetchLikes = async () => {
  //     const response = await fetch(
  //       "https://amogaagents.morr.biz/Message?isLike=eq.true",
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  //         },
  //       }
  //     );
  //     if (!response.ok) {
  //       toast({
  //         description: "Failed to fetch history",
  //         variant: "destructive",
  //       });
  //       return;
  //     }
  //     const data = await response.json();
  //     const filteredData = data.filter(
  //       (item: any) => item.user_id === userChatSession?.id
  //     );
  //     setLikes(filteredData);
  //   };
  //   fetchLikes();
  // }, [openFavorites, userChatSession]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!userChatSession?.id) return;

      try {
        console.log("Fetching bookmarks for user:", userChatSession.id);
        const response = await fetch(
          "https://amogaagents.morr.biz/Message?bookmark=eq.true",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch bookmarks, status:", response.status);
          toast({
            description: "Failed to fetch bookmarks",
            variant: "destructive",
          });
          return;
        }

        const data = await response.json();
        console.log("Raw bookmark data:", data);

        const filteredData = data.filter(
          (item: any) => item.user_id == userChatSession.id
        );

        console.log("Filtered bookmarks:", filteredData);
        setBookmarks(filteredData);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast({
          description: "Failed to fetch bookmarks",
          variant: "destructive",
        });
      }
    };

    if (userChatSession?.id) {
      fetchBookmarks();
    }
  }, [openFavorites, userChatSession, refreshBookmarkState]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userChatSession?.id) return;

      try {
        console.log("Fetching favorites for user:", userChatSession.id);
        const response = await fetch(
          "https://amogaagents.morr.biz/Message?favorite=eq.true",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch favorites, status:", response.status);
          toast({
            description: "Failed to fetch favorites",
            variant: "destructive",
          });
          return;
        }

        const data = await response.json();
        console.log("Raw favorite data:", data);

        const filteredData = data.filter(
          (item: any) => item.user_id == userChatSession.id
        );

        console.log("Filtered favorites:", filteredData);
        setFavorites(filteredData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast({
          description: "Failed to fetch favorites",
          variant: "destructive",
        });
      }
    };

    if (userChatSession?.id) {
      fetchFavorites();
    }
  }, [openFavorites, userChatSession, refreshBookmarkState]);

  console.log("bookmarks----", bookmarks);

  useEffect(() => {
    if (chatId) {
      const fetchMessages = async () => {
        const response = await fetch(
          `https://amogaagents.morr.biz/Message?chatId=eq.${chatId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
          }
        );
        if (!response.ok) {
          toast({
            description: "Failed to fetch messages",
            variant: "destructive",
          });
          return;
        }
        const data = await response.json();
        setMessages(
          data.map((msg: any) => ({
            id: msg.id,
            chatId: msg.chatId,
            createdAt: msg.createdAt,
            bookmark: msg.bookmark,
            isLike: msg.isLike,
            favorite: msg.favorite,
            text: msg.content,
            role: msg.role,
          }))
        );
      };
      fetchMessages();
    }
  }, [chatId]);

  useEffect(() => {
    const getChatData = async () => {
      if (!chatId) return;
      const response = await fetch(
        `https://amogaagents.morr.biz/Chat?id=eq.${chatId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        }
      );
      const data = await response.json();
      console.log("data----", data);
      setChatData(data);
    };
    getChatData();
  }, [chatId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;
    setIsLoading(true);

    // Generate a UUID for the new chat
    const newChatUuid = uuidv4();
    // Use existing chatId or the new one
    const currentChatId = chatId || newChatUuid;

    // Create a message ID for the user message
    const userMessageId = uuidv4();

    if (!chatId) {
      // Create a new chat
      const chatResponse = await fetch("https://amogaagents.morr.biz/Chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        body: JSON.stringify({
          createdAt: new Date().toISOString(),
          user_id: userChatSession?.id,
          title: `Draft ${newChatUuid}`,
          id: newChatUuid,
          status: "active",
        }),
      });

      if (!chatResponse.ok) {
        toast({
          description: "Failed to create chat",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    // Create a complete user message object
    const userMessage = {
      id: userMessageId,
      chatId: currentChatId,
      content: prompt,
      text: prompt,
      role: "user",
      createdAt: new Date().toISOString(),
      user_id: userChatSession?.id,
      bookmark: null,
      isLike: null,
      favorite: null,
    };

    // Add user message to local state with complete data
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to database
    await fetch("https://amogaagents.morr.biz/Message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify({
        id: userMessageId,
        chatId: currentChatId,
        content: prompt,
        role: "user",
        createdAt: new Date().toISOString(),
        user_id: userChatSession?.id,
      }),
    });

    // Create a placeholder for assistant message
    const assistantMessageId = uuidv4();
    const assistantMessage = {
      id: assistantMessageId,
      chatId: currentChatId,
      content: "",
      text: "",
      role: "assistant",
      createdAt: new Date().toISOString(),
      user_id: userChatSession?.id,
      bookmark: null,
      isLike: null,
      favorite: null,
    };

    // Add empty assistant message to show loading state
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Get AI response
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let buffer = "";
      let aiResponse = "";

      // Process streaming response
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();

          if (line.startsWith("data:")) {
            const dataStr = line.replace(/^data:\s*/, "");

            if (dataStr === "[DONE]") {
              done = true;
              break;
            }

            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta;
              if (delta && delta.content) {
                aiResponse += delta.content;

                // Update the assistant message incrementally
                setMessages((prev) => {
                  const messages = [...prev];
                  if (
                    messages.length > 0 &&
                    messages[messages.length - 1].role === "assistant"
                  ) {
                    messages[messages.length - 1].text = aiResponse;
                    messages[messages.length - 1].content = aiResponse; // Update both fields
                  }
                  return messages;
                });
              }
            } catch (err) {
              console.error("Error parsing SSE data:", err);
            }
          }
        }

        buffer = lines[lines.length - 1];
      }

      // Save AI response to database
      if (aiResponse.trim()) {
        await fetch("https://amogaagents.morr.biz/Message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
          body: JSON.stringify({
            id: assistantMessageId,
            chatId: currentChatId,
            content: aiResponse,
            role: "assistant",
            createdAt: new Date().toISOString(),
            user_id: userChatSession?.id,
          }),
        });
      }

      // If this was a new chat, redirect to the chat page with the new chatId
      if (!chatId) {
        router.push(`/Agent/${currentChatId}`);
      }

      setPrompt("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error during streaming:", error);
      toast({ description: "Error fetching response", variant: "destructive" });
      setIsLoading(false);
    }
  };

  // Add this function to handle title updates
  const handleUpdateTitle = async () => {
    if (!chatId || !editedTitle.trim()) return;

    try {
      const response = await fetch(
        `https://amogaagents.morr.biz/Chat?id=eq.${chatId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
          body: JSON.stringify({
            title: editedTitle,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update chat title");
      }

      // Update local state to reflect the change
      if (chatData && chatData.length > 0) {
        setChatData([{ ...chatData[0], title: editedTitle }]);
      }

      toast({
        description: "Chat title updated successfully",
      });

      // Exit edit mode
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Error updating chat title:", error);
      toast({
        description: "Failed to update chat title",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async (message: any) => {
    try {
      const newBookmarkStatus = !message.bookmark;

      // Update the message in the local state first for immediate UI feedback
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, bookmark: newBookmarkStatus } : msg
        )
      );

      const response = await fetch(
        `https://amogaagents.morr.biz/Message?id=eq.${message.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Prefer: "return=representation",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
          body: JSON.stringify({
            bookmark: newBookmarkStatus,
          }),
        }
      );

      if (!response.ok) {
        toast({
          description: "Failed to update bookmark status",
          variant: "destructive",
        });
        return;
      }

      // Trigger a refresh of the bookmarks list
      setRefreshBookmarkState((prev) => !prev);

      toast({
        description: newBookmarkStatus
          ? "Message bookmarked"
          : "Bookmark removed",
      });
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast({
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
  };

  const handleFavorite = async (message: any) => {
    try {
      const newFavoriteStatus = !message.favorite;

      // Update the message in the local state first for immediate UI feedback
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, favorite: newFavoriteStatus } : msg
        )
      );

      const response = await fetch(
        `https://amogaagents.morr.biz/Message?id=eq.${message.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Prefer: "return=representation",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
          body: JSON.stringify({
            favorite: newFavoriteStatus,
          }),
        }
      );

      if (!response.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id
              ? { ...msg, favorite: !newFavoriteStatus }
              : msg
          )
        );
        toast({
          description: "Failed to update favorite status",
          variant: "destructive",
        });
        return;
      }

      // Trigger a refresh of the favorites list
      setRefreshBookmarkState((prev) => !prev);

      toast({
        description: newFavoriteStatus
          ? "Message favorited"
          : "Favorite removed",
      });
    } catch (error) {
      console.error("Error updating favorite:", error);
      toast({
        description: "Failed to update favorite",
        variant: "destructive",
      });
    }
  };

  // const handleLike = async (message: any) => {
  //   const response = await fetch(
  //     `https://amogaagents.morr.biz/Message?id=eq.${message.id}`,
  //     {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  //       },
  //       body: JSON.stringify({
  //         isLike: !message.isLike,
  //       }),
  //     }
  //   );
  //   if (!response.ok) {
  //     toast({
  //       description: "Failed to bookmark message",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
  //   setLike(!like);
  //   toast({
  //     description: "Message bookmarked",
  //   });
  // };

  useEffect(() => {
    if (chatData && chatData.length > 0 && chatData[0]?.title) {
      setEditedTitle(chatData[0].title);
    }
  }, [chatData]);

  // Add this effect to update messages when favorites are changed
  useEffect(() => {
    // Update the messages state to reflect changes in favorite status
    if (messages.length > 0) {
      setMessages((prevMessages) => {
        return prevMessages.map((message) => {
          // Check if this message is in the favorites list
          const isFavorite = favorites.some((fav) => fav.id === message.id);

          // Update the favorite status based on the favorites list
          if (isFavorite !== message.favorite) {
            return { ...message, favorite: isFavorite };
          }
          return message;
        });
      });
    }
  }, [favorites, refreshBookmarkState, messages.length]);

  const handleChatBookmark = async () => {
    if (!chatId) return;

    try {
      const newBookmarkStatus = !(chatData?.[0]?.bookmark || false);

      // Update local state for immediate UI feedback
      if (chatData && chatData.length > 0) {
        const updatedChatData = [...chatData];
        updatedChatData[0] = {
          ...updatedChatData[0],
          bookmark: newBookmarkStatus,
        };
        setChatData(updatedChatData);
      }

      const response = await fetch(
        `https://amogaagents.morr.biz/Chat?id=eq.${chatId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Prefer: "return=representation",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
          body: JSON.stringify({
            bookmark: newBookmarkStatus,
          }),
        }
      );

      if (!response.ok) {
        toast({
          description: "Failed to update chat bookmark status",
          variant: "destructive",
        });
        return;
      }

      // Refresh history to show updated bookmark status
      fetchHistory(userChatSession, setHistory);

      toast({
        description: newBookmarkStatus
          ? "Chat bookmarked"
          : "Chat bookmark removed",
      });
    } catch (error) {
      console.error("Error updating chat bookmark:", error);
      toast({
        description: "Failed to update chat bookmark",
        variant: "destructive",
      });
    }
  };

  console.log("chatData----", chatData);
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between">
        <Link href="/Agent">
          <h1 className="flex text-xl font-semibold items-center gap-2">
            <Bot className="w-5 h-5 text-muted-foreground" />
            General Assistant
          </h1>
        </Link>
        <div className="flex items-center justify-end gap-5">
          <Link href="/Agent">
            <span className="text-muted-foreground cursor-pointer">
              <Plus className="w-5 h-5" />
            </span>
          </Link>
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
      {chatId && (
        <div className="flex items-center gap-2 mt-2">
          <Input
            type="text"
            value={isEditingTitle ? editedTitle : chatData?.[0]?.title}
            className={`border-0 w-fit max-w-[50% ] ${
              isEditingTitle ? "border border-primary" : ""
            }`}
            readOnly={!isEditingTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onFocus={() => {
              if (isEditingTitle && !editedTitle && chatData?.[0]?.title) {
                setEditedTitle(chatData[0].title);
              }
            }}
          />
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <Check
                className="w-5 h-5 cursor-pointer"
                onClick={handleUpdateTitle}
              />
              <X
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  setIsEditingTitle(false);
                  setEditedTitle("");
                }}
              />
            </div>
          ) : (
            <Edit
              className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary"
              onClick={() => {
                setIsEditingTitle(true);
                setEditedTitle(chatData?.[0]?.title || "");
              }}
            />
          )}
          <Bookmark
            className={`w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary ${
              chatData?.[0]?.bookmark ? "fill-primary" : ""
            }`}
            onClick={handleChatBookmark}
          />
        </div>
      )}

      <HistoryBar
        open={openHistory}
        setOpen={setOpenHistory}
        data={history}
        setDeleteHistory={setDeleteHistory}
        title="History"
        refreshHistory={() => fetchHistory(userChatSession, setHistory)}
      />
      <BookmarkBar
        open={openFavorites}
        setOpen={setOpenFavorites}
        // bookmarks={bookmarks}
        favorites={favorites}
        setRefreshState={setRefreshBookmarkState}
        title="Favorites"
      />
      <MenuBar
        open={openMenu}
        setOpen={setOpenMenu}
        data={chatAgents}
        setDeleteHistory={setDeleteHistory}
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
                          <Star
                            onClick={() => handleFavorite(message)}
                            className={`w-5 h-5 cursor-pointer text-muted-foreground ${
                              message.favorite ? "fill-primary " : ""
                            }`}
                          />
                          <Copy className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <RefreshCw className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <Share2 className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          {/* <Bookmark
                            className={`w-5 h-5 cursor-pointer text-muted-foreground ${
                              message.bookmark
                                ? "fill-primary border-primary"
                                : ""
                            }`}
                            onClick={() => handleBookmark(message)}
                          /> */}
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
          {/* <div className="mt-4">
            <div className="flex items-center gap-2">
              {suggestions.map((suggestion: string, index: number) => (
                <div key={index}>
                  <Button className="rounded-full" variant="outline">
                    {suggestion}
                  </Button>
                </div>
              ))}
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default AgentEditor;
