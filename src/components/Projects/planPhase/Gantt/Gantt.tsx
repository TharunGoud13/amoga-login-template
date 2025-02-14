"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { PLAN_API, PLAN_PHASE_API, TASKS_API } from "@/constants/envConfig";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import {
  LuCopyCheck,
  LuChartPie,
  LuChartNoAxesGantt,
  LuMessageCircleMore,
  LuChartGantt,
} from "react-icons/lu";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "@/components/doc-template/DocTemplate";
import { Progress } from "@/components/ui/progress";
import GanttChart from "./GanttChart";

const Gantt = ({ id }: { id: string }) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  console.log("planData----", planData);

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      const response = await fetch(`${PLAN_PHASE_API}?plan_phase_id=eq.${id}`, {
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

  //   useEffect(() => {
  //     const fetchPlanPhase = async () => {
  //       setIsLoading(true);
  //       const response = await fetch(`${PLAN_PHASE_API}?plan_phase_id=eq.${id}`, {
  //         method: "GET",

  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  //         },
  //       });
  //       const data = await response.json();
  //       const filteredData = data.filter(
  //         (item: any) => item.business_number === session?.user?.business_number
  //       );
  //       setPlanData(filteredData);

  //       if (!response.ok) {
  //         toast({
  //           description: "Error fetching contacts",
  //           variant: "destructive",
  //         });
  //       }
  //       setIsLoading(false);
  //     };
  //     fetchPlanPhase();
  //   }, [session, id]);

  return (
    <div>
      <div className="flex items-center gap-2 justify-between">
        <h1 className="text-muted-foreground flex items-center gap-2">
          <LuChartNoAxesGantt className="h-5 w-5 text-muted-foreground" />
          {pathname.split("/").at(1)}
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <LuChartGantt className="h-5 w-5 text-muted-foreground" />
          {pathname.split("/").at(2)}
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <LuChartGantt className="h-5 w-5 text-muted-foreground" />
          {pathname.split("/").at(3)}
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
              <Card key={item.plan_id} className="py-2 px-2">
                <CardContent className="space-y-[10px] px-2 py-2">
                  <h2 className="font-semibold text-md">{item.plan_name}</h2>
                  <p className="text-md text-muted-foreground">
                    {item.plan_group}
                  </p>
                  <p className="text-md text-muted-foreground">
                    {item.plan_description}
                  </p>

                  <p className="flex items-center gap-2 text-md">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Start Date: {item.plan_start_date}</span>
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>End Date: {item.plan_end_date}</span>
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Actual Start Date: {item.actual_start_date}</span>
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Actual End Date: {item.actual_end_date}</span>
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <LuCopyCheck className="h-5 w-5 text-muted-foreground" />

                    <span>{item.status}</span>
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-md flex items-center w-full gap-2">
                      <LuChartPie className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
                      {/* <span>{item.plan_progress_track}</span> */}
                      <Progress
                        className="w-1/2 h-2.5"
                        value={item.progress_percent}
                      />
                    </p>
                    <div className="flex gap-1.5 md:gap-2 space-x-2">
                      <File className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      <ClipboardCheck className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      <Link href={`/Projects/edit/${item.plan_id}`}>
                        <Edit className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <Link href={`/Projects/view/${item.plan_id}`}>
                        <Eye className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <Link href={`/Projects/planPhase/${item.plan_id}`}>
                        <LuChartNoAxesGantt className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <LuMessageCircleMore className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="flex  gap-4 w-full items-center">
          <GanttChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default Gantt;
