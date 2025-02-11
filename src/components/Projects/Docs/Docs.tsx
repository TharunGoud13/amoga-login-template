"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  ArrowRight,
  Calendar,
  ClipboardCheck,
  Edit,
  Eye,
  File,
  Loader,
  Plus,
  Search,
} from "lucide-react";
import {
  MY_DOC_LIST,
  PLAN_API,
  PLAN_PHASE_API,
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

const PlanPhase = ({ id }: { id: string }) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [docsData, setDocsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      const response = await fetch(`${PLAN_API}?plan_id=eq.${id}`, {
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
    fetchPlan();
  }, [session, id]);

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      const response = await fetch(`${MY_DOC_LIST}?plan_id=eq.${id}`, {
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
      setDocsData(filteredData);

      if (!response.ok) {
        toast({
          description: "Error fetching contacts",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };
    fetchDocs();
  }, [session, id]);

  return (
    <div>
      <div className="flex items-center gap-2 justify-between">
        <h1 className="text-muted-foreground flex items-center gap-2">
          <LuChartNoAxesGantt className="h-3.5 w-3.5 text-muted-foreground" />
          {pathname.split("/").at(1)}
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          <File className="h-3.5 w-3.5 text-muted-foreground" />
          {pathname.split("/").at(2)}
        </h1>
        <Link href={`/Projects`}>
          <Button className="border-0" variant={"outline"}>
            Back to Projects
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
              <Card key={item.plan_id} className="py-1.5 px-1.5">
                <CardContent className="space-y-1 px-1.5 py-1.5">
                  <h2 className="font-semibold">{item.plan_name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {item.plan_group}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.plan_description}
                  </p>

                  <p className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Start Date: {item.plan_start_date}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>End Date: {item.plan_end_date}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Actual Start Date: {item.actual_start_date}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Actual End Date: {item.actual_end_date}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <LuCopyCheck className="h-3.5 w-3.5 text-muted-foreground" />

                    <span>{item.status}</span>
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-sm flex items-center gap-2">
                      <LuChartPie className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5]" />
                      <span>{item.plan_progress_track}</span>
                    </p>
                    <div className="flex space-x-2">
                      <File className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      <Link href={`/Projects/edit/${item.plan_id}`}>
                        <Edit className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <Link href={`/Projects/view/${item.plan_id}`}>
                        <Eye
                          className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground"
                          onClick={() =>
                            router.push(`/Projects/view/${item.plan_id}`)
                          }
                        />
                      </Link>
                      <Link href={`/Projects/planPhase/${item.plan_id}`}>
                        <LuChartNoAxesGantt className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <LuMessageCircleMore className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-10"
          />
        </div>
        <Link href={`/Projects/Docs/${id}/new`}>
          <Button size={"icon"}>
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {docsData
            .filter((item: any) =>
              item.doc_name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item: any) => (
              <Card key={item.mydoc_list_id} className="py-1.5 px-1.5">
                <CardContent className="space-y-1 px-1.5 py-1.5">
                  <h2 className="font-semibold">{item.doc_name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {item.doc_group}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <span>Doc No: {item.doc_no}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <span>Version No: {item.version_no}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Date: {item.created_date}</span>
                  </p>

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
                      <File className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      <Link
                        href={`/Projects/Docs/${id}/edit/${item.mydoc_list_id}`}
                      >
                        <Edit className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <Link
                        href={`/Projects/Docs/${id}/view/${item.mydoc_list_id}`}
                      >
                        <Eye className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <LuMessageCircleMore className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />

                      {/* <LuChartNoAxesGantt className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" /> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default PlanPhase;
