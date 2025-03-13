"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  ArrowRight,
  BookOpenText,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Edit,
  Eye,
  EyeIcon,
  File,
  LayoutPanelTop,
  Loader,
  Plus,
  Search,
} from "lucide-react";
import {
  MY_DOC_LIST,
  PLAN_API,
  PLAN_PHASE_API,
  STORY_TEMPLATE,
  TASKS_API,
} from "@/constants/envConfig";
import { toast } from "../../ui/use-toast";
import { Card, CardContent } from "../../ui/card";
import { usePathname, useRouter } from "next/navigation";
import {
  LuCopyCheck,
  LuChartPie,
  LuChartNoAxesGantt,
  LuMessageCircleMore,
} from "react-icons/lu";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "../../doc-template/DocTemplate";
import { Progress } from "@/components/ui/progress";

const Story = ({ id }: { id: string }) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  useEffect(() => {
    const fetchStoryTemplate = async () => {
      setIsLoading(true);
      const response = await fetch(`${STORY_TEMPLATE}?story_id=eq.${id}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });
      const data = await response.json();
      const filteredData = data.filter(
        (item: any) => item.business_number === session?.user?.business_number
      );

      setData(filteredData);

      if (!response.ok) {
        toast({
          description: "Error fetching contacts",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };
    fetchStoryTemplate();
  }, [session, id]);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      const response = await fetch(
        `${STORY_TEMPLATE}?ref_template_code=eq.${id}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        }
      );
      const data = await response.json();
      const filteredData = data.filter(
        (item: any) => item.business_number === session?.user?.business_number
      );
      setStories(filteredData);

      if (!response.ok) {
        toast({
          description: "Error fetching contacts",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };
    fetchStories();
  }, [session, id]);

  console.log("stories---", stories);

  return (
    <div>
      <div className="flex items-center gap-2 justify-between">
        <h1 className="text-muted-foreground text-md flex items-center gap-2">
          <LuChartNoAxesGantt className="h-5 w-5 text-muted-foreground" />
          {pathname.split("/").at(1)}
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <BookOpenText className="h-5 w-5 text-muted-foreground" />
          {pathname.split("/").at(2)}
        </h1>
        <Link href={`/StoryMaker`}>
          <Button className="border-0" variant={"outline"}>
            Back to Story Maker
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-4 w-full items-center">
        {isLoading ? (
          <div>
            <Loader className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {data.map((item: any) => (
              <Card key={item.plan_id} className="py-2 px-2">
                <CardContent className="space-y-[10px] px-2 py-2">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-md">
                      {item.template_name}
                    </h2>
                  </div>

                  <p className="flex items-center gap-2 text-md">
                    <LayoutPanelTop className="h-5 w-5 text-muted-foreground" />
                    <span> {item.template_type}</span>
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                    <span> {item.status}</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="flex items-center gap-2 max-w-[80%] text-md">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span>
                        {new Date(item.created_date).toLocaleDateString()}
                      </span>
                    </p>
                    {/* <p className="flex items-center gap-2 text-md">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span> {item.story_api_url}</span>
                      </p> */}
                    <div className="flex gap-1.5 md:gap-2 space-x-2">
                      {/* <Link href={`/StoryMaker/Story/${item.story_id}`}> */}
                      <BookOpenText className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      {/* </Link> */}
                      {/* <Link href={`/StoryMaker/edit/${item.story_id}`}> */}
                      <Edit className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      {/* </Link> */}
                      {/* <Link href={`/Projects/view/${item.plan_id}`}>
                          <Eye className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                        </Link>
                        <Link href={`/Projects/planPhase/${item.plan_id}`}>
                          <LuChartNoAxesGantt className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                        </Link>
                        <Link href={`/Projects/Chat/${item.plan_id}`}>
                          <LuMessageCircleMore className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                        </Link> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div className="flex w-full mt-4 mb-4  gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-10 text-md"
          />
        </div>
        <Link href={`/StoryMaker/Story/${id}/new`}>
          <Button size={"icon"}>
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {stories
            .filter((item: any) =>
              item.story_title.toLowerCase().includes(search.toLowerCase())
            )
            .map((item: any) => (
              <Card key={item.story_id} className="py-2 px-2">
                <CardContent className="space-y-[10px] px-2 py-2">
                  <h2 className="font-semibold text-md">{item.story_title}</h2>
                  <p className="text-md text-muted-foreground">
                    {item.story_category}
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <span>{item.story_description}</span>
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <span>{item.status}</span>
                  </p>

                  <p className="flex items-center gap-2 text-md">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>
                      Date: {new Date(item.created_date).toLocaleDateString()}
                    </span>
                  </p>

                  {/* <div className="flex justify-between items-center">
                    <p className="flex items-center gap-2 text-md">
                      <LuCopyCheck className="h-5 w-5 text-muted-foreground" />

                      <span>{item.status}</span>
                    </p>
                    <p className="text-md flex items-center gap-2">
                      <LuChartPie className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
                      <span>{item.plan_progress_track}</span>
                    </p>
                    <div className="flex gap-1.5 md:gap-2 space-x-2">
                      <File className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      <ClipboardCheck className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      <Link
                        href={`/Projects/Docs/${id}/edit/${item.mydoc_list_id}`}
                      >
                        <Edit className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <Link
                        href={`/Projects/Docs/${id}/view/${item.mydoc_list_id}`}
                      >
                        <Eye className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <LuMessageCircleMore className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />

                      <LuChartNoAxesGantt className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                    </div>
                  </div> */}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default Story;
