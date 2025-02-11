import dynamic from "next/dynamic";
const NewProjectChat = dynamic(
  () => import("@/components/Projects/Chat/NewChat"),
  {
    ssr: false,
  }
);

const Page = ({ params }: { params: { id: string } }) => {
  return <NewProjectChat isEdit={false} isView={false} id={params.id} />;
};

export default Page;
