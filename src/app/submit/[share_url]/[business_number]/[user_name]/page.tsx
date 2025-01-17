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
} from "@/components/form-builder-2/generate-code-parts";
import { renderFormField } from "@/components/form-builder-2/render-form-field";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { trackPageView } from "@/utils/tracking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatPreview from "@/components/form-builder-2/ChatPreview";
import ChatwithData from "@/components/form-builder-2/ChatWithData";
import { Session } from "@/components/form-builder-2/FormBuilder";

const renderFormFields = (fields: any, form: any) => {
  const apiFieldData = "";
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
                      renderFormField(
                        field,
                        form,
                        apiFieldData
                      ) as React.ReactElement,
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
                  renderFormField(
                    fieldOrGroup,
                    form,
                    apiFieldData
                  ) as React.ReactElement,
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
  const { data: sessionData } = useSession();
  const session: Session | null = sessionData
    ? (sessionData as unknown as Session)
    : null;
  const pathName = props.params.share_url;
  const [loading, setLoading] = useState(false);

  const hasExcludedVariants = formJsonData.some(
    (item) =>
      item.variant === "Media Card & Social Icons" ||
      item.variant === "Bar Chart with Social"
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
      session_id: session?.user?.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function validApiFields(apiUrl: string, formData: any) {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
      headers.append("Content-Type", "application/json");

      const response = await fetch(apiUrl, { method: "GET", headers: headers });
      if (!response.ok) {
        toast({
          description: "Error fetching API fields",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      const data = await response.json();
      const sampleRecord = Array.isArray(data) ? data[0] : data;

      const apiFields = new Set(Object.keys(sampleRecord));

      const invalidFields = Object.keys(formData).filter(
        (field) => !apiFields.has(field)
      );
      if (invalidFields.length > 0) {
        toast({ description: "Invalid fields", variant: "destructive" });
        return {
          isValid: false,
          invalidFields,
          error: `Fields not found in API schema: ${invalidFields.join(", ")}`,
        };
      }
      return {
        isValid: true,
        invalidFields: [],
      };
    } catch (error) {
      console.error("Error fetching API fields", error);
      return {
        isValid: false,
        invalidFields: [],
        error: "Failed to validate API schema",
      };
    }
  }

  async function onSubmit(data: any) {
    const fieldMapping = formJsonData.reduce((acc: any, field: any) => {
      if (Array.isArray(field)) {
        // Handle grouped fields
        field.forEach((subField) => {
          acc[subField.name] = subField.label;
        });
      } else {
        acc[field.name] = field.label;
      }
      return acc;
    }, {});

    // Transform the submitted data to use labels as keys
    const transformedData = Object.entries(data).reduce(
      (acc: any, [key, value]) => {
        const label = fieldMapping[key] || key; // Fallback to original key if label not found
        acc[label] = value;
        return acc;
      },
      {}
    );

    if (formData[0]?.data_api_url) {
      // Validate fields against API schema
      const validation = await validApiFields(
        formData[0].data_api_url,
        transformedData
      );

      if (validation && !validation.isValid) {
        toast({
          description: validation.error,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // If validation passed, save to the API
      const apiHeaders = new Headers();
      apiHeaders.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
      apiHeaders.append("Content-Type", "application/json");

      const apiResponse = await fetch(formData[0].data_api_url, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(transformedData),
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to save data to API");
      }
    }
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
    headers.append("Content-Type", "application/json");
    const date = new Date();
    const formUrl = `${process.env.NEXT_PUBLIC_API_URL}/submit/${pathName}/business_number=${session?.user?.business_number}/user_name=${session?.user?.name}`;
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
        toast({ description: "File not found", variant: "destructive" });
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

    const videoUploadVariant = formJsonData.find(
      (item) => item.variant === "Video Upload"
    );

    if (videoUploadVariant) {
      const uploadedVideoUrl = localStorage.getItem("uploadedVideoUrl");
      if (uploadedVideoUrl) {
        data.video_url = uploadedVideoUrl;
      }
    }

    const imageUploadVariant = formJsonData.find(
      (item) => item.variant === "Image Upload"
    );

    if (imageUploadVariant) {
      const uploadedImageUrl = localStorage.getItem("uploadedImageUrl");
      if (uploadedImageUrl) {
        data.image_url = uploadedImageUrl;
      }
    }

    const pdfUploadVariant = formJsonData.find(
      (item) => item.variant === "PDF Upload"
    );

    if (pdfUploadVariant) {
      const uploadedImageUrl = localStorage.getItem("uploadedPdfUrl");
      if (uploadedImageUrl) {
        data.pdf_url = uploadedImageUrl;
      }
    }

    const sendImageVariant = formJsonData.find(
      (item) => item.variant === "Send Image"
    );

    if (sendImageVariant) {
      const image_url = formJsonData.map(
        (item) => item.variant === "Send Image"
      );
      if (image_url) {
        data.send_file_url = formJsonData.map(
          (item) => item.variant === "Send Image" && item.placeholder_file_url
        );
      }
    }

    const sendVideoVariant = formJsonData.find(
      (item) => item.variant === "Send Video"
    );

    if (sendVideoVariant) {
      const video_url = formJsonData.map(
        (item) => item.variant === "Send Video"
      );
      if (video_url) {
        data.send_file_video_url = formJsonData.map(
          (item) => item.variant === "Send Video" && item.placeholder_video_url
        );
      }
    }

    const sendFileVariant = formJsonData.find(
      (item) => item.variant === "Send File"
    );

    if (sendFileVariant) {
      const video_url = formJsonData.map(
        (item) => item.variant === "Send File"
      );
      if (video_url) {
        data.send_file_upload_url = formJsonData.map(
          (item) =>
            item.variant === "Send File" && item.placeholder_file_upload_url
        );
      }
    }

    const sendPdfVariant = formJsonData.find(
      (item) => item.variant === "Send Pdf"
    );

    if (sendPdfVariant) {
      const video_url = formJsonData.map((item) => item.variant === "Send Pdf");
      if (video_url) {
        data.send_file_pdf_url = formJsonData.map(
          (item) => item.variant === "Send Pdf" && item.placeholder_pdf_file_url
        );
      }
    }

    const sendMediaCardVariant = formJsonData.find(
      (item) => item.variant === "Send Media Card"
    );

    if (sendMediaCardVariant) {
      const media_url = formJsonData.map(
        (item) => item.variant === "Send Media Card"
      );
      if (media_url) {
        data.media_url = formJsonData.map(
          (item) =>
            item.variant === "Send Media Card" &&
            item.media_card_data?.media_url
        );
        data.card_type = formJsonData.map(
          (item) =>
            item.variant === "Send Media Card" &&
            item.media_card_data?.card_type
        );
        data.html_content = formJsonData.map(
          (item) =>
            item.variant === "Send Media Card" &&
            item.media_card_data?.custom_html
        );
      }
    }

    const analyticCardVariant = formJsonData.find(
      (item) => item.variant === "Analytic Card"
    );

    if (analyticCardVariant) {
      const media_url = formJsonData.map(
        (item) => item.variant === "Analytic Card"
      );
      if (media_url) {
        data.analytic_card = formJsonData.map(
          (item) =>
            item.variant === "Analytic Card" && item.media_card_data?.card_json
        );
      }
    }

    const payload = {
      form_id: formData[0].form_id,
      form_name: formData[0].form_name,
      created_user_id: session?.user?.id,
      created_user_name: session?.user?.name,
      created_date: formatDateToCustomFormat(date),
      form_data: transformedData,
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
          session_id: session?.user?.id,
        });
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
          session_id: session?.user?.id,
        });
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
        response_status_code: 400,
        response_status: "FAILED",
        share_url: pathName,
        user_id: session?.user?.id,
        user_email: session?.user?.email,
        user_name: session?.user?.name,
        session_id: session?.user?.id,
      });
      form.reset();
      setLoading(false);
    }
  }

  return (
    <div className="md:p-6 flex flex-col justify-center items-center">
      <Tabs defaultValue="form" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-full bg-muted p-1 text-muted-foreground">
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
              value="chat-with-data"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              Chat with data
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="form">
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
        </TabsContent>
        <TabsContent value="chat">
          <div className=" flex justify-center items-center">
            <ChatPreview formFields={formJsonData} />
          </div>
        </TabsContent>
        <TabsContent value="chat-with-data">
          <div className=" flex justify-center items-center">
            <ChatwithData formFields={formJsonData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
