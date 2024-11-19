"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  File,
  GripVertical,
  KeyRound,
  Link2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Square,
  Trash2,
  Type,
} from "lucide-react";
import FormComponentRenderer from "./generate-code-fields";
import { Badge } from "../ui/badge";

type FormComponent = {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
};

const COMPONENT_TYPES = [
  { type: "checkbox", label: "Checkbox" },
  { type: "combobox", label: "Combobox" },
  { type: "datepicker", label: "Date Picker" },
  {
    type: "datetimepicker",
    label: "Datetime Picker",
  },
  { type: "file", label: "File Input" },
  { type: "input", label: "Input" },
  { type: "otp", label: "Input OTP" },
  { type: "location", label: "Location Input", isNew: true },
  { type: "multiselect", label: "Multi Select" },
  { type: "password", label: "Password" },
  { type: "phone", label: "Phone" },
  { type: "select", label: "Select" },
  { type: "signatureinput", label: "Signature Input" },
  { type: "slider", label: "Slider" },
  { type: "smartdatetimeinput", label: "Smart Datetime Input" },
  { type: "switch", label: "Switch" },
  { type: "tagsinput", label: "Tags Input" },
  { type: "textarea", label: "Textarea" },
];

const Form = () => {
  const [formInput, setFormInput] = useState("");
  const [components, setComponents] = useState<FormComponent[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState("preview");
  const [editingComponent, setEditingComponent] = useState<string | null>(null);

  const addComponent = (type: string) => {
    const componentType = COMPONENT_TYPES.find((c) => c.type === type);
    if (!componentType) return;

    const newComponent = {
      id: `${type}-${Date.now()}`,
      type,
      label: `${componentType.label}`,
      required: false,
      placeholder: `Enter ${componentType.label.toLowerCase()}`,
    };
    setComponents([...components, newComponent]);
  };

  const handleSave = () => {
    console.log("formInput----", formInput);
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter((c) => c.id !== id));
    if (editingComponent === id) {
      setEditingComponent(null);
    }
  };

  const updateComponent = (id: string, updates: Partial<FormComponent>) => {
    setComponents(
      components.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleFormDataChange = (id: string, value: any) => {
    setFormData({ ...formData, [id]: value });
  };

  const renderJson = () => {
    const formJson = {
      components: components.map(
        ({ id, type, label, required, placeholder }) => ({
          id,
          type,
          label,
          required,
          placeholder,
        })
      ),
      formData,
    };
    return (
      <pre className="bg-muted p-4 rounded-lg overflow-auto">
        {JSON.stringify(formJson, null, 2)}
      </pre>
    );
  };

  return (
    <div>
      <div className="flex pt-4 gap-2.5 md:w-[400px] items-center">
        <Input
          type="text"
          value={formInput}
          onChange={(e) => setFormInput(e.target.value)}
          placeholder="Enter form name"
        />
        <Button onClick={handleSave}>Save</Button>
      </div>
      <div className="flex md:w-[400px] text-primary text-sm justify-between pt-3">
        <span>Version No: 1.0</span>
        <span>Date: 19 Nov 2024</span>
      </div>
      {/* Left Sidebar */}
      <div className="flex pt-5 flex-col md:flex-row">
        <div className="w-64 border-r p-4  overflow-auto">
          <div className="space-y-2.5">
            {COMPONENT_TYPES.map((component) => (
              <Badge
                key={component.type}
                variant="outline"
                onClick={() => addComponent(component.type)}
                className="flex items-center hover:bg-secondary cursor-pointer font-semibold  justify-between w-fit p-2 "
              >
                <div className="flex items-center gap-2">
                  <span>{component.label}</span>
                </div>
                {/* {component.isNew && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                  New
                </span>
              )} */}
              </Badge>
            ))}
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex-1 p-4 border-r overflow-auto">
          <div className="space-y-4">
            {components.map((component) => (
              <div 
              key={component.id}
              className="flex items-center gap-2.5 w-full relative group"
              >
                <GripVertical className="text-gray-400 cursor-grab"/>
                <div
                  className="relative p-2.5  w-[90%] bg-background rounded-xl border group"
                >
                  <div className="flex items-center justify-between">
                    {/* <span>{component.label}</span> */}
                    <FormComponentRenderer
                      component={component}
                      isEditing={editingComponent === component.id}
                      formData={formData}
                      onFormDataChange={handleFormDataChange}
                      onLabelChange={(id, label) =>
                        updateComponent(id, { label })
                      }
                    />
                    <div className="flex items-center gap-2">
                      {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button> */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          setEditingComponent(
                            editingComponent === component.id
                              ? null
                              : component.id
                          )
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeComponent(component.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button className="rounded-full">+</Button>
                
              </div>
            ))}
          </div>
        </div>

        {/* Right Preview */}
        <div className="w-96 p-4 bg-background overflow-auto">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-semibold">Preview</h2>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="ml-auto"
            >
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mt-4">
            {activeTab === "preview" && (
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {components.map((component) => (
                  <div key={component.id}>
                    <FormComponentRenderer
                      component={component}
                      isEditing={editingComponent === component.id}
                      formData={formData}
                      onFormDataChange={handleFormDataChange}
                      onLabelChange={(id, label) =>
                        updateComponent(id, { label })
                      }
                    />
                  </div>
                ))}
                {components.length > 0 && (
                  <Button className="w-full" type="submit">
                    Submit
                  </Button>
                )}
              </form>
            )}
            {activeTab === "json" && renderJson()}
            {/* {activeTab === "code" && (
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {`// Component code will be generated here`}
            </pre>
          )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
