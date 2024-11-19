import React from "react";
import Entries from "@/components/form_maker/Entries";
import Form from "@/components/form_maker/Form";
import List from "@/components/form_maker/List";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = () => {
  return (
    <div>
      <Tabs defaultValue="form" className=" pt-5 pr-5 pl-5">
        <TabsList className="grid md:w-[400px] grid-cols-3">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="entries">Entries</TabsTrigger>
        </TabsList>
          <TabsContent value="form">
            <Form/>
          </TabsContent>
          <TabsContent value="list">
            <List/>
          </TabsContent>
          <TabsContent value="entries">
            <Entries/>
          </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
