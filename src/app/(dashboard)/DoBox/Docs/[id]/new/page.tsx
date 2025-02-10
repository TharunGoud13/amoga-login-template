import React from "react";
import dynamic from "next/dynamic";
import NewProjectDocs from "@/components/Projects/Docs/NewDocs";
import NewDoBoxDocs from "@/components/DoBox/Docs/NewDocs";

const Page = ({ params }: { params: { id: string } }) => {
  return <NewDoBoxDocs isEdit={false} isView={false} id={params.id} />;
};

export default Page;
