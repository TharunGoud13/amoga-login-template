"use client";
import AgentEditor from "@/components/Agents/AgentEditor";
import CardRender from "@/components/Agents/Chat/Card";
import ChatEditor from "@/components/Agents/Chat/Card2";
import { SAVE_FORM_FIELDS } from "@/constants/envConfig";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [chatData, setChatData] = useState<any>(null);

  useEffect(() => {
    const fetchChatData = async () => {
      const response = await axiosInstance.get(
        `${SAVE_FORM_FIELDS}?form_id=eq.${id}`
      );
      console.log("response.data----", response.data);
      setChatData(response.data[0]);
    };
    fetchChatData();
  }, [id]);
  console.log("chatData----", chatData);
  return (
    <div className="min-h-[calc(90vh-200px)] overflow-hidden h-full max-w-[800px] mx-auto p-4 w-full">
      <ChatEditor field={chatData} />
    </div>
  );
};

export default Page;
