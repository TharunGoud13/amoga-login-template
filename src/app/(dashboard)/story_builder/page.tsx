import dynamic from "next/dynamic";
const StoryBuilderTabs = dynamic(
  () => import("@/components/story_builder/StoryBuilderTabs")
);

const StoryBuilder = () => {
  return (
    <div className="p-5">
      <StoryBuilderTabs />
    </div>
  );
};

export default StoryBuilder;
