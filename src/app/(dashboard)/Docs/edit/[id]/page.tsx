"use client";
import React, { useEffect, useState } from "react";
import { MY_DOC_LIST } from "@/constants/envConfig";
import { toast } from "@/components/ui/use-toast";
import NewDocs from "@/components/Docs/NewDocs";

const EditDocs = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [docData, setDocData] = useState([]);

  useEffect(() => {
    const fetchDocData = async () => {
      const response = await fetch(`${MY_DOC_LIST}?mydoc_list_id=eq.${id}`, {
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
      console.log("data::::::", data);
      setDocData(data[0]);
    };
    fetchDocData();
  }, [id]);

  return (
    <div className="max-w-[800px]  w-full md:p-4 p-2 mx-auto">
      <NewDocs data={docData} isEdit={true} isView={false} />
    </div>
  );
};

export default EditDocs;
