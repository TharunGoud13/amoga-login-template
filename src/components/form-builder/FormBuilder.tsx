/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
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
import EmptyListImage from "@/assets/oc-thinking.png";
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

export type FormFieldOrGroup = FormFieldType | FormFieldType[];

export default function FormBuilder() {
  const { data: session } = useSession();
  const path = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const currentPath = path.includes("edit");
  const currentId = path.split("/").at(-1)

  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([]);
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formInput, setFormInput] = useState("");
  const [editModeData, setEditModeData] = useState<any>([])
  const [editFormInput, setEditFormInput] = useState<any>("")



  const addFormField = (variant: string, index: number) => {
    const newFieldName = `name_${Math.random().toString().slice(-10)}`;

    const { label, description, placeholder } = defaultFieldConfig[variant] || {
      label: "",
      description: "",
      placeholder: "",
    };

    const newField: FormFieldType = {
      checked: true,
      description: description || "",
      disabled: false,
      label: label,
      name: newFieldName,
      onChange: () => { },
      onSelect: () => { },
      placeholder: placeholder || "Placeholder",
      required: true,
      rowIndex: index,
      setValue: () => { },
      type: "",
      value: "",
      variant,
    };
    setFormFields([...formFields, newField]);
  };

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
    try{
    const response = await fetch(`${SAVE_FORM_DATA}?form_id=eq.${currentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NEXT_PUBLIC_API_KEY}`,
      },
    });

    const result = await response.json();
    setEditModeData(result[0])
    if(response.ok){
      toast({ description: "Data fetched successfully", variant: "default" });
    }
    else{
      toast({ description: "Failed to fetch data", variant: "destructive" });
    }
    
  }
  catch(error){
    console.log("Error in fetching data", error);
    toast({ description: "Error in fetching data", variant: "destructive" });
  }
  };

  useEffect(() => {
    if(currentPath){
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


    const payload = {
      status: "active",
      created_user_id: session?.user?.id,
      created_user_name: session?.user?.name,
      created_date: formatDateToCustomFormat(date),
      form_name: formInput,
      form_json: formFields,
      version_no: 1,
      share_url: uuidv4(),
    };

    try {
      let response;

      if (currentPath && editModeData) {
        const updatePayload = {
          ...payload,
          form_json: formFields,
          form_name: editFormInput,
          version_no: editModeData?.version_no + 1
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

  const FieldSelectorWithSeparator = ({
    addFormField,
  }: {
    addFormField: (variant: string, index?: number) => void;
  }) => (
    <div className="flex flex-col md:flex-row gap-3">
      <FieldSelector addFormField={addFormField} />
      <Separator orientation={isDesktop ? "vertical" : "horizontal"} />
    </div>
  );

  return (
    <section className="p-2.5 space-y-8">
      <Tabs
        defaultValue={currentPath ? "edit" : "form"}
        className=" pt-5 pr-5 pl-5"
      >
        <TabsList
          className={`grid md:w-[400px] ${
            currentPath ? "grid-cols-4" : "grid-cols-3"
          }`}
        >
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="list">Forms</TabsTrigger>
          <TabsTrigger value="entries">Entries</TabsTrigger>
          {currentPath && <TabsTrigger value="edit">Edit</TabsTrigger>}
        </TabsList>
        <TabsContent value="form">
          <div className="flex flex-col items-end">
            <div className="flex flex-end w-full justify-end pt-4 gap-2.5 md:w-[400px] items-center">
              <Input
                type="text"
                value={formInput}
                onChange={(e) => setFormInput(e.target.value)}
                placeholder="Enter form name"
              />
              <Button onClick={handleSave}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
            <div className="flex md:w-[400px] text-primary text-sm justify-between pt-3">
              <span>Version No: 1.0</span>
              <span>Date: 19 Nov 2024</span>
            </div>
          </div>
          <If
            condition={formFields && formFields.length > 0}
            render={() => (
              <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8 md:px-5 h-full">
                <div className="w-full h-full col-span-1 md:space-x-3 md:max-h-[75vh] flex flex-col md:flex-row ">
                  <FieldSelectorWithSeparator
                    addFormField={(variant: string, index: number = 0) =>
                      addFormField(variant, index)
                    }
                  />
                  <div className="overflow-y-auto  flex-1 ">
                    <FormFieldList
                      formFields={formFields}
                      setFormFields={setFormFields}
                      updateFormField={updateFormField}
                      openEditDialog={openEditDialog}
                    />
                  </div>
                </div>
                <div className="col-span-1 w-full h-full space-y-3">
                  <SpecialComponentsNotice formFields={formFields} />
                  <FormPreview formFields={formFields} />
                </div>
              </div>
            )}
            otherwise={() => (
              <div className="flex flex-col md:flex-row items-center gap-3 md:px-5">
                <FieldSelectorWithSeparator
                  addFormField={(variant: string, index: number = 0) =>
                    addFormField(variant, index)
                  }
                />
                <Image
                  src={EmptyListImage}
                  width={585}
                  height={502}
                  alt="Empty Image"
                  className="object-contain mx-auto p-5 md:p-20"
                />
              </div>
            )}
          />
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
        <TabsContent value="entries">
          <Entries />
        </TabsContent>
        <TabsContent value="edit">
          <div className="flex flex-col items-end">
            <div className="flex flex-end w-full justify-end pt-4 gap-2.5 md:w-[400px] items-center">
              <Input
                type="text"
                value={editFormInput}
                onChange={(e) => setEditFormInput(e.target.value)}
                placeholder="Enter form name"
              />
              <Button onClick={handleSave}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
            <div className="flex md:w-[400px] text-primary text-sm justify-between pt-3">
              <span>Version No: 1.0</span>
              <span>Date: 19 Nov 2024</span>
            </div>
          </div>
          <If
            condition={formFields && formFields.length > 0}
            render={() => (
              <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8 md:px-5 h-full">
                <div className="w-full h-full col-span-1 md:space-x-3 md:max-h-[75vh] flex flex-col md:flex-row ">
                  <FieldSelectorWithSeparator
                    addFormField={(variant: string, index: number = 0) =>
                      addFormField(variant, index)
                    }
                  />
                  <div className="overflow-y-auto  flex-1 ">
                    <FormFieldList
                      formFields={formFields}
                      setFormFields={setFormFields}
                      updateFormField={updateFormField}
                      openEditDialog={openEditDialog}
                    />
                  </div>
                </div>
                <div className="col-span-1 w-full h-full space-y-3">
                  <SpecialComponentsNotice formFields={formFields} />
                  <FormPreview formFields={formFields} />
                </div>
              </div>
            )}
            otherwise={() => (
              <div className="flex flex-col md:flex-row items-center gap-3 md:px-5">
                <FieldSelectorWithSeparator
                  addFormField={(variant: string, index: number = 0) =>
                    addFormField(variant, index)
                  }
                />
                <Image
                  src={EmptyListImage}
                  width={585}
                  height={502}
                  alt="Empty Image"
                  className="object-contain mx-auto p-5 md:p-20"
                />
              </div>
            )}
          />
          <EditFieldDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            field={selectedField}
            onSave={handleSaveField}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
