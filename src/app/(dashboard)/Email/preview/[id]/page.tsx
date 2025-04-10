import DocumentPreview from "@/components/Email/pages/DocumentPreview";

const page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  console.log("id", id);
  return (
    <div className=" h-full max-w-[800px] mx-auto p-4 w-full">
      <DocumentPreview url={id} />
    </div>
  );
};

export default page;
