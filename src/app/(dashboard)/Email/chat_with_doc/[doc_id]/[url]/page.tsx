import ChatwithDoc from "@/components/Email/pages/ChatwithDoc/ChatwithDoc";
import React from "react";

const page = ({ params }: { params: { doc_id: string } }) => {
  const { doc_id } = params;
  return (
    <div className="max-w-[800px] mx-auto p-4 w-full">
      <div className="h-full w-full">
        <ChatwithDoc docId={doc_id} />
      </div>
    </div>
  );
};

export default page;
