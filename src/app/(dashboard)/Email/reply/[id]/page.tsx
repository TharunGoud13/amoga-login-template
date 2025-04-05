import NewEmail from "@/components/Email/NewEmail";

const Page = ({ params }: { params: { id: string } }) => {
  console.log("params-----", params);
  const { id } = params;
  return (
    <div className="max-w-[800px] w-full mx-auto p-4">
      <NewEmail isView={false} isReply={true} replyId={id} />
    </div>
  );
};

export default Page;
