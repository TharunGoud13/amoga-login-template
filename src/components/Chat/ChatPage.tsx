import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Contacts from "./TabPages/Contacts";

const ChatPage = () => {
  return (
    <div className="w-full">
      <Tabs className="w-full" defaultValue="contacts">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>
        <TabsContent value="chats">
          <h1>Chat</h1>
        </TabsContent>
        <TabsContent value="contacts">
          <Contacts />
        </TabsContent>
        <TabsContent value="groups">
          <h1>Groups</h1>
        </TabsContent>
        <TabsContent value="agents">
          <h1>Agents</h1>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatPage;
