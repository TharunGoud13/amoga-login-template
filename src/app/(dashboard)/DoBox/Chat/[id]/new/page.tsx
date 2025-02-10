import dynamic from "next/dynamic";
const NewDoBoxChat = dynamic(() => import("@/components/DoBox/Chat/NewChat"), {
  ssr: false,
});

const Page = ({ params }: { params: { id: string } }) => {
  return <NewDoBoxChat isEdit={false} isView={false} id={params.id} />;
};

export default Page;
