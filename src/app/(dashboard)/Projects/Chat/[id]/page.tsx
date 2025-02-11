import dynamic from "next/dynamic";
const ProjectChat = dynamic(() => import("@/components/Projects/Chat/Chat"), {
  ssr: false,
});

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-[800px]  w-full p-4 mx-auto">
      <ProjectChat id={params.id} />
    </div>
  );
};

export default page;
