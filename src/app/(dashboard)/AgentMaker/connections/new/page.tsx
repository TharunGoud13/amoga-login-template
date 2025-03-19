import NewConnections from "@/components/AgentMaker/Connections/NewConnections";

const page = () => {
  return (
    <div className="max-w-[800px] mx-auto p-5">
      <NewConnections isEditing={false} />
    </div>
  );
};

export default page;
