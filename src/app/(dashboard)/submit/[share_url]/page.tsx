"use client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ADD_FORM_DATA, NEXT_PUBLIC_API_KEY, SAVE_FORM_DATA } from "@/constants/envConfig";
import React, { useEffect, useState } from "react";
import If from "@/components/ui/if";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateDefaultValues, generateZodSchema } from "@/components/form-builder/generate-code-parts";
import { renderFormField } from "@/components/form-builder/render-form-field";
import { z } from "zod";
import { useSession } from "next-auth/react";

const renderFormFields = (fields: any, form: any) => {
  return fields.map((fieldOrGroup:any, index:any) => {
    if (Array.isArray(fieldOrGroup)) {
      const getColSpan = (totalFields: number) => {
        switch (totalFields) {
          case 2:
            return 6;
          case 3:
            return 4; 
          default:
            return 12;
        }
      };

      return (
        <div key={index} className="grid grid-cols-12 gap-4">
          {fieldOrGroup.map((field, subIndex) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem className={`col-span-${getColSpan(fieldOrGroup.length)}`}>
                  <FormControl>
                    {React.cloneElement(renderFormField(field, form) as React.ReactElement, {
                      ...formField,
                    })}
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
      );
    } else {
      return (
        <FormField
          key={index}
          control={form.control}
          name={fieldOrGroup.name}
          render={({ field: formField }) => (
            <FormItem className="col-span-12">
              <FormControl>
                {React.cloneElement(renderFormField(fieldOrGroup, form) as React.ReactElement, {
                  ...formField,
                })}
              </FormControl>
            </FormItem>
          )}
        />
      );
    }
  });
};

const Page = (props: any) => {
  const [formData, setData] = useState<any>([]);
  const [formJsonData, setFormJsonData] = useState<any[]>([]);
  const {data: session} = useSession();
  const pathName = props.params.share_url;
  const [loading, setLoading] = useState(false);

  const formSchema = generateZodSchema(formJsonData);

  const defaultVals = generateDefaultValues(formJsonData);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultVals,
  });

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

      if (response.ok) {
        toast({ description: "Data fetched successfully", variant: "default" });
        setData(result);

        // Set the form_json field data to the new state
        if (result.length > 0) {
          const formJson = result[0].form_json || [];
          setFormJsonData(formJson);
        }
      }
    } catch (error) {
      toast({ description: "Something went wrong", variant: "destructive" });
    }
  };

  useEffect(() => {
    getDataFromUrl(pathName);
  }, [pathName]);



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


  async function onSubmit(data: any) {
    console.log("formdata-----",formData)
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
    headers.append("Content-Type", "application/json");
    const date = new Date();
    const formUrl = `${process.env.NEXT_PUBLIC_API_URL}/submit/${pathName}`;
    setLoading(true);

    const payload = {
      form_id: formData[0].form_id,
      form_name: formData[0].form_name,
      created_user_id: session?.user?.id,
      created_user_name: session?.user?.name,
      created_date: formatDateToCustomFormat(date),
      form_data: data,
      form_data_row_api: formUrl,

    }
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    };
    try {
      const response = await fetch(ADD_FORM_DATA, requestOptions)
      if(response.ok){
        toast({ description: "Form submitted successfully", variant: "default" });
        form.reset();
        setLoading(false);
      }
      else{
        toast({ description: "Failed to submit the form. Please try again.", variant: "destructive" });
        form.reset();
        setLoading(false);
      }
    } catch (error) {
      // toast.error('Failed to submit the form. Please try again.')
      toast({ description: "Failed to submit the form. Please try again.", variant: "destructive" });
      form.reset();
      setLoading(false);
    }
  }

  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <If
        condition={formJsonData.length > 0}
        render={() => (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 border-gray-400 w-[50%] border p-5 rounded shadow-lg shadow-gray-500 py-5 max-w-lg mx-auto"
            >
              {renderFormFields(formJsonData, form)}
              <Button className="w-full" type="submit">{loading?"Submitting..." : "Submit"}</Button>
            </form>
          </Form>
        )}
        otherwise={() => (
          <div className="h-[50vh] flex justify-center items-center">
            <p>No form element selected yet.</p>
          </div>
        )}
      />
    </div>
  );
};

export default Page;
