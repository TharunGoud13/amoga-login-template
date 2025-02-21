import AgentEditor from "@/components/Agents/AgentEditor";
import React from "react";

const page = () => {
  return (
    <div className="min-h-[calc(90vh-200px)] overflow-hidden h-full max-w-[800px] mx-auto p-4 w-full">
      <AgentEditor />
    </div>
  );
};

export default page;
