import dynamic from "next/dynamic";

const ShareToUsers = dynamic(
  () => import("@/components/myDocs/ShareToUsers/ShareToUsers"),
  {
    ssr: false,
  }
);

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-[800px] p-4 mx-auto">
      <ShareToUsers id={params.id} />
    </div>
  );
};

export default Page;
