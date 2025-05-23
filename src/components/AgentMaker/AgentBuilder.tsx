"use client";
import React, { useEffect, useState } from "react";

import { AgentFieldType, FormFieldType } from "@/types";
import { defaultFieldConfig } from "@/constants";
import If from "../ui/if";
import { FormFieldList } from "./FormFieldList";
import { FormPreview } from "./FormPreview";
import { EditFieldDialog } from "./EditFieldDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  SAVE_FORM_DATA,
  SAVE_FORM_FIELDS,
  NEXT_PUBLIC_API_KEY,
} from "@/constants/envConfig";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "../ui/use-toast";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, Search, Settings, Copy } from "lucide-react";
import { FormSettingsModal } from "./form-settings-modal";
import { fieldTypes } from "@/constants/agentIndex";
import { ChatForm } from "./ChatPreview";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { ChatWithDB } from "./ChatWithData";
import Link from "next/link";

export interface Session {
  user: {
    name: string;
    email: string;
    id: string | number;
    business_number: string | number;
    business_name: string;
    first_name: string;
    last_name: string;
    business_postcode: string;
    roles: string;
    roles_json: string[];
  };
}

export type FormFieldOrGroup = FormFieldType | FormFieldType[];

export default function AgentBuilder() {
  const t = useTranslations();
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;
  const router = useRouter();
  const path = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([]);
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formInput, setFormInput] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [apiFieldData, setApiFieldData] = React.useState<any>([]);
  const [apiEndpoint, setApiEndpoint] = React.useState("");
  const [contentData, setContentData] = React.useState("");
  const [formStatus, setFormStatus] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");
  const [redirectUrl, setRedirectUrl] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [apiConnectionJson, setApiConnectionJson] = React.useState("");
  const [dbConnectionJson, setDbConnectionJson] = React.useState("");
  const [documentConnectionJson, setDocumentConnectionJson] =
    React.useState("");
  const [editModeData, setEditModeData] = useState<any>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [editFormInput, setEditFormInput] = useState("");

  const currentPath = path.includes("edit");
  const currentId = path.split("/").at(-1);

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

    const newField: AgentFieldType = {
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
      radiogroup: [],
      placeholder_file_url: "",
      placeholder_video_url: "",
      placeholder_file_upload_url: "",
      placeholder_pdf_file_url: "",
      validation_message: "",
      variant_code: newFieldName,
      use_settings_upload: false,
      media_card_data: {
        media_url: "",
        card_type: "",
        card_json: [],
        custom_html: "",
        use_upload: false,
        action_urls: {
          like: "",
          favorite: "",
          task: "",
          chat: "",
          share: "",
        },
        component_name: "",
      },
      chat_with_data: {
        buttons: [
          {
            button_text: "",
            prompt: "",
            api_response: [],
            dataApi_response: [],
            enable_api: false,
            enable_dataApi: false,
            enable_prompt: false,
            promptDataFilter: "",
            apiDataFilter: "",
            component_name: "",
            metricApi: "",
            metricApiEnabled: false,
            storyApiEnabled: false,
            storyName: "",
            storyCode: "",
          },
        ],
      },
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
      validation_message: "",
      variant_code: `name_${Math.random().toString().slice(-10)}`,
    };
  };

  useEffect(() => {
    if (formFields.length === 0) {
      setFormFields([createDefaultTextArea()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formFields.length]);

  function formatDateToCustomFormat(date: Date) {
    const pad = (num: any, size = 2) => String(num).padStart(size, "0");
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
        `${SAVE_FORM_FIELDS}?form_id=eq.${currentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${NEXT_PUBLIC_API_KEY}`,
          },
        }
      );

      const result = await response.json();
      console.log("result----", result);
      setEditModeData(result[0]);
      const formUuid = result[0].form_uuid;
      const formName = result[0].form_name;
      setShareUrl(
        `${process.env.NEXT_PUBLIC_APP_URL}/AgentMaker/${formUuid}/${formName}`
      );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  useEffect(() => {
    if (currentPath && editModeData?.cardui_json) {
      setFormFields(editModeData?.cardui_json);
      setEditFormInput(editModeData?.form_name || "");
      setFormInput(editModeData?.form_name || "");
      setApiEndpoint(editModeData?.data_api_url || "");
      setContentData(editModeData?.content || "");
      setFormStatus(editModeData?.status || "");
      setSuccessMsg(editModeData?.form_success_message || "");
      setRedirectUrl(editModeData?.form_success_url || "");
      setSelectedUsers(editModeData?.users_json || []);
      setApiConnectionJson(
        editModeData?.api_connection_json
          ? JSON.stringify(editModeData.api_connection_json)
          : ""
      );
      setDbConnectionJson(
        editModeData?.db_connection_json
          ? JSON.stringify(editModeData.db_connection_json)
          : ""
      );
      setDocumentConnectionJson(
        editModeData?.doc_connection_json
          ? JSON.stringify(editModeData.doc_connection_json)
          : ""
      );
    }
  }, [currentPath, editModeData]);

  const handleSave = async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
    const date = new Date();
    setIsLoading(true);

    const activeFormFields = formFields
      .filter((field: any) => {
        if (Array.isArray(field)) {
          return field.some((subField: any) => !subField.disabled);
        }
        return !field.disabled;
      })
      .map((field: any) => {
        if (Array.isArray(field)) {
          return field.filter((subField: any) => !subField.disabled);
        }
        return field;
      });

    const nameFields =
      activeFormFields &&
      activeFormFields.flatMap((field: any) =>
        Array.isArray(field)
          ? field.map((subField: any) => subField.label)
          : field.label
      );

    if (formInput === "") {
      toast({
        description: "Form name cannot be empty",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const formCode = `Agent_${Math.random().toString().slice(-4)}`;
    const formUuid = uuidv4();

    const payload = {
      status: formStatus,
      created_user_id: session?.user?.id,
      created_user_name: session?.user?.name,
      business_number: session?.user?.business_number,
      business_name: session?.user?.business_name,
      created_date: formatDateToCustomFormat(date),
      form_name: formInput,
      form_json: activeFormFields,
      version_no: currentPath ? (editModeData?.version_no || 0) + 1 : 1,
      form_group: "Agents",
      form_code: currentPath ? editModeData?.form_code : formCode,
      form_uuid: currentPath ? editModeData?.form_uuid : formUuid,
      agent_uuid: currentPath ? editModeData?.agent_uuid : formUuid,
      data_api_url: apiEndpoint,
      content: contentData,
      form_success_url: redirectUrl,
      form_success_message: successMsg,
      share_url: currentPath ? editModeData?.share_url : uuidv4(),
      users_json: selectedUsers,
      custom_one: nameFields,
      api_connection_json: apiConnectionJson && JSON.parse(apiConnectionJson),
      db_connection_json: dbConnectionJson && JSON.parse(dbConnectionJson),
      doc_connection_json:
        documentConnectionJson && JSON.parse(documentConnectionJson),
    };

    try {
      let response;
      let formId;

      if (currentPath && editModeData) {
        // Update existing agent
        response = await fetch(`${SAVE_FORM_DATA}?form_id=eq.${currentId}`, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(payload),
        });
        formId = currentId;
      } else {
        // Create new agent
        response = await fetch(SAVE_FORM_DATA, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save form");
      }

      // Get the form ID if it's a new agent
      if (!currentPath) {
        const getFormSetupData = await fetch(
          `${SAVE_FORM_DATA}?form_uuid=eq.${payload.form_uuid}`,
          {
            method: "GET",
            headers: headers,
          }
        );
        const result = await getFormSetupData.json();
        formId = result[0].form_id;
      }

      const formFieldsData = {
        form_id: formId,
        created_date: formatDateToCustomFormat(date),
        form_name: formInput,
        form_code: currentPath ? editModeData?.form_code : formCode,
        field_name: activeFormFields.map((field: any) => field.name),
        label: activeFormFields.map((field: any) => field.label),
        variant: activeFormFields.map((field: any) => field.variant_code),
        description: activeFormFields.map((field: any) => field.description),
        users_json: selectedUsers,
        form_uuid: currentPath ? editModeData?.form_uuid : formUuid,
        agent_uuid: currentPath ? editModeData?.agent_uuid : formUuid,
        upload_placeholder:
          activeFormFields.length > 0
            ? activeFormFields[0].placeholder_file_upload_url || ""
            : "",
        link:
          activeFormFields.length > 0
            ? activeFormFields[0].placeholder_file_url || ""
            : "",
        file_url:
          activeFormFields.length > 0 ? activeFormFields[0].file_url || "" : "",
        classname:
          activeFormFields.length > 0
            ? activeFormFields[0].classNname || ""
            : "",
        upload_file_path:
          activeFormFields.length > 0
            ? activeFormFields[0].use_file_path || ""
            : "",
        use_api:
          activeFormFields.length > 0
            ? Boolean(activeFormFields[0].use_api)
            : false,
        use_upload_placeholder:
          activeFormFields.length > 0
            ? Boolean(activeFormFields[0].use_upload_placeholder)
            : false,
        use_file_url:
          activeFormFields.length > 0
            ? Boolean(activeFormFields[0].use_file_url)
            : false,
        is_required:
          activeFormFields.length > 0
            ? Boolean(activeFormFields[0].required)
            : false,
        validation_message:
          activeFormFields.length > 0
            ? Boolean(activeFormFields[0].validation_message)
            : false,
        hidden:
          activeFormFields.length > 0
            ? Boolean(activeFormFields[0].disabled)
            : false,
        placeholder: activeFormFields.map(
          (field: any) => field.placeholder || ""
        ),
        cardui_json: activeFormFields,
      };

      // Update or create form fields
      if (currentPath) {
        // Update existing form fields
        const updateFormFieldsResponse = await fetch(
          `${SAVE_FORM_FIELDS}?form_id=eq.${formId}`,
          {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(formFieldsData),
          }
        );

        if (!updateFormFieldsResponse.ok) {
          throw new Error("Failed to update form fields");
        }
      } else {
        // Create new form fields
        const saveFormFieldsResponse = await fetch(SAVE_FORM_FIELDS, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(formFieldsData),
        });

        if (!saveFormFieldsResponse.ok) {
          throw new Error("Failed to save form fields");
        }
      }

      setIsLoading(false);
      toast({ description: "Form saved successfully", variant: "default" });

      // Always redirect to edit route
      router.push(`/AgentMaker/edit/${formId}`);

      // Clear form only if it's a new agent
      if (!currentPath) {
        setFormFields([]);
        setFormInput("");
        setApiConnectionJson("");
        setDbConnectionJson("");
        setDocumentConnectionJson("");
      }
    } catch (error) {
      setIsLoading(false);
      toast({ description: "Failed to save form", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

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

  const updateFormField = (path: number[], updates: Partial<FormFieldType>) => {
    const updatedFields = JSON.parse(JSON.stringify(formFields));
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
    <section className="p-2.5 w-full  space-y-8">
      <Card>
        <CardContent>
          <div className="w-full min-h-screen overflow-y-auto   md:p-4 space-y-6">
            <div className="flex  justify-between items-center">
              <h1 className="text-2xl font-semibold">
                {currentPath ? "Edit Agent" : "New Agent"}
              </h1>
              <Link href="/AgentMaker">
                <Button variant="outline">Back to Agent Maker</Button>
              </Link>
            </div>
            <div className="border rounded-lg p-4 mb-8">
              <div className="flex items-center gap-4">
                <Input
                  className="text-xl font-medium border-none bg-transparent focus-visible:ring-0 p-0 h-auto placeholder:text-muted-foreground"
                  placeholder="Enter agent name"
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
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Version No. {1}. {"Mar 05"}
              </div>
              {shareUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="text-sm bg-muted"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      toast({
                        description: "URL copied to clipboard",
                        variant: "default",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
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
                    value="chat_with_data"
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
                  <Card className="p-4 mt-5">
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
                        {filteredComponents.map((component, index) => (
                          <Button
                            key={component.name}
                            variant="ghost"
                            className="w-full justify-start mb-2"
                            onClick={() => addFormField(component.name, index)}
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

              <TabsContent value="chat_with_data">
                <div className="max-w-[950px] h-full">
                  {formFields?.length > 0 ? (
                    <ChatWithDB
                      formFields={formFields}
                      apiFieldData={apiFieldData}
                    />
                  ) : (
                    <div className="h-[50vh] flex justify-center items-center">
                      <p>No form element selected yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="json">
                <div className="w-full h-full">
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
            existingField={formFields.map((field: any) => field?.name)}
            setApiFieldData={setApiFieldData}
          />

          <FormSettingsModal
            editModeData={formFields}
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            apiEndpoint={apiEndpoint}
            setApiEndpoint={setApiEndpoint}
            setContentData={setContentData}
            setFormStatus={setFormStatus}
            setFormInput={setFormInput}
            setSuccessMsg={setSuccessMsg}
            setRedirectActionUrl={setRedirectUrl}
            formInput={formInput}
            setUsersSelected={setSelectedUsers}
            apiConnectionJson={apiConnectionJson}
            setApiConnectionJson={setApiConnectionJson}
            dbConnectionJson={dbConnectionJson}
            setDbConnectionJson={setDbConnectionJson}
            documentConnectionJson={documentConnectionJson}
            setDocumentConnectionJson={setDocumentConnectionJson}
            shareUrl={shareUrl}
          />
        </CardContent>
      </Card>
    </section>
  );
}
