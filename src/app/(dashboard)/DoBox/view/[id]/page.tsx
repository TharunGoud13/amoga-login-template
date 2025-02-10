"use client";
import React, { useEffect, useState } from "react";
import { MESSAGES_API } from "@/constants/envConfig";
import { toast } from "@/components/ui/use-toast";
import NewMsg from "@/components/Msg/NewMsg";
import NewDoBox from "@/components/DoBox/NewDoBox";

const ViewDoBox = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [msgData, setMsgData] = useState([]);

  useEffect(() => {
    const fetchMsgData = async () => {
      const response = await fetch(`${MESSAGES_API}?msg_id=eq.${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });
      if (!response.ok) {
        toast({
          description: "Failed to fetch contact data",
          variant: "destructive",
        });
      }
      const data = await response.json();
      setMsgData(data[0]);
    };
    fetchMsgData();
  }, [id]);

  return (
    <div className="max-w-[800px]  w-full md:p-4 p-2 mx-auto">
      <NewDoBox data={msgData} isEdit={false} isView={true} />
    </div>
  );
};

export default ViewDoBox;
