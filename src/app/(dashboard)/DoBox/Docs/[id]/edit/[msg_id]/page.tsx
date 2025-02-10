"use client";
import React, { useEffect, useState } from "react";
import { MESSAGES_API, MY_DOC_LIST } from "@/constants/envConfig";
import { toast } from "@/components/ui/use-toast";
import NewDocs from "@/components/Docs/NewDocs";
import NewProjectDocs from "@/components/Projects/Docs/NewDocs";
import NewDoBoxDocs from "@/components/DoBox/Docs/NewDocs";

const EditDoBoxDocs = ({
  params,
}: {
  params: { id: string; msg_id: string };
}) => {
  const { id, msg_id } = params;
  const [docData, setDocData] = useState([]);

  useEffect(() => {
    const fetchDocData = async () => {
      const response = await fetch(
        `${MY_DOC_LIST}?mydoc_list_id=eq.${msg_id}`,
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
          description: "Failed to fetch contact data",
          variant: "destructive",
        });
      }
      const data = await response.json();
      console.log("data::::::", data);
      setDocData(data[0]);
    };
    fetchDocData();
  }, [msg_id]);

  return (
    <div className="max-w-[800px]  w-full md:p-4 p-2 mx-auto">
      <NewDoBoxDocs data={docData} isEdit={true} isView={false} id={id} />
    </div>
  );
};

export default EditDoBoxDocs;
