"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { generateTemplate } from "../actions";
import CodeEditor from "@uiw/react-textarea-code-editor";
import {
  NEXT_PUBLIC_API_KEY,
  STORY_TEMPLATE,
  TEMPLATE_API,
} from "@/constants/envConfig";
import { useSession } from "next-auth/react";
import { Session } from "@/components/form-builder-2/FormBuilder";
import Link from "next/link";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { CalendarDatePicker } from "@/components/ui/calendar-date-picker";
import axiosInstance from "@/utils/axiosInstance";

export default function NewStory({
  isEdit,
  isView,
  id,
  storyId,
}: {
  isEdit: boolean;
  isView: boolean;
  id?: string;
  storyId?: string;
}) {
  const [formData, setFormData] = useState({
    date: new Date(),
    storyTitle: "",
    storyCategory: "",
    shortDescription: "",
    description: "",
    storyData: "",
    storyExtractMetrics: "",
    storyPrompt: "",
    storyScript: "",
    storyResponse: "",
    storyCardJson: "",
    storyAutomation: "",
    storyWorkflow: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;

  useEffect(() => {
    if (isEdit && storyId) {
      const fetchStory = async () => {
        const response = await axiosInstance.get(
          `${STORY_TEMPLATE}?story_id=eq.${storyId}`
        );
        const data = response.data[0];
        setFormData({
          date: data.created_date,
          storyTitle: data.story_title,
          storyCategory: data.story_category,
          shortDescription: data.story_short_description,
          description: data.story_description,
          storyData: data.story_data_json,
          storyExtractMetrics: data.story_extract_metrics,
          storyPrompt: data.story_prompt,
          storyScript: data.story_script,
          storyResponse: data.story_response,
          storyCardJson: data.story_card_json,
          storyAutomation: data.story_automation_json,
          storyWorkflow: data.story_workflow_json,
          status: data.status,
        });
      };
      fetchStory();
    }
  }, [isEdit, storyId]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const header = new Headers();
      header.append("Content-Type", "application/json");
      header.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);

      const requestOptions = {
        created_user_id: session?.user?.id,
        created_user_name: session?.user?.name,
        created_date: new Date(formData.date).toISOString(),
        business_name: session?.user?.business_name,
        business_number: session?.user?.business_number,
        ref_template_code: id,
        story_title: formData.storyTitle,
        story_category: formData.storyCategory,
        story_short_description: formData.shortDescription,
        story_description: formData.description,
        story_data_json: formData.storyData,
        story_extract_metrics: formData.storyExtractMetrics,
        story_prompt: formData.storyPrompt,
        story_script: formData.storyScript,
        story_response: formData.storyResponse,
        story_card_json: formData.storyCardJson,
        story_automation_json: formData.storyAutomation,
        story_workflow_json: formData.storyWorkflow,
        status: formData.status,
      };

      const resultSave = await fetch(
        isEdit ? `${STORY_TEMPLATE}?story_id=eq.${storyId}` : STORY_TEMPLATE,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${NEXT_PUBLIC_API_KEY}`,
          },
          method: isEdit ? "PATCH" : "POST",
          body: JSON.stringify(requestOptions),
        }
      );
      if (!resultSave.ok) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="mt-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">New Story</h2>
          <Button variant="outline" size="sm">
            <Link href={`/StoryMaker/Story/${id}`}>Back to Story</Link>
          </Button>
        </div>
        <div className="space-y-2 mt-3">
          <Label htmlFor="date">Current Date</Label>
          <CalendarDatePicker
            date={formData.date}
            onDateSelect={(date: any) =>
              setFormData({ ...formData, date: date })
            }
            placeholder="Current Date"
          />
        </div>
        <div className="space-y-2 mt-3">
          <Label htmlFor="storyTitle">Story Title</Label>
          <Input
            id="storyTitle"
            placeholder="Enter story title"
            value={formData.storyTitle}
            onChange={(e) =>
              setFormData({ ...formData, storyTitle: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category-type">Story Category</Label>
          <Select
            value={formData.storyCategory}
            onValueChange={(option) =>
              setFormData({ ...formData, storyCategory: option })
            }
          >
            <SelectTrigger id="category-type">
              <SelectValue placeholder="Select Story Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="data-narrative">Data Narrative</SelectItem>
                <SelectItem value="facts">Facts</SelectItem>
                <SelectItem value="metrics">Metrics</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="media">Media</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="short-description">Short Description</Label>
          <Textarea
            id="short-description"
            placeholder="Enter your short description here"
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter your description here..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="story-data">Story Data</Label>
          <Textarea
            id="story-data"
            placeholder="Enter your story data here..."
            value={formData.storyData}
            onChange={(e) =>
              setFormData({ ...formData, storyData: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="story-extract-metrics">Story Extract Metrics</Label>
          <Textarea
            id="story-extract-metrics"
            placeholder="Enter your story extract metrics here..."
            value={formData.storyExtractMetrics}
            onChange={(e) =>
              setFormData({ ...formData, storyExtractMetrics: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="story-prompt">Story Prompt</Label>

          <Textarea
            id="story-prompt"
            placeholder="Enter your prompt here..."
            value={formData.storyPrompt}
            onChange={(e) =>
              setFormData({ ...formData, storyPrompt: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="story-script">Story Script</Label>

          <Textarea
            id="story-script"
            placeholder="Enter your script here..."
            value={formData.storyScript}
            onChange={(e) =>
              setFormData({ ...formData, storyScript: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="story-response">Story Response</Label>
          <Textarea
            id="story-response"
            placeholder="Enter your response here..."
            value={formData.storyResponse}
            onChange={(e) =>
              setFormData({ ...formData, storyResponse: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="story-card-json">Story Card JSON</Label>
          <Textarea
            id="story-card-json"
            placeholder="Enter your card json here..."
            value={formData.storyCardJson}
            onChange={(e) =>
              setFormData({ ...formData, storyCardJson: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="story-automation">Story Automation</Label>
          <Textarea
            id="story-automation"
            placeholder="Enter your automation here..."
            value={formData.storyAutomation}
            onChange={(e) =>
              setFormData({ ...formData, storyAutomation: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="story-workflow">Story Workflow</Label>

          <Textarea
            id="story-workflow"
            placeholder="Enter your workflow here..."
            value={formData.storyWorkflow}
            onChange={(e) =>
              setFormData({ ...formData, storyWorkflow: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>
        <div>
          <div className="flex justify-between">
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
          </div>
          <Select
            disabled={isView}
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="InActive">InActive</SelectItem>
              <SelectItem value="Complete">Complete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Link href={`/StoryMaker/Story/${id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button
          disabled={
            loading ||
            !(
              formData.storyTitle &&
              formData.storyCategory &&
              formData.shortDescription &&
              formData.description &&
              formData.storyData &&
              formData.storyExtractMetrics &&
              formData.storyPrompt &&
              formData.storyScript &&
              formData.storyResponse &&
              formData.storyAutomation &&
              formData.storyWorkflow &&
              formData.status
            )
          }
          onClick={handleSave}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
