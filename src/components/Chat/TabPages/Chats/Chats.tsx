"use client";
import { Session } from "@/components/doc-template/DocTemplate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CHAT_MESSAGE_API,
  GET_CONTACTS_API,
  LATEST_MESSAGE_API,
} from "@/constants/envConfig";
import axiosInstance from "@/utils/axiosInstance";
import { Loader, Loader2, MessageCircle, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Chats = () => {
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [uniqueChats, setUniqueChats] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [latestMessages, setLatestMessages] = useState<any[]>([]);
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  // to get chat messages and to know who are the sender and receiver
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      const response = await axiosInstance.get(CHAT_MESSAGE_API);
      setMessages(response.data);
      setIsLoading(false);
    };
    fetchMessages();
  }, []);

  // display user name based on receiver id
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      const response = await axiosInstance.get(GET_CONTACTS_API);
      setContacts(response.data);
      setIsLoading(false);
    };
    fetchContacts();
  }, []);

  // to get the latest message for a user
  useEffect(() => {
    const fetchLatestMessages = async () => {
      setIsLoading(true);
      const response = await axiosInstance.get(LATEST_MESSAGE_API);
      setLatestMessages(response.data);
      setIsLoading(false);
    };
    fetchLatestMessages();
  }, []);

  // Add a separate effect to refresh messages when user interacts with the page
  useEffect(() => {
    const refreshMessages = async () => {
      console.log("state-----", document.visibilityState);
      if (document.visibilityState === "visible") {
        const response = await axiosInstance.get(LATEST_MESSAGE_API);
        setLatestMessages(response.data);
      }
    };

    // Refresh when tab becomes visible
    document.addEventListener("visibilitychange", refreshMessages);
    // Refresh on user interaction
    window.addEventListener("focus", refreshMessages);

    return () => {
      document.removeEventListener("visibilitychange", refreshMessages);
      window.addEventListener("focus", refreshMessages);
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const userSet = new Set();

    messages.forEach((msg: any) => {
      // Only add users that the current user has interacted with
      if (msg?.sender_id == session?.user?.id) {
        console.log("msg?.receiver_user_id-----", msg?.receiver_user_id);
        // If current user is sender, add the receiver
        userSet.add(msg?.receiver_user_id);
      } else if (msg?.receiver_user_id == session?.user?.id) {
        console.log("msg?.sender_id-----", msg?.sender_id);
        // If current user is receiver, add the sender
        userSet.add(msg?.sender_id);
      }
    });

    setUniqueChats(Array.from(userSet));
  }, [messages, session]);

  console.log("uniqueChats-----", uniqueChats);

  const usersChat = contacts.filter((contact: any) =>
    uniqueChats.includes(contact.user_catalog_id)
  );

  // Function to get the latest message for a user
  const getLatestMessage = (userId: string) => {
    return latestMessages.find(
      (msg: any) =>
        (msg.sender_id == session?.user?.id && msg.receiver_id == userId) ||
        (msg.receiver_id == session?.user?.id && msg.sender_id == userId)
    );
  };

  // Function to format date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  // Sort chats by latest message timestamp (newest first)
  const sortedChats = [...usersChat].sort((a, b) => {
    const latestMsgA = getLatestMessage(a.user_catalog_id);
    const latestMsgB = getLatestMessage(b.user_catalog_id);

    const timeA = latestMsgA
      ? new Date(latestMsgA.created_datetime).getTime()
      : 0;
    const timeB = latestMsgB
      ? new Date(latestMsgB.created_datetime).getTime()
      : 0;

    return timeB - timeA; // Descending order (latest messages first)
  });

  return (
    <div>
      <div className="border flex items-center rounded-md pl-4 mt-5">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="border-0"
        />
      </div>
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <Loader className="h-5 w-5 animate-spin" />
        </div>
      )}
      <div className="mt-5 space-y-5">
        {sortedChats.map((user: any) => {
          const latestMsg = getLatestMessage(user.user_catalog_id);

          return (
            <Card key={user.user_catalog_id}>
              <CardContent className="flex flex-col gap-2">
                <div className="flex pt-2.5 items-center gap-2">
                  <Avatar>
                    <AvatarImage src={user.profile_pic_url} />
                    <AvatarFallback>
                      {user.first_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                </div>

                <p className="text-xs text-gray-500">
                  {latestMsg
                    ? formatDate(latestMsg.created_datetime)
                    : "No messages yet"}
                </p>

                <div className="flex items-center gap-2 justify-between">
                  <p className="text-sm text-gray-600 truncate w-[80%]">
                    {latestMsg ? latestMsg.chat_message : "No messages yet"}
                  </p>
                  <Link
                    href={`/Chat/contacts/messages/${user.user_catalog_id}`}
                  >
                    <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Chats;
