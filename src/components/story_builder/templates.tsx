"use client";

import { NEXT_PUBLIC_API_KEY, STORY_TEMPLATE } from "@/constants/envConfig";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { Card, CardContent } from "../ui/card";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    getTemplateData();
  }, []);
  const getTemplateData = async () => {
    try {
      const header = new Headers();
      header.append("Content-Type", "application/json");
      header.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);

      const requestOptions = {
        method: "GET",
        headers: header,
      };
      const response = await fetch(STORY_TEMPLATE, requestOptions);
      const result = await response.json();
      setTemplates(result);
      console.log("result---", result);
    } catch (error) {
      console.log("error---", error);
      toast({
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      {templates.map((template: any) => (
        <Card key={template} className="flex mt-2.5 gap-2.5">
          <CardContent className="p-2.5 space-y-2.5">
            <h3>Template Name: {template.template_name}</h3>
            <p>Template Type: {template.template_type}</p>
            <p>Template JSON: {template.template_json}</p>
            <p>PUG Template: {template.pug_template}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Templates;
