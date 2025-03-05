import React from "react";
import dynamic from "next/dynamic";
const AgentBuilder = dynamic(
  () => import("@/components/AgentMaker/FormBuilder"),
  { ssr: false }
);

const page = () => {
  return <AgentBuilder />;
};

export default page;
