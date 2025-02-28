import React from "react";
import dynamic from "next/dynamic";
const AssistantPage = dynamic(
  () => import("@/components/Projects/Assistant/AssistantPage"),
  {
    ssr: false,
  }
);

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-[800px]  w-full p-4 mx-auto">
      <AssistantPage id={params.id} />
    </div>
  );
};

export default page;
