"use client";
import { Bookmark, Search, Star, Trash } from "lucide-react";
import { Input } from "../../ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet";
import { useRouter } from "next/navigation";
import { toast } from "../../ui/use-toast";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  title: string;
  setDeleteHistory: (deleteHistory: boolean) => void;
}

const BookmarkBar = ({
  open,
  setOpen,
  data,
  title,
  setDeleteHistory,
}: Props) => {
  const router = useRouter();
  console.log("book----", data);
  const handleClick = (id: string) => {
    router.push(`/Agent/${id}`);
  };

  const handleDelete = async (id: string) => {
    console.log("id----", id);
    const response = await fetch(
      `https://amogaagents.morr.biz/Chat?id=eq.${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      }
    );
    if (response.ok) {
      setDeleteHistory(true);
      toast({
        description: "Chat deleted successfully",
      });
    } else {
      toast({
        description: "Failed to delete chat",
        variant: "destructive",
      });
    }
  };
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
              <div className="flex items-center pl-2 gap-2 border rounded-md ">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  className="border-none"
                  placeholder={`Search ${title}...`}
                />
              </div>
            </SheetHeader>
            <div className="flex flex-col gap-2.5 mt-2.5">
              {data.map((prompt: any) => (
                <div
                  key={prompt.chatId}
                  className="hover:bg-secondary cursor-pointer p-2.5 rounded-md"
                >
                  <div className="flex justify-between items-center gap-2">
                    <div>
                      {prompt.isLike && (
                        <Star className="h-5 w-5 fill-yellow-500" />
                      )}
                    </div>
                    <div>
                      {prompt.bookmark && (
                        <Bookmark className="h-5 w-5 fill-yellow-500" />
                      )}
                    </div>
                    <p
                      className="line-clamp-1"
                      onClick={() => handleClick(prompt.id)}
                    >
                      {prompt.content}
                    </p>
                    <Trash
                      className="h-5 w-5 text-muted-foreground"
                      onClick={() => handleDelete(prompt.id)}
                    />
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

export default BookmarkBar;
