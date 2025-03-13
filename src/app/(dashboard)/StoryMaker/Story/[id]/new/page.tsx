import NewStory from "@/components/StoryMaker/Story/NewStory";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-[800px]  w-full p-4 mx-auto">
      <NewStory isEdit={false} isView={false} storyId={params.id} />
    </div>
  );
};

export default Page;
