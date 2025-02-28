import React from "react";
import dynamic from "next/dynamic";
const ChatDoc = dynamic(() => import("@/components/Docs/ChatwithDoc/Chat"), {
  ssr: false,
});

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-[800px]  w-full p-4 mx-auto">
      <ChatDoc id={params.id} />
    </div>
  );
};

export default page;
