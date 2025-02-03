"use client";
import { Session } from "@/components/doc-template/DocTemplate";
import HeadingTemplate from "@/components/myDocs/HeadingTemplate";
import ImageTemplate from "@/components/myDocs/ImageTemplate";
import RichTextTemplate from "@/components/myDocs/RichTextTemplate";
import TableTemplate from "@/components/myDocs/TableTemplate";
import VideoTemplate from "@/components/myDocs/VideoTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { MY_DOC_CONTENT, MY_DOC_LIST } from "@/constants/envConfig";
import { ArrowLeft, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ComponentData {
  id: string;
  type: string;
  content: string;
}

const COMPONENT_MAP = {
  "Heading Label": HeadingTemplate,
  "Rich Text Editor": RichTextTemplate,
  Table: TableTemplate,
  Image: ImageTemplate,
  Video: VideoTemplate,
};

const EditDoc = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  console.log("id-----", id);
  const [template, setTemplate] = useState<any>(null);
  const [componentsData, setComponentsData] = useState<ComponentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;
  const router = useRouter();

  console.log("template-----", template);
  console.log("componentsData-----", componentsData);

  useEffect(() => {
    const fetchDocContent = async () => {
      const response = await fetch(`${MY_DOC_CONTENT}?mydoc_list_id=eq.${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });
      const data = await response.json();
      console.log("data-----", data);
      console.log("data-----", data);
      const template = {
        mydoc_list_id: data[0].mydoc_list_id,
        template_name: data[0].doc_name,
        components: data.flatMap((item: any) => {
          const types = JSON.parse(item.component_type);
          let fieldContent = item.field_content;

          try {
            fieldContent = JSON.parse(item.field_content);
            if (
              Array.isArray(fieldContent) &&
              fieldContent.length > 0 &&
              fieldContent[0].content
            ) {
              fieldContent = fieldContent[0].content;
            }
            if (
              typeof fieldContent === "string" &&
              fieldContent.startsWith("[")
            ) {
              const parsedContent = JSON.parse(fieldContent);
              if (
                Array.isArray(parsedContent) &&
                parsedContent.length > 0 &&
                parsedContent[0].content
              ) {
                fieldContent = parsedContent[0].content.trim();
              }
            }
          } catch (error) {
            console.warn(
              "Content is not JSON, using raw string:",
              item.field_content
            );
          }

          return types.map((type: string) => ({
            id: `${item.mydoc_list_id}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            type,
            content: fieldContent,
          }));
        }),
      };

      setTemplate(template);
      setComponentsData(template.components);
      console.log("data-----", data);
    };
    fetchDocContent();
  }, [id]);

  const handleContentChange = (id: string, content: string) => {
    setComponentsData((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, content } : comp))
    );
  };

  const handleEditSave = async () => {
    setIsLoading(true);
    if (!template) {
      toast({
        description: "No template selected",

        variant: "destructive",
      });
      return;
    }

    // Ensure at least one component has content
    const hasContent = componentsData.some(
      (comp) => comp.content.trim() !== ""
    );
    if (!hasContent) {
      toast({
        description: "Please enter content in at least one component",
        variant: "destructive",
      });
      return;
    }

    // Create updated payload
    const updatedPayload = {
      mydoc_list_id: template.mydoc_list_id, // Unique document ID
      status: "Published",
      created_user_id: session?.user?.id,
      created_user_name: session?.user?.name,
      updated_date: new Date().toISOString(),
      doc_name: template.template_name,
      doc_json: JSON.stringify({
        template_id: template.mydoc_list_id,
        template_name: template.template_name,
        components: componentsData.map((comp) => ({
          type: comp.type,
          content: comp.content,
        })),
      }),
      content_json: JSON.stringify(componentsData),
    };

    // Send PATCH request to update the document
    const response = await fetch(
      `${MY_DOC_LIST}?mydoc_list_id=eq.${template.mydoc_list_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        body: JSON.stringify(updatedPayload),
      }
    );

    console.log("Edit response", response);

    if (!response.ok) {
      toast({
        description: "Failed to update document",
        variant: "destructive",
      });
      return;
    }

    // Update content in MY_DOC_CONTENT table
    const contentUpdatePayload = {
      field_content: JSON.stringify(componentsData),
      field_json: JSON.stringify(updatedPayload.doc_json),
      component_type: JSON.stringify(componentsData.map((comp) => comp.type)),
      doc_name: template.template_name,
    };

    const contentResponse = await fetch(
      `${MY_DOC_CONTENT}?mydoc_list_id=eq.${template.mydoc_list_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        body: JSON.stringify(contentUpdatePayload),
      }
    );
    setIsLoading(false);

    console.log("contentResponse", contentResponse);

    if (!contentResponse.ok) {
      setIsLoading(false);
      toast({
        description: "Failed to update content",
        variant: "destructive",
      });
    } else {
      toast({
        description: "Document updated successfully",
      });
      router.push("/myDocs");
    }
  };

  const renderComponent = (component: ComponentData) => {
    console.log("component", component);
    const Component =
      COMPONENT_MAP[component.type as keyof typeof COMPONENT_MAP];
    if (!Component) return null;

    return (
      <div key={component.id} className="mb-4">
        <Component
          content={component.content}
          onContentChange={(content: string) =>
            handleContentChange(component.id, content)
          }
        />
      </div>
    );
  };
  return (
    <div className="mx-auto flex items-center max-w-[800px] w-full p-4">
      <div className="space-y-8">
        <div>
          {template && (
            <div>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-0"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft /> Back to Doc List
                </span>
              </Button>
              <div className="flex items-center mt-2 justify-between mb-6">
                <Input
                  type="text"
                  value={template.template_name}
                  onChange={(e) =>
                    setTemplate((prev: any) =>
                      prev ? { ...prev, template_name: e.target.value } : null
                    )
                  }
                  className="text-4xl mb-1 font-bold tracking-tight border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                />
                <Button
                  className="rounded-full px-6 h-10 text-base"
                  onClick={handleEditSave}
                  disabled={isLoading}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>

              <div className="space-y-4">
                {componentsData.map(renderComponent)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditDoc;
