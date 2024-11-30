"use client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  ADD_FORM_DATA,
  NEXT_PUBLIC_API_KEY,
  SAVE_FORM_DATA,
} from "@/constants/envConfig";
import React, { useEffect, useState } from "react";
import If from "@/components/ui/if";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generateDefaultValues,
  generateZodSchema,
} from "@/components/form-builder/generate-code-parts";
import { renderFormField } from "@/components/form-builder/render-form-field";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { trackPageView } from "@/utils/tracking";

const renderFormFields = (fields: any, form: any) => {
  return fields.map((fieldOrGroup: any, index: any) => {
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
                <FormItem
                  className={`col-span-${getColSpan(fieldOrGroup.length)}`}
                >
                  <FormControl>
                    {React.cloneElement(
                      renderFormField(field, form) as React.ReactElement,
                      {
                        ...formField,
                      }
                    )}
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
                {React.cloneElement(
                  renderFormField(fieldOrGroup, form) as React.ReactElement,
                  {
                    ...formField,
                  }
                )}
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
  const { data: session } = useSession();
  const pathName = props.params.share_url;
  const [loading, setLoading] = useState(false);

  const hasExcludedVariants = formJsonData.some(
    (item) => (item.variant === "Media Card & Social Icons" || item.variant === "Bar Chart with Social")
  );
  
  // Conditionally generate the schema and default values
  const formSchema = hasExcludedVariants
    ? z.object({}) // Use an empty schema if excluded variants are present
    : generateZodSchema(formJsonData);
  
  const defaultVals = hasExcludedVariants
    ? {} // Use empty default values if excluded variants are present
    : generateDefaultValues(formJsonData);
  
  // Use the schema only if it's not empty
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: hasExcludedVariants ? undefined : zodResolver(formSchema),
    defaultValues: defaultVals,
  });

  useEffect(() => {
    trackPageView({
      description: "Form Page Viewed",
      http_method: "GET",
      http_url: `${SAVE_FORM_DATA}?share_url=eq.${pathName}`,
      response_status_code: 200,
      response_status: "SUCCESS",
      share_url: pathName,
      user_id: session?.user?.id,
      user_email: session?.user?.email,
      user_name: session?.user?.name,
      session_id: session?.user?.id

    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

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

  // console.log("formJsonData----", formJsonData);

  async function onSubmit(data: any) {
    // console.log("formdata-----", formData);
    // console.log("data-----", data);
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
    headers.append("Content-Type", "application/json");
    const date = new Date();
    const formUrl = `${process.env.NEXT_PUBLIC_API_URL}/submit/${pathName}`;
    setLoading(true);

    const isFileUploadVariant = formJsonData.some(
      (item) => item.variant === "File Upload"
    );

    if (isFileUploadVariant) {
      const uploadedFileUrl = localStorage.getItem("uploadedFileUrl");
      if (uploadedFileUrl) {
        data.file_url = uploadedFileUrl;
        Object.keys(data).forEach((key) => {
          if (
            typeof data[key] === "string" &&
            data[key].startsWith("C:\\fakepath\\")
          ) {
            // Extract file name from path (split on backslash and take the last part)
            const fileName = data[key].split("\\").pop();
            data[key] = fileName;
          }
        });
      } else {
        console.warn("No file URL found in localStorage");
      }
    }

    const mediaCardVariant = formJsonData.find(
      (item) => item.variant === "Media Card & Social Icons"
    );

    if (mediaCardVariant) {
      data.imageUrl = mediaCardVariant.value.url;
      data.title = mediaCardVariant.value.title;
      data.description = mediaCardVariant.value.description;
    }

    const payload = {
      form_id: formData[0].form_id,
      form_name: formData[0].form_name,
      created_user_id: session?.user?.id,
      created_user_name: session?.user?.name,
      created_date: formatDateToCustomFormat(date),
      form_data: data,
      form_data_row_api: formUrl,
    };
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    };
    try {
      const response = await fetch(ADD_FORM_DATA, requestOptions);
      if (response.ok) {
        toast({
          description: "Form submitted successfully",
          variant: "default",
        });
        trackPageView({
          description: "Form Submitted Successfully",
          http_method: "POST",
          http_url: ADD_FORM_DATA,
          response_status_code: 201,
          response_status: "SUCCESS",
          response_payload: JSON.stringify(payload),
          share_url: pathName,
          user_id: session?.user?.id,
          user_email: session?.user?.email,
          user_name: session?.user?.name,
          session_id: session?.user?.id
    
        })
        form.reset();
        setLoading(false);
      } else {
        trackPageView({
          description: "Form Submission Failed",
          http_method: "POST",
          http_url: ADD_FORM_DATA,
          response_status_code: 400,
          response_status: "FAILURE",
          share_url: pathName,
          user_id: session?.user?.id,
          user_email: session?.user?.email,
          user_name: session?.user?.name,
          session_id: session?.user?.id
    
        })
        toast({
          description: "Failed to submit the form. Please try again.",
          variant: "destructive",
        });
        form.reset();
        setLoading(false);
      }
    } catch (error) {
      toast({
        description: "Failed to submit the form. Please try again.",
        variant: "destructive",
      });
      trackPageView({
        description: "Form Submission Failed",
        http_method: "POST",
        http_url: ADD_FORM_DATA,
        response_status_code:400,
        response_status: "FAILED",
        share_url: pathName,
        user_id: session?.user?.id,
        user_email: session?.user?.email,
        user_name: session?.user?.name,
        session_id: session?.user?.id
  
      })
      form.reset();
      setLoading(false);
    }
  }

  return (
    <div className="md:p-6 flex flex-col justify-center items-center">
      <If
        condition={formJsonData.length > 0}
        render={() => (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4  md:w-[50%] md:border p-5 rounded  py-5 max-w-lg mx-auto"
            >
              {renderFormFields(formJsonData, form)}
              <Button className="w-full" type="submit">
                {loading ? "Submitting..." : "Submit"}
              </Button>
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
