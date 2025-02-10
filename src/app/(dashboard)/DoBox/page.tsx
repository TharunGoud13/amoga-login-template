import dynamic from "next/dynamic";
const DoBox = dynamic(() => import("@/components/DoBox/DoBox"), {
  ssr: false,
});

const page = () => {
  return (
    <div className="max-w-[800px]  w-full p-4 mx-auto">
      <DoBox />
    </div>
  );
};

export default page;
