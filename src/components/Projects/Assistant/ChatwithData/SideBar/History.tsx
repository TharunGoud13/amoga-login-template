"use client";
import { Bookmark, Search, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  planId: string;
  title: string;
  setDeleteHistory: (deleteHistory: boolean) => void;
  refreshHistory: () => Promise<void>;
}

const HistoryBar = ({
  open,
  setOpen,
  data,
  title,
  setDeleteHistory,
  refreshHistory,
  planId,
}: Props) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleClick = (id: string) => {
    router.push(`/Projects/Assistant/${planId}/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `https://amogaagents.morr.biz/Chat?id=eq.${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Prefer: "return=representation",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
          body: JSON.stringify({
            status: "delete",
          }),
        }
      );

      if (!response.ok) {
        toast({
          description: "Failed to delete chat",
          variant: "destructive",
        });
        return;
      }

      setDeleteHistory(true);
      await refreshHistory();

      toast({
        description: "Chat deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast({
        description: "Failed to delete chat",
        variant: "destructive",
      });
    }
  };

  // Filter data based on search term
  const filteredData = data
    .filter((item: any) => item.status !== "delete") // Filter out deleted items
    .filter((item: any) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      <Sheet open={open} onOpenChange={(open) => setOpen(open ? true : false)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${title.toLowerCase()}...`}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </SheetHeader>
          <div className="flex flex-col gap-2.5 mt-4">
            {filteredData.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                {searchTerm
                  ? "No matching items found"
                  : data.length === 0
                  ? "No history found"
                  : "No items to display"}
              </div>
            ) : (
              filteredData.map((prompt: any) => (
                <div
                  key={prompt.chatId}
                  className="hover:bg-secondary cursor-pointer p-2.5 rounded-md"
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex justify-between items-center gap-2">
                      {prompt.bookmark && (
                        <Bookmark className="h-5 w-5 fill-primary text-primary" />
                      )}

                      <p onClick={() => handleClick(prompt.id)}>
                        {prompt.title}
                      </p>
                    </div>
                    <Trash
                      className="h-5 w-5 text-muted-foreground"
                      onClick={() => handleDelete(prompt.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HistoryBar;
