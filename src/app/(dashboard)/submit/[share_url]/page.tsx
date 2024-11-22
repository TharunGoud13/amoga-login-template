"use client";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NEXT_PUBLIC_API_KEY, SAVE_FORM_DATA } from "@/constants/envConfig";
import React, { useEffect, useState } from "react";

const Page = (props: any) => {
  const [data, setData] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const pathName = props.params.share_url;

  const getDataFromUrl = async (url: string) => {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
      headers.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: headers,
      };

      const response = await fetch(
        `${SAVE_FORM_DATA}?share_url=eq.${pathName}`,
        requestOptions
      );
      const result = await response.json();
      console.log("result----",result)
      if (response.ok) {
        toast({ description: "Data fetched successfully", variant: "default" });
        setData(result);
        if (result.length > 0) {
          const initialFormData = result[0].form_json.reduce(
            (acc: Record<string, string | boolean>, field: any) => ({
              ...acc,
              [field.name]: field.value || "",
            }),
            {}
          );
          setFormData(initialFormData);
        }
      }
    } catch (error) {
      toast({ description: "Something went wrong", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getDataFromUrl(pathName);
  }, [pathName]);

  const renderFormFields = () => {
    if (data.length === 0) return null;

    const formJson = data[0].form_json || [];
    return formJson.map((field: any, index: number) => {
      switch (field.variant) {
        case "Text Box":
          return (
            <div key={index} className="mb-4">
              <Label htmlFor={field.name} className="block mb-1">
                {field.label}
              </Label>
              <Input
                type={field.type || "text"}
                name={field.name}
                id={field.name}
                placeholder={field.placeholder}
                onChange={handleChange}
                disabled={field.disabled}
                required={field.required}
              />
            </div>
          );
        // Add other variants if needed, e.g., TextArea, Select, Checkbox
        default:
          return null;
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast({ description: "Form submitted successfully!", variant: "default" });
  };

  return (
    <div className="p-6 flex flex-col justify-center items-center  h-screen">
      
      <form onSubmit={handleSubmit} className="w-[30%] rounded border-gray-500 p-5 shadow-lg shadow-gray-400">
        {renderFormFields()}
        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Page;
