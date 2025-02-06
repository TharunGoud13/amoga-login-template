import React from "react";
import dynamic from "next/dynamic";
const ProjectDocs = dynamic(() => import("@/components/Projects/Docs/Docs"), {
  ssr: false,
});

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-[800px]  w-full p-4 mx-auto">
      <ProjectDocs id={params.id} />
    </div>
  );
};

export default page;
