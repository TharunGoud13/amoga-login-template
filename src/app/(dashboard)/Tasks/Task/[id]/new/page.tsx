import dynamic from "next/dynamic";
const NewTask = dynamic(() => import("@/components/Tasks/Task/NewTask"), {
  ssr: false,
});

const Page = ({ params }: { params: { id: string } }) => {
  return <NewTask isEdit={false} isView={false} id={params.id} />;
};

export default Page;
