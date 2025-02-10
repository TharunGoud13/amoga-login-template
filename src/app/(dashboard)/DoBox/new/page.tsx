import dynamic from "next/dynamic";

const NewDoBox = dynamic(() => import("@/components/DoBox/NewDoBox"), {
  ssr: false,
});

const Page = () => {
  return (
    <div>
      <NewDoBox isEdit={false} isView={false} />
    </div>
  );
};

export default Page;
