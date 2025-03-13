import NewStory from "@/components/StoryMaker/Story/NewStory";

const Page = ({ params }: { params: { id: string; storyId: string } }) => {
  return (
    <div className="max-w-[800px]  w-full p-4 mx-auto">
      <NewStory
        isEdit={true}
        isView={false}
        id={params.id}
        storyId={params.storyId}
      />
    </div>
  );
};

export default Page;
