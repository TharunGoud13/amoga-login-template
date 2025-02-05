"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Briefcase,
  Building2,
  Edit,
  Eye,
  Loader,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import { GET_CONTACTS_API } from "@/constants/envConfig";
import { toast } from "../ui/use-toast";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Contacts = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      const response = await fetch(GET_CONTACTS_API, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });
      const data = await response.json();
      setData(data);

      if (!response.ok) {
        toast({
          description: "Error fetching contacts",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };
    fetchContacts();
  }, []);

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
          <Link href="/contacts/new">
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
                return item.user_name.toLowerCase().includes(searchTerm);
                //   item.business_name.toLowerCase().includes(searchTerm)
              })
              .map((item: any) => (
                <Card key={item.user_catalog_id} className="py-1.5 px-1.5">
                  <CardContent className="space-y-1 px-1.5 py-1.5">
                    <h2 className="font-semibold">{item.user_name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {item.designation}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{item.user_email}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{item.user_mobile}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{item.business_postcode}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{item.department}</span>
                    </p>

                    <div className="flex justify-between items-center">
                      <p className="text-sm flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5]" />
                        <span>{item.business_name}</span>
                      </p>
                      <div className="flex space-x-2">
                        <Link href={`/contacts/view/${item.user_catalog_id}`}>
                          <Eye className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
                        </Link>
                        <Link href={`/contacts/edit/${item.user_catalog_id}`}>
                          <Edit className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5] cursor-pointer hover:text-foreground" />
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

export default Contacts;
