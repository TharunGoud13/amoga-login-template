"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Calendar,
  ClipboardCheck,
  Edit,
  Eye,
  File,
  Loader,
  Plus,
  Search,
} from "lucide-react";
import { MY_DOC_LIST, PLAN_API, TASKS_API } from "@/constants/envConfig";
import { toast } from "../ui/use-toast";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import {
  LuCopyCheck,
  LuChartPie,
  LuChartNoAxesGantt,
  LuMessageCircleMore,
} from "react-icons/lu";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "../doc-template/DocTemplate";

const Docs = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      const response = await fetch(MY_DOC_LIST, {
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
      console.log("filteredData----", filteredData);
      setData(filteredData);

      if (!response.ok) {
        toast({
          description: "Error fetching contacts",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };
    fetchPlan();
  }, [session]);

  console.log("data----", data);

  return (
    <div>
      <div className="flex flex-col gap-4 w-full items-center">
        <div className="flex w-full  gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-10"
            />
          </div>
          <Link href="/Docs/new">
            <Button size={"icon"}>
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div>
            <Loader className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {data
              .filter((item: any) => {
                const searchTerm = search.toLowerCase();
                return item.doc_name.toLowerCase().includes(searchTerm);
              })
              .map((item: any) => (
                <Card key={item.plan_id} className="py-1.5 px-1.5">
                  <CardContent className="space-y-1 px-1.5 py-1.5">
                    <h2 className="font-semibold">{item.doc_name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {item?.doc_group}
                    </p>

                    <p className="flex items-center gap-2 text-sm">
                      <span>Doc No: {item?.doc_no}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <span>Version No: {item.version_no}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {new Date(item.created_date).toLocaleDateString()}
                      </span>
                    </p>

                    {/* <p className="flex items-center gap-2 text-sm">
                      <LuCopyCheck className="h-3.5 w-3.5 text-muted-foreground" />

                      <span>{item.status}</span>
                    </p> */}

                    <div className="flex justify-between items-center">
                      <p className="flex items-center gap-2 text-sm">
                        <LuCopyCheck className="h-3.5 w-3.5 text-muted-foreground" />

                        <span>{item.status}</span>
                      </p>
                      {/* <p className="text-sm flex items-center gap-2">
                        <LuChartPie className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5]" />
                        <span>{item.plan_progress_track}</span>
                      </p> */}
                      <div className="flex space-x-2">
                        <LuMessageCircleMore className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                        <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                        <Link href={`/Docs/view/${item.mydoc_list_id}`}>
                          <Eye className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                        </Link>
                        <Link href={`/Docs/edit/${item.mydoc_list_id}`}>
                          <Edit className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                        </Link>
                        {/* <Link href={`/Docs/planPhase/${item.mydoc_list_id}`}>
                          <LuChartNoAxesGantt className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                        </Link> */}

                        <File className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Docs;
