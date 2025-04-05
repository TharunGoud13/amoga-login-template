"use client";
import {
  AlertTriangle,
  Archive,
  Bell,
  Bookmark,
  CheckSquare,
  Download,
  EllipsisVertical,
  Filter,
  Flag,
  Forward,
  HelpCircle,
  MessageSquare,
  MoreVertical,
  Plus,
  Printer,
  RefreshCw,
  Reply,
  ReplyAll,
  Search,
  Settings,
  Share2,
  Sliders,
  Star,
  Trash2,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";
import { EMAIL_LIST_API } from "@/constants/envConfig";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useCustomSession } from "@/utils/session";
import { toast } from "../ui/use-toast";

const EmailList = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const session = useCustomSession();

  useEffect(() => {
    fetchEmails();
  }, [session]);

  const fetchEmails = async () => {
    const response = await axiosInstance.get(EMAIL_LIST_API);
    const filterUserEmails = response.data?.filter((email: any) =>
      email?.to_user_email.includes(session?.user?.email)
    );
    const filterEmails = filterUserEmails.filter(
      (email: any) => email?.template !== true
      // && !email?.replied_to_email_id
    );

    setEmails(filterEmails);
  };

  const handleAddActions = async (email: any, action: string) => {
    console.log("email------", email?.email_list_id);
    console.log("action------", action);
    try {
      const response = await axiosInstance.patch(
        `${EMAIL_LIST_API}?email_list_id=eq.${email?.email_list_id}`,
        {
          [action]: true,
        }
      );
      fetchEmails();
      console.log("response------", response);
    } catch (error) {
      console.log("error------", error);
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 items-center w-full">
        <div className="flex w-full items-center gap-2 pl-4 border rounded-md mt-5">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0"
            placeholder="Search"
          />
        </div>
        <div className="flex items-center mt-4 gap-4">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
          <Filter className="w-5 h-5 text-muted-foreground" />
          <Link href="/Email/new">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <CheckSquare className="h-4 w-4 mr-2" />
                Mark all as read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Sliders className="h-4 w-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Zap className="h-4 w-4 mr-2" />
                Automations
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Backup
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {emails
          .filter((email: any) => email.subject.toLowerCase().includes(search))
          .map((email: any) => {
            console.log("email------", email);
            return (
              <Card key={email.email_list_id} className="space-y-2">
                <CardContent className="flex items-center p-4  gap-2">
                  <div className="flex w-full  justify-between items-center">
                    <div className="flex gap-2.5">
                      <div>
                        <Avatar>
                          <AvatarFallback>
                            {email?.sender_email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <Link href={`/Email/view/${email.email_list_id}`}>
                          <div className="flex flex-col">
                            <span>{email?.subject}</span>
                            <span className="text-sm text-muted-foreground">
                              {email?.body}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(
                                email?.created_date
                              ).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(
                                email?.created_date
                              ).toLocaleTimeString()}
                            </span>
                            {" - "}
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(email?.created_date)
                              )}{" "}
                              ago
                            </span>
                          </div>
                        </Link>
                        <div className="flex mt-2.5 gap-3 items-center">
                          <Flag
                            onClick={() =>
                              handleAddActions(email, "is_important")
                            }
                            className={`h-4 w-4 cursor-pointer text-muted-foreground 
                              ${
                                email?.is_important
                                  ? "border-secondary fill-red-500"
                                  : ""
                              }
                              `}
                          />
                          <Star
                            onClick={() =>
                              handleAddActions(email, "is_starred")
                            }
                            className={`h-4 w-4 cursor-pointer text-muted-foreground 
                              ${
                                email?.is_starred
                                  ? "border-secondary fill-yellow-500"
                                  : ""
                              }
                              `}
                          />
                          <Bookmark
                            onClick={() =>
                              handleAddActions(email, "is_bookmark")
                            }
                            className={`h-4 w-4 cursor-pointer text-muted-foreground 
                              ${
                                email?.is_bookmark
                                  ? "border-secondary fill-blue-500"
                                  : ""
                              }
                              `}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        onClick={() => handleAddActions(email, "is_alert")}
                        className={`h-4 w-4 cursor-pointer text-muted-foreground 
                              ${
                                email?.is_alert
                                  ? "border-secondary fill-yellow-500"
                                  : ""
                              }
                              `}
                      />
                      <Bell
                        // onClick={() => handleAddActions(email, "bell")}
                        className="h-4 w-4 cursor-pointer text-muted-foreground"
                      />
                      <MessageSquare className="h-4 w-4 cursor-pointer text-muted-foreground" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <Link href={`/Email/reply/${email.email_list_id}`}>
                            <DropdownMenuItem>
                              <Reply className="h-4 w-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/Email/replyAll/${email.email_list_id}`}>
                            <DropdownMenuItem>
                              <ReplyAll className="h-4 w-4 mr-2" />
                              Reply All
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default EmailList;
