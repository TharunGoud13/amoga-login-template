import Story from "@/components/StoryMaker/Story/Story";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-[800px] w-full p-4 mx-auto">
      <Story id={params.id} />
    </div>
  );
};

export default page;
