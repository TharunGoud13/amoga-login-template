"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutTemplate, Library, BookOpen } from "lucide-react";
import BuildTemplate from "./build-template";
import Templates from "./templates";
import Stories from "./stories";

export default function StoryBuilderTabs() {
  const [activeTab, setActiveTab] = useState("build-template");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger
          value="build-template"
          className="flex items-center justify-center"
        >
          <LayoutTemplate className="w-4 h-4 mr-2" />
          Build Template
        </TabsTrigger>
        <TabsTrigger
          value="templates"
          className="flex items-center justify-center"
        >
          <Library className="w-4 h-4 mr-2" />
          Templates
        </TabsTrigger>
        <TabsTrigger
          value="stories"
          className="flex items-center justify-center"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Stories
        </TabsTrigger>
      </TabsList>
      <TabsContent value="build-template">
        <BuildTemplate />
      </TabsContent>
      <TabsContent value="templates">
        <Templates />
      </TabsContent>
      <TabsContent value="stories">
        <Stories />
      </TabsContent>
    </Tabs>
  );
}
