import NewStoryTemplate from "@/components/StoryMaker/NewStoryMaker";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-[800px]  w-full p-4 mx-auto">
      <NewStoryTemplate isEdit={true} isView={false} storyId={params.id} />
    </div>
  );
};

export default Page;
