"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { CHAT_GROUP_API } from "@/constants/envConfig";
import axiosInstance from "@/utils/axiosInstance";
import { ClipboardCheck, Edit, Eye, Plus, Search, User } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LuCopyCheck } from "react-icons/lu";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axiosInstance.get(CHAT_GROUP_API);
        setGroups(response.data);
      } catch (error) {
        console.log("error----", error);
        toast({
          description: "Error fetching groups",
          variant: "destructive",
        });
      }
    };
    fetchGroups();
  }, []);

  console.log("groups-----", groups);
  return (
    <div>
      <div className="flex items-center mt-5 gap-2 justify-between">
        <div className="flex items-center border rounded-md w-full pl-4 gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search Groups"
            className="border-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link href={"/Chat/groups/new"}>
          <Button size={"icon"}>
            <Plus />
          </Button>
        </Link>
      </div>
      <div className="mt-5 space-y-4">
        {groups
          .filter((item: any) =>
            item.chat_group_name.toLowerCase().includes(search.toLowerCase())
          )
          .map((group: any) => (
            <Card key={group.id}>
              <CardContent className="pt-2">
                <h1>{group.chat_group_name}</h1>
                <h1>Members: {group?.chat_group_users_json?.length}</h1>
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2">
                    <LuCopyCheck className="h-5 w-5 text-muted-foreground" />
                    {group.status}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/Chat/groups/add-users/${group.chat_group_id}`}
                    >
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <Plus className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </Link>
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <Link href={`/Chat/groups/edit/${group.chat_group_id}`}>
                      <Edit className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Groups;
