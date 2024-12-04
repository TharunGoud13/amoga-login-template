/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { FormFieldType } from "@/types";
import { defaultFieldConfig } from "@/constants";
import { useMediaQuery } from "../../../hooks/use-media-query";
import { Separator } from "@/components/ui/separator";
import If from "../ui/if";
import SpecialComponentsNotice from "./special-component-notice";
import { FieldSelector } from "./FieldSelector";
import { FormFieldList } from "./FormFieldList";
import { FormPreview } from "./FormPreview";
import { EditFieldDialog } from "./EditFieldDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import List from "./List/List";
import Entries from "./Entries";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { NEXT_PUBLIC_API_KEY, SAVE_FORM_DATA } from "@/constants/envConfig";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "../ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import View from "./View/View";
import { cn } from "@/lib/utils";
import { Plus, Search, Settings } from "lucide-react";
import { FormSettingsModal } from "./form-settings-modal";
import { fieldTypes } from "@/constants";

import FormCode from "./FormCode";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../ui/multi-select";
import { ChatForm } from "./ChatPreview";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export type FormFieldOrGroup = FormFieldType | FormFieldType[];

export default function FormBuilder() {
  const t = useTranslations();
  const { data: session } = useSession();
  const path = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([]);
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formInput, setFormInput] = useState("");
  const [editModeData, setEditModeData] = useState<any>([]);
  const [editFormInput, setEditFormInput] = useState<any>("");
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredFields, setFilteredFields] = useState(fieldTypes);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("Maker");
  const tabs = ["Maker", "Form", "Chat", "JSON"];

  const currentPath = path.includes("edit");
  const currentId = path.split("/").at(-1);
  const viewPath = path.includes("view");

  const filteredComponents = React.useMemo(
    () =>
      fieldTypes.filter((component) =>
        component.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const addFormField = (variant: string, index: number) => {
    const newFieldName = `name_${Math.random().toString().slice(-10)}`;

    const { label, description, placeholder } = defaultFieldConfig[variant] || {
      label: t(`FormLabels.${variant}`, { fallback: variant }),
      description: "",
      placeholder: "",
    };

    const newField: FormFieldType = {
      checked: true,
      description: description || "",
      disabled: false,
      label: label,
      name: newFieldName,
      onChange: () => {},
      onSelect: () => {},
      placeholder: placeholder || "Placeholder",
      required: true,
      rowIndex: index,
      setValue: () => {},
      type: "",
      value: "",
      variant,
      options: [],
      combobox: [],
      multiselect: [],
    };
    setFormFields([...formFields, newField]);
  };

  const createDefaultTextArea = () => {
    return {
      checked: true,
      description: "Enter your text here",
      disabled: false,
      label: "Text Area",
      name: `name_${Math.random().toString().slice(-10)}`,
      onChange: () => {},
      onSelect: () => {},
      placeholder: "Type your text...",
      required: true,
      rowIndex: formFields.length,
      setValue: () => {},
      type: "textarea",
      value: "",
      variant: "Text Area",
    };
  };

  useEffect(() => {
    if (formFields.length === 0) {
      setFormFields([createDefaultTextArea()]);
    }
  }, []);

  function formatDateToCustomFormat(date: Date) {
    const pad = (num: any, size = 2) => String(num).padStart(size, "0"); // Helper to pad numbers
    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}.` +
      `${pad(date.getMilliseconds(), 3)}`
    );
  }

  const getData = async () => {
    try {
      const response = await fetch(
        `${SAVE_FORM_DATA}?form_id=eq.${currentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${NEXT_PUBLIC_API_KEY}`,
          },
        }
      );

      const result = await response.json();
      setEditModeData(result[0]);
      if (response.ok) {
        toast({ description: "Data fetched successfully", variant: "default" });
      } else {
        toast({ description: "Failed to fetch data", variant: "destructive" });
      }
    } catch (error) {
      console.log("Error in fetching data", error);
      toast({ description: "Error in fetching data", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (currentPath) {
      getData();
    }
  }, []);

  useEffect(() => {
    if (currentPath && editModeData?.form_json) {
      setFormFields(editModeData.form_json);
      setEditFormInput(editModeData?.form_name || "");
    }
  }, [currentPath, editModeData]);

  const handleSave = async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
    const date = new Date();
    setIsLoading(true);
    const nameFields = formFields && formFields.map((field: any) => field.name);

    const payload = {
      status: "active",
      created_user_id: session?.user?.id,
      created_user_name: session?.user?.name,
      created_date: formatDateToCustomFormat(date),
      form_name: formInput,
      form_json: formFields,
      version_no: 1,
      share_url: uuidv4(),
      custom_one: nameFields,
    };

    try {
      let response;

      if (currentPath && editModeData) {
        const updatePayload = {
          ...payload,
          form_json: formFields,
          form_name: editFormInput,
          version_no: editModeData?.version_no + 1,
        };

        response = await fetch(`${SAVE_FORM_DATA}?form_id=eq.${currentId}`, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(updatePayload),
        });
      } else {
        response = await fetch(SAVE_FORM_DATA, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        setIsLoading(false);
        toast({ description: "Form saved successfully", variant: "default" });
        route.push(`/form_maker/${payload.share_url}`);
      } else {
        setIsLoading(false);
        toast({ description: "Failed to save form", variant: "destructive" });
      }

      setFormFields([]);
      setFormInput("");
    } catch (error) {
      setIsLoading(false);
      toast({ description: "Failed to save form", variant: "destructive" });
    }
  };

  console.log("formFields----", formFields);
  const findFieldPath = (
    fields: FormFieldOrGroup[],
    name: string
  ): number[] | null => {
    const search = (
      currentFields: FormFieldOrGroup[],
      currentPath: number[]
    ): number[] | null => {
      for (let i = 0; i < currentFields.length; i++) {
        const field = currentFields[i];
        if (Array.isArray(field)) {
          const result = search(field, [...currentPath, i]);
          if (result) return result;
        } else if (field.name === name) {
          return [...currentPath, i];
        }
      }
      return null;
    };
    return search(fields, []);
  };

  console.log("fieldTypes----", fieldTypes);

  const updateFormField = (path: number[], updates: Partial<FormFieldType>) => {
    const updatedFields = JSON.parse(JSON.stringify(formFields)); // Deep clone
    let current: any = updatedFields;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = {
      ...current[path[path.length - 1]],
      ...updates,
    };
    setFormFields(updatedFields);
  };

  const openEditDialog = (field: FormFieldType) => {
    setSelectedField(field);
    setIsDialogOpen(true);
  };

  const handleSaveField = (updatedField: FormFieldType) => {
    if (selectedField) {
      const path = findFieldPath(formFields, selectedField.name);
      if (path) {
        updateFormField(path, updatedField);
      }
    }
    setIsDialogOpen(false);
  };

  return (
    <section className="p-2.5  space-y-8">
      <Tabs
        defaultValue={currentPath ? "edit" : viewPath ? "view" : "form"}
        className=" pt-5 pr-5 pl-5"
      >
        <TabsList
          className={`grid md:w-[400px] ${
            currentPath
              ? "grid-cols-4"
              : viewPath
              ? "grid-cols-4"
              : "grid-cols-3"
          }`}
        >
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="list">Forms</TabsTrigger>
          <TabsTrigger value="entries">Entries</TabsTrigger>
          {currentPath && <TabsTrigger value="edit">Edit</TabsTrigger>}
          {viewPath && <TabsTrigger value="view">Form Data</TabsTrigger>}
        </TabsList>
        <TabsContent value="form">
          <div className="w-full min-h-screen overflow-y-auto  max-w-[800px] mx-auto md:p-4 space-y-6">
            <div className="border rounded-lg p-4 mb-8">
              <div className="flex items-center gap-4">
                <Input
                  className="text-xl font-medium border-none bg-transparent focus-visible:ring-0 p-0 h-auto placeholder:text-muted-foreground"
                  placeholder="Enter form name"
                  value={formInput}
                  onChange={(e) => setFormInput(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
                <Button onClick={handleSave} className="px-8">
                  {isLoading? "Saving..." : "Save"}
                </Button>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Version No. {4}. {"Dec 04"}
              </div>
            </div>

            <Tabs defaultValue="maker" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="inline-flex h-10 items-center justify-center rounded-full bg-muted p-1 text-muted-foreground">
                  <TabsTrigger
                    value="maker"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    Maker
                  </TabsTrigger>
                  <TabsTrigger
                    value="form"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    Form
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="json"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    JSON
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="maker">
                <>
                  <FormFieldList
                    formFields={formFields}
                    setFormFields={setFormFields}
                    updateFormField={updateFormField}
                    openEditDialog={openEditDialog}
                  />
                  <Card className="p-4 mt-5 ">
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="Search components"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <ScrollArea className="h-[300px]">
                        {filteredComponents.map((component,index) => (
                          <Button
                            key={component.name}
                            variant="ghost"
                            className="w-full justify-start mb-2"
                            onClick={() => addFormField(component.name,index)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            {component.name}
                          </Button>
                        ))}
                      </ScrollArea>
                    </div>
                  </Card>
                </>
              </TabsContent>
              <TabsContent value="form">
                <div className=" w-full h-full">
                  <FormPreview formFields={formFields} />
                </div>
              </TabsContent>

              <TabsContent value="chat">
                <div className=" w-full h-full">
                  {/* {formFields?.length > 0 ? (
                    <ChatForm formFields={formFields} />
                  ) : (
                    <div className="h-[50vh] flex justify-center items-center">
                      <p>No form element selected yet.</p>
                    </div>
                  )} */}
                  Chat
                </div>
              </TabsContent>
              <TabsContent value="json">
                <div className=" w-full h-full">
                  <If
                    condition={formFields.length > 0}
                    render={() => (
                      <pre className="p-4 text-sm bg-secondary rounded-lg h-full md:max-h-[70vh] overflow-auto">
                        {JSON.stringify(formFields, null, 2)}
                      </pre>
                    )}
                    otherwise={() => (
                      <div className="h-[50vh] flex justify-center items-center">
                        <p>No form element selected yet.</p>
                      </div>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <EditFieldDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            field={selectedField}
            onSave={handleSaveField}
          />
        </TabsContent>
        <TabsContent value="list">
          <List />
        </TabsContent>
        <TabsContent value="view">
          <View />
        </TabsContent>

        <TabsContent value="entries">
          <Entries />
        </TabsContent>
        <TabsContent value="edit">
          <div className="w-full min-h-screen overflow-y-auto max-w-[800px] mx-auto p-4 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="w-full">
                <Input
                  type="text"
                  value={editFormInput}
                  onChange={(e) => setEditFormInput(e.target.value)}
                  placeholder="Enter form name"
                />
                <div className="text-sm text-muted-foreground">
                  Version No. 19 Nov 2024
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
                <Button className="w-full sm:w-auto" onClick={handleSave}>
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>

            <div className="border-b">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                      activeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {activeTab === "maker" && (
              <>
                <FormFieldList
                  formFields={formFields}
                  setFormFields={setFormFields}
                  updateFormField={updateFormField}
                  openEditDialog={openEditDialog}
                />

                <div className="relative">
                  <MultiSelector
                    values={[]}
                    onValuesChange={(value) => {
                      const selectedField = filteredFields.find((field) =>
                        value.includes(field.name)
                      );
                      if (selectedField) {
                        const fieldIndex = filteredFields.findIndex(
                          (field) => field.name === selectedField.name
                        );
                        addFormField(selectedField.name, fieldIndex);
                      }
                    }}
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Add Component" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <div className="px-2 py-1"></div>
                      <MultiSelectorList>
                        {filteredFields.map((field, index) => (
                          <MultiSelectorItem
                            key={field.name}
                            value={field.name}
                          >
                            {field.name}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </div>
              </>
            )}
            {activeTab === "preview" && (
              <div className=" w-full h-full">
                <FormPreview formFields={formFields} />
              </div>
            )}
            {activeTab === "json" && (
              <div className=" w-full h-full">
                <If
                  condition={formFields.length > 0}
                  render={() => (
                    <pre className="p-4 text-sm bg-secondary rounded-lg h-full md:max-h-[70vh] overflow-auto">
                      {JSON.stringify(formFields, null, 2)}
                    </pre>
                  )}
                  otherwise={() => (
                    <div className="h-[50vh] flex justify-center items-center">
                      <p>No form element selected yet.</p>
                    </div>
                  )}
                />
              </div>
            )}

            {activeTab === "code" && <FormCode formFields={formFields} />}
          </div>
          <EditFieldDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            field={selectedField}
            onSave={handleSaveField}
          />
        </TabsContent>
        <FormSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </Tabs>
    </section>
  );
}
