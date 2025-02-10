import NewDoBoxTasks from "@/components/DoBox/Tasks/NewTasks";

const Page = ({ params }: { params: { id: string } }) => {
  return <NewDoBoxTasks isEdit={false} isView={false} id={params.id} />;
};

export default Page;
