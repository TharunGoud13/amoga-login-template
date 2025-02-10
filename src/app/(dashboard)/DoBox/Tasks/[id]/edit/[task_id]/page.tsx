"use client";
import React, { useEffect, useState } from "react";
import { MESSAGES_API, MY_DOC_LIST, TASKS_API } from "@/constants/envConfig";
import { toast } from "@/components/ui/use-toast";
import NewDocs from "@/components/Docs/NewDocs";
import NewProjectDocs from "@/components/Projects/Docs/NewDocs";
import NewDoBoxDocs from "@/components/DoBox/Docs/NewDocs";
import NewDoBoxTasks from "@/components/DoBox/Tasks/NewTasks";

const EditDoBoxTasks = ({
  params,
}: {
  params: { id: string; task_id: string };
}) => {
  const { id, task_id } = params;
  const [docData, setDocData] = useState([]);

  useEffect(() => {
    const fetchDocData = async () => {
      const response = await fetch(`${TASKS_API}?task_id=eq.${task_id}`, {
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
      setDocData(data[0]);
    };
    fetchDocData();
  }, [task_id]);

  return (
    <div className="max-w-[800px]  w-full md:p-4 p-2 mx-auto">
      <NewDoBoxTasks data={docData} isEdit={true} isView={false} id={id} />
    </div>
  );
};

export default EditDoBoxTasks;
