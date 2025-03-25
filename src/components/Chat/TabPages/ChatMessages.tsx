"use client";
import {
  AlarmClockPlus,
  AlarmPlusIcon,
  ArrowLeft,
  ArrowUp,
  Bot,
  Copy,
  Download,
  Edit,
  Eye,
  File,
  FileAudio,
  FileDownIcon,
  FileImage,
  FileUp,
  FileVideo,
  History,
  Loader2,
  Menu,
  Mic,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Reply,
  Share2,
  Smile,
  Sparkle,
  Star,
  ThumbsUp,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Session } from "@/components/doc-template/DocTemplate";
import { io } from "socket.io-client";
import { toast } from "@/components/ui/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { CHAT_MESSAGE_API } from "@/constants/envConfig";
import { v4 as uuidv4 } from "uuid";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { FaFilePdf } from "react-icons/fa";
import Image from "next/image";

const socket = io(
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : "https://amoga-template-socket-1.onrender.com"
);

const ChatMessages = ({ chatId }: { chatId?: string }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [repliedMessage, setRepliedMessage] = useState<any>(null);
  const [fileUploadLoading, setFileUploadLoading] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const { data: sessionData } = useSession();
  const [attachments, setAttachments] = useState<any>({
    attachment_url: "",
    attachment_type: "",
    attachment_name: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  const generateRoomId = (
    sessionId: string | number,
    chatId: string | number
  ) => {
    return [sessionId, chatId].sort().join("_");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId || !session?.user?.id) return;
      const roomId = generateRoomId(session?.user?.id, chatId);
      try {
        const response = await axiosInstance.get(
          `${CHAT_MESSAGE_API}?soc_room_id=eq.${roomId}&order=created_date.asc`
        );
        const normalizedMessages = response.data.map((msg: any) => ({
          ...msg,
          // Add a unique identifier that can be used for replies
          messageUniqueId: msg.id || msg.agentMsgId || uuidv4(),
        }));
        setMessages(normalizedMessages);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch messages",
        });
      }
    };
    fetchMessages();
  }, [chatId, session?.user?.id]);

  useEffect(() => {
    if (chatId && session?.user?.id) {
      const roomId = generateRoomId(session?.user?.id, chatId);

      socket.emit("join_room", roomId);
      console.log(`Joined room: ${roomId}`);
    }

    return () => {
      socket.off("receive_msg");
    };
  }, [chatId, session?.user?.id]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage: any) => {
      const normalizedMessage = {
        ...newMessage,
        messageUniqueId: newMessage.id || newMessage.agentMsgId || uuidv4(),
      };

      setMessages((prev) => [...prev, normalizedMessage]);
    };

    socket.on("receive_msg", handleReceiveMessage);
    return () => {
      socket.off("receive_msg", handleReceiveMessage);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!chatId || !session?.user?.id) return;

    const roomId = generateRoomId(session?.user?.id, chatId);

    const unqChatId = uuidv4();

    const msgData = {
      chatId: roomId, // Room ID is the chatId
      user: session?.user?.name, // Sender's username
      msg: message,
      time: new Date().toISOString(),
    };

    const payload = {
      id: unqChatId,
      created_user_id: session?.user?.id,
      created_user_name: session?.user?.name,
      created_date: new Date().toISOString(),
      replied_to_message_id:
        repliedMessage?.messageUniqueId ||
        repliedMessage?.id ||
        repliedMessage?.agentMsgId,
      chat_message_type: "text",
      soc_room_id: roomId,
      attachment_url: attachments?.attachment_url,
      attachment_type: attachments?.attachment_type,
      attachment_name: attachments?.attachment_name,
      sender_id: session?.user?.id,
      chat_message: message,
      from_business_number: session?.user?.business_number,
      from_business_name: session?.user?.business_name,
    };

    try {
      socket.emit("send_msg", payload);
      //   setMessages((prev) => [...prev, payload]);

      await axiosInstance.post(CHAT_MESSAGE_API, payload);
      setMessage("");
      setAttachments({
        attachment_url: "",
        attachment_type: "",
        attachment_name: "",
      });
      setRepliedMessage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (audioInputRef.current) {
        audioInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const generateFileIcon = (type: string) => {
    if (type.includes("audio")) {
      return <FileAudio className="w-5 h-5" />;
    } else if (type.includes("video")) {
      return <FileVideo className="w-5 h-5" />;
    } else if (type.includes("image")) {
      return <FileImage className="w-5 h-5" />;
    } else if (type.includes("pdf")) {
      return <File className="w-5 h-5" />;
    } else if (type.includes("doc")) {
      return <FileDownIcon className="w-5 h-5" />;
    }
  };

  const handleIconClick = async (message: any, icon: string) => {
    console.log("clicked----", { message, icon });
    try {
      await axiosInstance.patch(
        `${CHAT_MESSAGE_API}?id=eq.${message.id}`,
        icon === "important"
          ? { important: !message.important }
          : { favorite: !message.favorite }
      );
      setMessages(
        messages.map((msg) =>
          msg.id === message.id
            ? {
                ...msg,
                important:
                  icon === "important" ? !message.important : message.important,
                favorite:
                  icon === "favorite" ? !message.favorite : message.favorite,
              }
            : msg
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    }
  };

  const handleEmoji = async (value: string, message: any) => {
    console.log("reactions-----", { value, message });
    if (!value || !message) return;
    try {
      await axiosInstance.patch(`${CHAT_MESSAGE_API}?id=eq.${message.id}`, {
        reactions: value,
      });
      setMessages(
        messages.map((msg) =>
          msg.id === message.id
            ? {
                ...msg,
                reactions: value,
              }
            : msg
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    }
  };

  const handleReply = (message: any) => {
    console.log("message-----", message);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setRepliedMessage(message);
  };

  console.log("messages-----", messages);
  const findRepliedMessageContent = (repliedToMessageId: string) => {
    // Try to find the replied message using different possible identifiers
    return messages.find(
      (msg) =>
        msg.messageUniqueId === repliedToMessageId ||
        msg.id === repliedToMessageId ||
        msg.agentMsgId === repliedToMessageId
    )?.chat_message;
  };

  console.log("attachments-----", attachments);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadLoading(true);
    const file = e.target.files?.[0];
    setMessage(file?.name || "");
    const formData = new FormData();
    formData.append("file", file || "");
    console.log("file-----", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setAttachments({
        attachment_url: data.url,
        attachment_type: file?.type,
        attachment_name: file?.name,
      });
      console.log("data-----", data);
    } catch (error) {
      console.log("error-----", error);
    } finally {
      setFileUploadLoading(false);
    }
  };

  const handleDownload = async (url: string, name: string) => {
    if (!url || !name) return;

    try {
      const response = await fetch(url);
      console.log("response----", response);
      const blob = await response.blob();
      console.log("blob-----", blob);
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      console.log("blobUrl-----", blobUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (url: string, type: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.addEventListener("ended", () => {
        setIsAudioPlaying(false);
      });
    }

    if (type === "play") {
      setIsAudioPlaying(true);
      audioRef.current.play();
    } else {
      setIsAudioPlaying(false);
      audioRef.current.pause();
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex border-b border-gray-200 pb-5 items-center justify-between">
        <Link href="/Chat">
          <h1 className="flex text-xl font-semibold items-center gap-2">
            <Bot className="w-5 h-5 text-muted-foreground" />
            Chat
          </h1>
        </Link>
        <div className="flex items-center justify-end gap-5">
          <Link href="/Chat">
            <span className="text-muted-foreground cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </span>
          </Link>
          <span className="text-muted-foreground cursor-pointer">
            <History className="w-5 h-5" />
          </span>
          <span className="text-muted-foreground cursor-pointer">
            <Star className="w-5 h-5" />
          </span>
          <span className="text-muted-foreground cursor-pointer">
            <Menu className="w-5 h-5" />
          </span>
        </div>
      </div>

      <div className="mt-4">
        <ScrollArea
          ref={scrollAreaRef}
          className="h-[calc(70vh-100px)] w-full relative"
        >
          <div className="flex flex-col gap-4 w-full md:p-4 p-2">
            {messages.map((message, index) => (
              <div
                key={index}
                ref={messagesEndRef}
                className="flex items-start gap-2 w-full justify-start flex-wrap sm:flex-nowrap"
              >
                <div className="flex bg-secondary rounded-full h-10 w-10 flex-shrink-0 flex-col items-center justify-center">
                  {message.from_business_number ===
                  session?.user?.business_number ? (
                    <p className="flex flex-col items-center justify-center">
                      {session?.user?.name?.[0].toUpperCase()}
                    </p>
                  ) : (
                    <p>{message?.created_user_name?.charAt(0).toUpperCase()}</p>
                  )}
                </div>

                <div className="flex flex-col w-full gap-2">
                  <span className="text-xs text-muted-foreground">
                    {/* {new Date(message.created_date).toLocaleTimeString()} -{" "} */}
                    {new Date(message.created_date).toLocaleDateString()}
                  </span>
                  {message.replied_to_message_id && (
                    <div className="flex items-center w-full gap-2 flex-wrap">
                      <span className="text-sm font-semibold">
                        Replied to:{" "}
                      </span>
                      <span className="text-sm break-words">
                        {findRepliedMessageContent(
                          message.replied_to_message_id ||
                            message.ref_chat_message_id
                        ) || "Original message"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start w-full gap-2 flex-wrap sm:flex-nowrap">
                    {/* <div className="relative"> */}
                    {/* <EmojiPicker
                      onChange={(value) => handleEmoji(value, message)}
                    /> */}
                    {/* </div> */}
                    <div className="rounded-t-md relative w-full rounded-l-lg p-3 bg-muted">
                      {message.attachment_url && message.attachment_type ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          {message.attachment_type.includes("image") ? (
                            <Image
                              src={message.attachment_url}
                              alt={
                                message.attachment_name || "Attachment image"
                              }
                              className="max-h-[250px] h-full w-full  object-cover rounded-md"
                              width={350}
                              height={200}
                              priority
                              unoptimized={true}
                            />
                          ) : message.attachment_type.includes("video") ? (
                            <video
                              src={message.attachment_url}
                              className="max-h-[250px] w-full rounded-md"
                              width={100}
                              controls
                              height={100}
                            />
                          ) : (
                            <>
                              {generateFileIcon(message.attachment_type)}
                              <span className="break-words">
                                {message.attachment_name}
                              </span>
                              {message.attachment_type.includes("audio") && (
                                <div className="flex items-center gap-2">
                                  {isAudioPlaying ? (
                                    <Pause
                                      onClick={() =>
                                        playAudio(
                                          message.attachment_url,
                                          "pause"
                                        )
                                      }
                                      className="w-5 h-5 cursor-pointer text-muted-foreground"
                                    />
                                  ) : (
                                    <Play
                                      className="w-5 h-5 cursor-pointer text-muted-foreground"
                                      onClick={() =>
                                        playAudio(
                                          message.attachment_url,
                                          "play"
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              )}
                            </>
                          )}
                          <div className="flex gap-2 mt-2 w-full">
                            <Eye
                              className="w-5 h-5 cursor-pointer text-muted-foreground"
                              onClick={() =>
                                window.open(message.attachment_url, "_blank")
                              }
                            />
                            <Download
                              className="w-5 h-5 cursor-pointer text-muted-foreground"
                              onClick={() =>
                                handleDownload(
                                  message.attachment_url,
                                  message.attachment_name
                                )
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="break-words">
                          {message.chat_message}
                        </div>
                      )}
                      <div className="absolute">
                        {message.reactions && (
                          <div className="flex items-center bg-gray-200 rounded-full p-1 gap-2">
                            {message?.reactions}
                          </div>
                        )}
                      </div>
                      <div className="absolute flex items-center gap-2 right-2 pt-2 bottom-0 translate-y-full mt-2">
                        <Sparkle
                          onClick={(e) => handleIconClick(message, "important")}
                          className={`h-5 w-5 cursor-pointer text-muted-foreground ${
                            message.important ? "fill-primary text-primary" : ""
                          }`}
                        />
                        <Star
                          onClick={() => handleIconClick(message, "favorite")}
                          className={`h-5 w-5 cursor-pointer text-muted-foreground ${
                            message.favorite ? "fill-primary text-primary" : ""
                          }`}
                        />
                        <AlarmClockPlus
                          className={`h-5 w-5 cursor-pointer text-muted-foreground`}
                        />
                        <Reply
                          className="h-5 w-5 cursor-pointer text-muted-foreground "
                          onClick={() => handleReply(message)}
                        />
                      </div>
                    </div>
                    {/* <span className="text-muted-foreground cursor-pointer hidden sm:block">
                      <Reply
                        className="w-5 h-5"
                        onClick={() => handleReply(message)}
                      />
                    </span> */}
                  </div>

                  <div ref={messagesEndRef}></div>

                  <div>
                    {message.role === "assistant" && (
                      <div className="flex md:ml-3 items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Eye className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <Star
                            className={`w-5 h-5 cursor-pointer text-muted-foreground ${
                              message.favorite
                                ? "fill-primary text-primary"
                                : ""
                            }`}
                          />
                          <Copy className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <RefreshCw className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <Share2 className="w-5 h-5 cursor-pointer text-muted-foreground" />
                          <Edit className="w-5 h-5 cursor-pointer text-muted-foreground" />
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
          <div className="mt-10 w-full">
            {repliedMessage && (
              <div className="text-muted-foreground flex items-center justify-between mb-2.5 bg-secondary/90 rounded-full w-full p-2">
                <span>{repliedMessage?.chat_message}</span>
                <X
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => setRepliedMessage(null)}
                />
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground cursor-pointer">
                <EmojiPicker
                  onChange={(value) => setMessage(message + value)}
                />
              </span>
              <div className="border flex items-center rounded-full   p-2.5  w-full md:w-full">
                <Input
                  placeholder="Type your message here..."
                  className="bg-transparent border-none"
                  value={message}
                  ref={inputRef}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex justify-between items-center gap-2 ml-2">
                  <div className="flex items-center gap-5 mr-3">
                    {/* <span className="text-muted-foreground cursor-pointer">
                      <EmojiPicker
                        onChange={(value) => setMessage(message + value)}
                      />
                    </span> */}
                    {/* <span className="text-muted-foreground cursor-pointer">
                      <Mic
                        className="w-5 h-5"
                        onClick={() => audioInputRef.current?.click()}
                      />
                      <input
                        type="file"
                        accept=".mp3,.mp4,.mov,.wmv,.avi"
                        className="hidden"
                        ref={audioInputRef}
                        onChange={handleFileChange}
                      />
                    </span> */}
                    <span className="text-muted-foreground cursor-pointer">
                      <FileUp
                        className="w-5 h-5"
                        onClick={() => fileInputRef.current?.click()}
                      />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.wav,.mp3,.mp4,.mov,.wmv,.avi,.jpg,.jpeg,.png,.gif,.mp3,.mp4,.mov,.wmv,.avi"
                        className="hidden"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </span>

                    <input type="file" className="hidden" />
                  </div>
                  <div>
                    <Button
                      disabled={!messages || !message || fileUploadLoading}
                      size="icon"
                      className="rounded-full"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatMessages;
