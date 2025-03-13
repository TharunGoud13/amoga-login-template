import NewStoryTemplate from "@/components/StoryMaker/NewStoryMaker";

const Page = () => {
  return (
    <div className="max-w-[800px]  w-full p-4 mx-auto">
      <NewStoryTemplate isEdit={false} isView={false} />
    </div>
  );
};

export default Page;
