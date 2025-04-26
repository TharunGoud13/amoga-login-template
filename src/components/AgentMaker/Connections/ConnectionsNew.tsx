import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Code,
  Calendar,
  Activity,
  CheckCircle2,
  Edit,
  Eye,
  Link as LinkIcon,
  Globe,
  Key,
  Lock,
  Server,
  Trash2,
  Globe2,
  Database,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ADD_CONNECTIONS, NEXT_PUBLIC_API_KEY } from "@/constants/envConfig";
import { Session } from "../../doc-template/DocTemplate";
import axiosInstance from "@/utils/axiosInstance";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Connection = {
  id: string;
  status: "active" | "inactive";
  created_date: string;
  connection_name: string;
  connection_type: string;
  api_method: "GET" | "POST";
  api_url: string;
  key: string;
  secret: string;
  test_status: "passed" | "failed" | "pending";
  test_data?: string;
};

const ConnectionsNew = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Connection[]>([]);
  const [filteredData, setFilteredData] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  console.log("data---", data);

  const [newConnection, setNewConnection] = useState<Partial<Connection>>({
    status: "inactive",
    created_date: new Date().toISOString().split("T")[0],
    test_status: "pending",
    api_method: "GET",
    test_data: '{\n  "key": "value"\n}',
  });

  useEffect(() => {
    const results = data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(search.toLowerCase())
      )
    );
    setFilteredData(results);
  }, [search, data]);

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      const response = await fetch(ADD_CONNECTIONS, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to fetch connections");
      }
      const connections: Connection[] = await response.json();
      setData(connections);
      setFilteredData(connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast({
        description: "Failed to fetch connections",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewConnection({ ...newConnection, [e.target.name]: e.target.value });
  };

  const handleEdit = (item: Connection) => {
    setIsDialogOpen(true);
    setIsEditing(true);
    setNewConnection(item);
  };

  const handleDelete = async (id: string, fetchConnections: () => void) => {
    console.log("id----", id);
    const response = await axiosInstance.delete(
      `${ADD_CONNECTIONS}?id=eq.${id}`
    );
    fetchConnections();
    if (response.status === 200) {
      toast({
        description: "Connection deleted successfully",
        variant: "default",
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewConnection({ ...newConnection, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
      myHeaders.append("Content-Type", "application/json");

      const { test_data, ...connectionData } = newConnection;

      const url = isEditing
        ? `${ADD_CONNECTIONS}?id=eq.${newConnection?.id}`
        : ADD_CONNECTIONS;
      const method = isEditing ? "PUT" : "POST";
      const requestOptions = {
        method: method,
        headers: myHeaders,
        body: JSON.stringify(connectionData),
      };

      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to save connection");
      }

      toast({
        description: `Connection ${
          isEditing ? "updated" : "added"
        } successfully`,
        variant: "default",
      });
      setIsLoading(false);
      setIsDialogOpen(false);
      fetchConnections();
    } catch (error) {
      setIsLoading(false);
      toast({
        description: `Failed to ${isEditing ? "edit" : "add"} connection`,
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async (connection: Partial<Connection>) => {
    if (!connection.key || !connection.secret || !connection.api_url) {
      toast({
        description: "API URL, Key and Secret are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(connection.key, connection.secret);

      let requestOptions: RequestInit = {
        method: connection.api_method,
        headers: headers,
      };

      if (connection.api_method === "POST") {
        if (!connection.test_data) {
          toast({
            description: "Test data is required for POST requests",
            variant: "destructive",
          });
          return;
        }

        try {
          const parsedData = JSON.parse(connection.test_data);
          requestOptions.body = JSON.stringify(parsedData);
        } catch (e) {
          toast({
            description: "Invalid JSON data format",
            variant: "destructive",
          });
          return;
        }
      }

      const response = await fetch(connection.api_url, requestOptions);

      if (!response.ok) {
        setNewConnection({ ...connection, test_status: "failed" });
        const errorData = await response.json();
        throw new Error(errorData.error || "Connection test failed");
      }

      await response.json();
      setNewConnection({ ...connection, test_status: "passed" });
      toast({
        description: "Connection test successful",
        variant: "default",
      });
    } catch (error: any) {
      setNewConnection({ ...connection, test_status: "failed" });
      toast({
        description: error.message || "Connection test failed",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col max-w-[800px] mx-auto justify-center gap-4 w-full items-center">
      <div className="flex w-full gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search connections"
            className="pl-10 text-md"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size={"icon"}
              onClick={() => {
                setIsEditing(false);
                setNewConnection({
                  status: "inactive",
                  created_date: new Date().toISOString().split("T")[0],
                  test_status: "pending",
                  api_method: "GET",
                  test_data: '{\n  "key": "value"\n}',
                });
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Add Connection</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  href="/AgentMaker/connections/api"
                  className="flex items-center"
                >
                  <Globe className="w-5 h-5 text-muted-foreground mr-2" />
                  <span>Connect API</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/AgentMaker/connections/database"
                  className="flex items-center"
                >
                  <Database className="w-5 h-5 text-muted-foreground mr-2" />
                  <span>Connect Database</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/AgentMaker/connections/document"
                  className="flex items-center"
                >
                  <FileText className="w-5 h-5 text-muted-foreground mr-2" />
                  <span>Connect Document</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center w-full">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 w-full">
          {filteredData.map((item: any) => {
            const connectionJsonField = `${item.connection_group}_connection_json`;
            console.log("connectionJsonField---", connectionJsonField);
            const connectionData = item[connectionJsonField];
            console.log("connectionData---", connectionData);
            return (
              <Card key={item.id} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    {/* Content Section */}
                    <div className="flex flex-col gap-4">
                      {/* Name and Type */}
                      <h2 className="font-semibold text-xl">
                        {connectionData?.connection_name}
                      </h2>

                      {/* API Method */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Server className="h-5 w-5" />
                        <span>Status: {connectionData?.status}</span>
                      </div>

                      {/* API URL */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <LinkIcon className="h-5 w-5" />
                        <span className="truncate">
                          Connection Group: {item?.connection_group}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="h-5 w-5" />
                        <span>Test Status: </span>
                        <p>{connectionData?.test_status}</p>
                      </div>

                      {/* Created Date */}

                      {/* Test Status and Actions */}
                      <div className="flex items-center justify-between">
                        {/* Actions */}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-5 w-5" />
                          <span>Created: {formatDate(item?.created_date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/AgentMaker/connections/edit/${item.id}/${item.connection_group}`}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleDelete(item.id, fetchConnections)
                            }
                          >
                            <Trash2 className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConnectionsNew;
