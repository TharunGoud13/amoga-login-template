"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";
import { generateTemplate } from "./actions";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { NEXT_PUBLIC_API_KEY, STORY_TEMPLATE } from "@/constants/envConfig";
import { useSession } from "next-auth/react";
import { Session } from "../form-builder-2/FormBuilder";

export default function BuildTemplate() {
  const [templateName, setTemplateName] = useState("");
  const [additionalField, setAdditionalField] = useState("");
  const [dataModel, setDataModel] = useState("");
  const [pugTemplate, setPugTemplate] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;
  console.log("session---", session);
  console.log("date---", new Date().toDateString());

  const handleSave = async () => {
    try {
      const header = new Headers();
      header.append("Content-Type", "application/json");
      header.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);

      const requestOptions = {
        method: "POST",
        headers: header,
        body: JSON.stringify({
          created_user_id: session?.user?.id,
          created_user_name: session?.user?.name,
          created_date: new Date().toDateString(),
          business_name: session?.user?.business_name,
          business_number: session?.user?.business_number,
          template_name: templateName,
          template_type: additionalField,
          template_json: dataModel,
          pug_template: pugTemplate,
          prompt_response: response,
        }),
      };

      const result = await fetch(STORY_TEMPLATE, requestOptions);
      console.log("result---", result);
      if (!result.ok) {
        toast({
          variant: "destructive",
          description: "Failed to save template",
        });
        return;
      }
      toast({
        variant: "default",
        description: "Template saved successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to save template",
      });
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (
        templateName.length === 0 ||
        additionalField.length === 0 ||
        dataModel.length === 0 ||
        prompt.length === 0
      ) {
        toast({
          variant: "destructive",
          description: "Please enter required field",
        });
      }
      const template = await generateTemplate(dataModel, prompt);
      setLoading(false);
      setPugTemplate(template);
      console.log("template---", template);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "An error occurred while generating template",
      });
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-2 mt-3">
          <Label htmlFor="templateName">Template Name</Label>
          <Input
            id="templateName"
            placeholder="Enter template name..."
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template-type">Template Type</Label>
          <Select onValueChange={(option) => setAdditionalField(option)}>
            <SelectTrigger id="template-type">
              <SelectValue placeholder="Select option to filter data" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="narrative">Narrative</SelectItem>
                <SelectItem value="pug">Pug</SelectItem>
                <SelectItem value="json">Json</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dataModel">Data Model JSON</Label>
          <Textarea
            id="dataModel"
            placeholder="Enter your data model JSON here..."
            value={dataModel}
            onChange={(e) => setDataModel(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="prompt">Prompt</Label>
            <Button
              variant="outline"
              size="sm"
              disabled={
                loading ||
                !(prompt && templateName && dataModel && additionalField)
              }
              onClick={handleGenerate}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
          <Textarea
            id="prompt"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="response">Response</Label>
          <Textarea
            id="response"
            placeholder="Generated response will appear here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pugTemplate">.pug Template</Label>
          <CodeEditor
            id="pugTemplate"
            placeholder="Enter your .pug template here..."
            value={pugTemplate}
            language="pug"
            onChange={(e) => setPugTemplate(e.target.value)}
            className="min-h-[200px] rounded-md"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={
            loading ||
            !(
              prompt &&
              templateName &&
              dataModel &&
              additionalField &&
              pugTemplate
            )
          }
          onClick={handleSave}
        >
          Save Template
        </Button>
      </CardFooter>
    </Card>
  );
}
