"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ArrowRight,
  Calendar,
  CircleCheck,
  ClipboardCheck,
  Edit,
  Eye,
  File,
  Loader,
  Plus,
  Search,
  User,
} from "lucide-react";
import {
  MESSAGES_API,
  MY_DOC_LIST,
  PLAN_API,
  TASKS_API,
} from "@/constants/envConfig";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";

import {
  LuCopyCheck,
  LuChartPie,
  LuChartNoAxesGantt,
  LuMessageCircleMore,
} from "react-icons/lu";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "@/components/doc-template/DocTemplate";
import { Progress } from "@/components/ui/progress";

const DoBoxTasks = ({ id }: { id: string }) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: sessionData } = useSession();
  const pathname = usePathname();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      const response = await fetch(`${MESSAGES_API}?msg_id=eq.${id}`, {
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
    fetchMessages();
  }, [session, id]);

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      const response = await fetch(`${TASKS_API}?msg_id=eq.${id}`, {
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
      setTasksData(filteredData);

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
        <h1 className="text-muted-foreground text-md flex items-center gap-2">
          <CircleCheck className="h-5 w-5 text-muted-foreground" />
          {pathname.split("/").at(1)}
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
          {pathname.split("/").at(2)}
        </h1>
        <Link href={`/DoBox`}>
          <Button className="border-0" variant={"outline"}>
            Back to DoBox
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
              <Card key={item.msg_id} className="py-2 px-2">
                <CardContent className="space-y-[10px] px-2 py-2">
                  <p className="flex items-center gap-2 text-md">
                    <LuChartNoAxesGantt className="h-5 w-5 text-muted-foreground" />
                    {item.plan_name}
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <LuChartNoAxesGantt className="h-5 w-5 text-muted-foreground" />
                    <span>{item.plan_phase_name}</span>
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <CircleCheck className="h-5 w-5 text-muted-foreground" />
                    <span>{item.task_title}</span>
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <span>{item.mydoc_name}</span>
                  </p>

                  <p className="flex items-center gap-2 text-md">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>
                      Date: {new Date(item.created_date).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <User className="h-5 w-5 text-muted-foreground" />

                    <span>From: {item.created_user_name}</span>
                  </p>
                  <p className="flex font-semibold items-center gap-2 text-md">
                    <span>Subject: {item.msg_subject}</span>
                  </p>
                  <p className="flex items-center text-muted-foreground gap-2 text-md">
                    <span>Msg Group: {item.msg_group}</span>
                  </p>
                  <p className="flex items-center text-muted-foreground gap-2 text-md">
                    <span>Desc: {item.msg_description}</span>
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="flex items-center gap-2 text-md">
                      <LuCopyCheck className="h-5 w-5 text-muted-foreground" />

                      <span>{item.status}</span>
                    </p>
                    <div className="flex gap-1.5 md:gap-2 space-x-2">
                      <Link href={`/DoBox/Docs/${item.msg_id}`}>
                        <File className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <ClipboardCheck className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      <Link href={`/Msg/edit/${item.msg_id}`}>
                        <Edit className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <Link href={`/Msg/view/${item.msg_id}`}>
                        <Eye className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                      </Link>
                      <LuMessageCircleMore className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div className="flex w-full mt-4 mb-4 gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-10 text-md"
          />
        </div>
        <Link href={`/DoBox/Tasks/${id}/new`}>
          <Button size={"icon"}>
            <Plus className="h-5 w-5" />
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
            {tasksData
              .filter((item: any) => {
                const searchTerm = search.toLowerCase();
                return item.task_title.toLowerCase().includes(searchTerm);
                //   item.business_name.toLowerCase().includes(searchTerm)
              })
              .map((item: any) => (
                <Card key={item.user_catalog_id} className="py-2 px-2">
                  <CardContent className="space-y-[10px] px-2 py-2">
                    <h2 className="font-semibold text-md">{item.task_title}</h2>
                    <p className="text-md text-muted-foreground">
                      {item.task_group}
                    </p>
                    <p className="text-md text-muted-foreground">
                      {item.task_description}
                    </p>
                    <p className="flex items-center gap-2 text-md">
                      <LuChartNoAxesGantt className="h-5 w-5 text-muted-foreground" />
                      <span>{item.plan_name}</span>
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
                        <Link href={`/DoBox/Tasks/${id}/view/${item.task_id}`}>
                          <Eye className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                        </Link>
                        <Link href={`/DoBox/Tasks/${id}/edit/${item.task_id}`}>
                          <Edit className="h-5 w-5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                        </Link>
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

export default DoBoxTasks;
