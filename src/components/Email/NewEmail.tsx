"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { EMAIL_LIST_API, GET_CONTACTS_API } from "@/constants/envConfig";
import { toast } from "../ui/use-toast";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../ui/multi-select";
import { Textarea } from "../ui/textarea";
import {
  Bold,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Paperclip,
  Save,
  Send,
  Underline,
} from "lucide-react";
import { LuImage } from "react-icons/lu";
import axiosInstance from "@/utils/axiosInstance";
import { useCustomSession } from "@/utils/session";

const NewEmail = ({ data, isEdit }: { data?: any; isEdit?: boolean }) => {
  const [users, setUsers] = useState([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [to, setTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const session = useCustomSession();
  const router = useRouter();

  console.log("data----", data);

  useEffect(() => {
    if (data) {
      setSubject(data?.subject);
      //   setTo(data?.to_user_email);
      setCc(data?.cc_emails);
      setBcc(data?.bcc_emails);
      setMessage(data?.body);
      if (data?.cc_emails?.length > 0) {
        setShowCc(true);
      }
      if (data?.bcc_emails?.length > 0) {
        setShowBcc(true);
      }
    }
  }, [data, isEdit]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(GET_CONTACTS_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });
      if (!response.ok) {
        toast({
          description: "Failed to fetch plan group",
          variant: "destructive",
        });
        return;
      }
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  console.log("showCc", showCc);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      created_user_id: session?.user?.id,
      created_user_name: session?.user?.name,
      created_date: new Date().toISOString(),
      business_name: session?.user?.business_name,
      business_number: session?.user?.business_number,
      subject: subject,
      sender_email: session?.user?.email,
      sender_name: session?.user?.name,
      sender_mobile: session?.user?.mobile,
      to_user_email: to,
      cc_emails: cc,
      bcc_emails: bcc,
      body: message,
      from_user_email: session?.user?.email,
      from_user_name: session?.user?.name,
    };
    const response = await axiosInstance.post(EMAIL_LIST_API, payload);
    if (response.status === 201) {
      setIsLoading(false);
      toast({
        description: "Email sent successfully",
        variant: "default",
      });
    } else {
      setIsLoading(false);
      toast({
        description: "Failed to send email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isEdit ? "View Email" : "New Email"}
        </h1>
        <Button
          variant={"outline"}
          className="border-0"
          onClick={() => router.back()}
        >
          Back to Email
        </Button>
      </div>
      <div>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <Label htmlFor="select-template">Select Template</Label>
                <Select>
                  <SelectTrigger id="select-template">
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent></SelectContent>
                </Select>
              </div>
              <div className="mt-4">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                  id="subject"
                  placeholder="Enter Subject"
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="from">From</Label>
                <Select>
                  <SelectTrigger id="from">
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent></SelectContent>
                </Select>
              </div>
              <div className="mt-4">
                <div className="flex justify-between">
                  <Label htmlFor="to">To</Label>
                  <div className="flex gap-2">
                    <Label
                      htmlFor="cc"
                      className="text-blue-400 cursor-pointer"
                      onClick={() => setShowCc(!showCc)}
                    >
                      Cc
                    </Label>
                    <Label
                      htmlFor="bcc"
                      className="text-blue-400 cursor-pointer"
                      onClick={() => setShowBcc(!showBcc)}
                    >
                      Bcc
                    </Label>
                  </div>
                </div>

                <MultiSelector
                  values={to}
                  onValuesChange={(values: string[]) => setTo(values)}
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select: To" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {users.map((item: any) => (
                        <MultiSelectorItem
                          key={item.user_catalog_id}
                          value={item.user_email}
                        >
                          {item.user_email}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </div>
              {showCc && (
                <div className="mt-4">
                  <div className="flex justify-between">
                    <Label htmlFor="Cc">Cc</Label>
                  </div>

                  <MultiSelector
                    values={cc}
                    onValuesChange={(values: string[]) => setCc(values)}
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Select: Cc" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {users.map((item: any) => (
                          <MultiSelectorItem
                            key={item.user_catalog_id}
                            value={item.user_email}
                          >
                            {item.user_email}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </div>
              )}
              {showBcc && (
                <div className="mt-4">
                  <div className="flex justify-between">
                    <Label htmlFor="Bcc">Bcc</Label>
                  </div>

                  <MultiSelector
                    values={bcc}
                    onValuesChange={(values: string[]) => setBcc(values)}
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Select: Bcc" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {users.map((item: any) => (
                          <MultiSelectorItem
                            key={item.user_catalog_id}
                            value={item.user_email}
                          >
                            {item.user_email}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </div>
              )}
              <div>
                <Label>Message</Label>
                <div className="border rounded-md overflow-hidden mt-1">
                  {/* Toolbar */}
                  <div className="flex items-center p-2 border-b bg-gray-50">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Underline"
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                    <div className="h-6 border-l mx-2"></div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Bullet List"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Numbered List"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <div className="h-6 border-l mx-2"></div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Insert Link"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Insert Image"
                    >
                      <LuImage className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Attach File"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Editor Content */}
                  <div
                    className="p-4 min-h-[300px] prose max-w-none focus:outline-none"
                    contentEditable={true}
                    onInput={(e) =>
                      setMessage((e.target as HTMLDivElement).innerHTML)
                    }
                    suppressContentEditableWarning={true}
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between gap-2">
                <Button variant={"outline"} type="button">
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant={"outline"}
                    type="button"
                    disabled={isLoading}
                    className="flex items-center gap-2.5"
                  >
                    <Save className="h-5 w-5" />
                    Save as Draft
                  </Button>
                  <Button
                    disabled={isLoading}
                    className="flex items-center gap-2.5"
                  >
                    <Send className="h-5 w-5" />
                    {isLoading ? "Sending..." : "Send"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewEmail;
