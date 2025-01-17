import React, { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { fetchValidApi } from "@/utils/fetchValidApi";
import { toast } from "../ui/use-toast";

interface FormSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiEndpoint: string;
  setApiEndpoint: (value: string) => void;
}

export function FormSettingsModal({
  isOpen,
  onClose,
  setApiEndpoint,
}: FormSettingsModalProps) {
  const [apiUrl, setApiUrl] = useState("");
  const handleSave = async () => {
    const result = await fetchValidApi();
    const validApi = result.filter((item: any) => item.api_url === apiUrl);

    if (validApi.length > 0) {
      setApiEndpoint(apiUrl);
      toast({
        description: "API endpoint saved successfully",
        variant: "default",
      });
    } else {
      toast({ description: "Invalid API endpoint", variant: "destructive" });
    }
    onClose;
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Form Settings
            <Button variant="ghost" size="icon" onClick={onClose}>
              {/* <X className="h-4 w-4" /> */}
            </Button>
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="action">Action</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
            <div className="space-y-4">
              <div>
                <Label htmlFor="formName">Form Name</Label>
                <Input id="formName" placeholder="Enter form name" />
              </div>
              <div>
                <Label htmlFor="formDescription">Form Description</Label>
                <Textarea
                  id="formDescription"
                  placeholder="Enter form description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="formActive" />
                <Label htmlFor="formActive">Form Active</Label>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="content">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Form Content</h3>
              <p>
                Here you can manage the content structure of your form,
                including sections, fields, and layout options.
              </p>
              {/* Add more content management options here */}
            </div>
          </TabsContent>
          <TabsContent value="connection">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Data Connections</h3>
              <div>
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  id="apiEndpoint"
                  placeholder="Add API Endpoint"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="action">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Form Actions</h3>
              <p>Define what happens after the form is submitted.</p>
              <div>
                <Label htmlFor="successMessage">Success Message</Label>
                <Input
                  id="successMessage"
                  placeholder="Thank you for your submission!"
                />
              </div>
              <div>
                <Label htmlFor="redirectUrl">Redirect URL</Label>
                <Input
                  id="redirectUrl"
                  placeholder="https://example.com/thank-you"
                />
              </div>
              {/* Add more action options here */}
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
