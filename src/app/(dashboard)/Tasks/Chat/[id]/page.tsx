import dynamic from "next/dynamic";
const TaskChat = dynamic(() => import("@/components/Tasks/Chat/Chat"), {
  ssr: false,
});

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-[800px]  w-full p-4 mx-auto">
      <TaskChat id={params.id} />
    </div>
  );
};

export default page;
