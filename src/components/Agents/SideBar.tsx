import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  title: string;
}

const SideBar = ({ open, setOpen, data, title }: Props) => {
  return (
    <div>
      <div>
        <Sheet
          open={open}
          onOpenChange={(open) => setOpen(open ? true : false)}
        >
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2.5 mt-2.5">
              {data.map((prompt: any) => (
                <div
                  key={prompt.id}
                  className="hover:bg-secondary cursor-pointer p-2.5 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <p>{prompt.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default SideBar;
