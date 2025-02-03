import React from "react";
import dynamic from "next/dynamic";
const DocTemplate = dynamic(
  () => import("@/components/doc-template/DocTemplate"),
  { ssr: false }
);

const page = () => {
  return <DocTemplate />;
};

export default page;
