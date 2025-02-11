import dynamic from "next/dynamic";
const NewTaskChat = dynamic(() => import("@/components/Tasks/Chat/NewChat"), {
  ssr: false,
});

const Page = ({ params }: { params: { id: string } }) => {
  return <NewTaskChat isEdit={false} isView={false} id={params.id} />;
};

export default Page;
