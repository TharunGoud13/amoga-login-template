import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Bot,
  Eye,
  Edit,
  Code,
  Calendar,
  Activity,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SAVE_FORM_DATA } from "@/constants/envConfig";
import { Session } from "../doc-template/DocTemplate";
import { Badge } from "@/components/ui/badge";

const AgentsList = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  useEffect(() => {
    const fetchForms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${SAVE_FORM_DATA}?form_group=eq.Agents`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch forms");
        }

        const data = await response.json();
        const filteredData = data.filter(
          (item: any) => item.business_number === session?.user?.business_number
        );
        setData(filteredData);
      } catch (error) {
        toast({
          description: "Error fetching forms",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    if (session) {
      fetchForms();
    }
  }, [session, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex flex-col max-w-[800px] mx-auto justify-center gap-4 w-full items-center">
      <div className="flex w-full gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents"
            className="pl-10 text-md"
          />
        </div>
        <Link href="/AgentMaker/new">
          <Button size={"icon"}>
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center w-full">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 w-full">
          {data
            .filter((item: any) => {
              const searchTerm = search.toLowerCase();
              return item.form_name.toLowerCase().includes(searchTerm);
            })
            .map((item: any) => (
              <Card key={item.form_id} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    {/* Content Section */}
                    <div className="flex flex-col gap-4">
                      {/* Name */}
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-xl">
                          {item.form_name}
                        </h2>
                      </div>

                      {/* Code */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Code className="h-5 w-5" />
                        <span>Code: {item.form_code}</span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Status: </span>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </div>

                      {/* Created Date */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-5 w-5" />
                        <span>Created: {formatDate(item.created_date)}</span>
                      </div>

                      {/* Version and Actions in same line */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Activity className="h-5 w-5" />
                          <span>Version: {item.version_no}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link href={`/AgentMaker`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Bot className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                            </Button>
                          </Link>
                          <Link href={`/AgentMaker/edit/${item.form_id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Edit className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                            </Button>
                          </Link>
                          <Link href={`/AgentMaker/view/${item.form_id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                            </Button>
                          </Link>
                        </div>
                      </div>
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

export default AgentsList;
