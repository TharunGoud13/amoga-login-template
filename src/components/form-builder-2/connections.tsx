"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { ADD_CONNECTIONS, NEXT_PUBLIC_API_KEY } from "@/constants/envConfig";

type Connection = {
  id: string;
  status: "active" | "inactive";
  created_date: string;
  connection_name: string;
  connection_type: string;
  api_url: string;
  key: string;
  secret: string;
  test_status: "passed" | "failed" | "pending";
};



export function ConnectionTable() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredData, setFilteredData] = React.useState<Connection[]>([]);
  const [data, setData] = React.useState<Connection[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newConnection, setNewConnection] = React.useState<Partial<Connection>>(
    {
      status: "inactive",
      created_date: new Date().toISOString().split("T")[0],
      test_status: "pending",
    }
  );

  React.useEffect(() => {
    const results = data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    setFilteredData(results)
  }, [searchTerm])

  
    const fetchConnections = async () => {
      
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
        toast({ description: "Failed to fetch connections", variant: "destructive" });
        
      }
    };

    React.useEffect(() => {
      fetchConnections();
    }, []);
    


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewConnection({ ...newConnection, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewConnection({ ...newConnection, [name]: value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    setLoading(true)
    try{
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(newConnection),
    }
    e.preventDefault()
    console.log("details----",newConnection)
    const response = await fetch(ADD_CONNECTIONS,requestOptions)
    console.log("response----",response)
    if(!response.ok){
      toast({ description: "Failed to add connection", variant: "destructive" });
    }
    else{
      toast({ description: "Connection added successfully", variant: "default" });
      setLoading(false)
      setIsDialogOpen(false)
      fetchConnections()
    }
  }
  catch(error){
    setLoading(false)
    toast({ description: "Failed to add connection", variant: "destructive" });
  }
  finally{
    setLoading(false)
  }

  }

  const handleTestConnection = () => {
    // Simulating an API call
    toast({
      title: "Testing Connection...",
      description: "Attempting to connect to the specified API.",
    });
    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        toast({
          title: "Connection Test Successful",
          description: "The connection was tested successfully.",
        });
      } else {
        toast({
          title: "Connection Test Failed",
          description: "There was an error testing the connection.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="search"
          placeholder="Search connections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Connection</Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[800px]">
          <Card className="border-none">
          <CardHeader>
            <CardTitle>Add New Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="connection_name">Connection Name</Label>
                  <Input
                    id="connection_name"
                    name="connection_name"
                    value={newConnection.connection_name || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connection_type">Connection Type</Label>
                  <Select
                    value={newConnection.connection_type}
                    onValueChange={(value) => handleSelectChange("connection_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REST">REST</SelectItem>
                      <SelectItem value="GraphQL">GraphQL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api_url">API URL</Label>
                  <Input
                    id="api_url"
                    name="api_url"
                    value={newConnection.api_url || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key">Key</Label>
                  <Input
                    id="key"
                    name="key"
                    value={newConnection.key || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secret">Secret</Label>
                  <Input
                    id="secret"
                    name="secret"
                    type="password"
                    value={newConnection.secret || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newConnection.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Button type="submit">{loading ? "Adding Connection..." : "Add Connection"}</Button>
                <Button type="button" variant="outline" onClick={handleTestConnection}>Test Connection</Button>
              </div>
            </form>
          </CardContent>
        </Card>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Connection Name</TableHead>
            <TableHead>Connection Type</TableHead>
            <TableHead>API URL</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Secret</TableHead>
            <TableHead>Test Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Badge
                  variant={item.status === "active" ? "default" : "secondary"}
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{item.created_date}</TableCell>
              <TableCell>{item.connection_name}</TableCell>
              <TableCell>{item.connection_type}</TableCell>
              <TableCell>{item.api_url}</TableCell>
              <TableCell>{item.key}</TableCell>
              <TableCell>******</TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.test_status === "passed"
                      ? "default"
                      : item.test_status === "failed"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {item.test_status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
