import React from "react";
import dynamic from "next/dynamic";
import Docs from "@/components/Docs/Docs";
// import NewDocs from "@/components/Docs/NewDocs";
const NewDocs = dynamic(() => import("@/components/myDocs/NewDoc"), {
  ssr: false,
});

const Page = () => {
  return <NewDocs isEdit={false} isView={false} />;
};

export default Page;
