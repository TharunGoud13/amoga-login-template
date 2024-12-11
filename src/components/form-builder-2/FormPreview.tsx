import React, { useRef } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
// import { toast } from '../ui/use-toast'
// import { renderFormField } from '@/screens/render-form-field'
import { renderFormField } from "./render-form-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import If from "@/components/ui/if";
import { FormFieldType } from "@/types";

import { Files } from "lucide-react";
// import {
//   generateZodSchema,
//   generateFormCode,
//   generateDefaultValues,
// } from '@/screens/generate-code-parts'
import {
  generateZodSchema,
  generateFormCode,
  generateDefaultValues,
} from "./generate-code-parts";
import { formatJSXCode } from "@/lib/utils";

export type FormFieldOrGroup = FormFieldType | FormFieldType[];

export type FormPreviewProps = {
  formFields: FormFieldOrGroup[];
  apiFieldData?: any
};

const renderFormFields = (fields: FormFieldOrGroup[], form: any, apiFieldData?: any) => {
  return fields.map((fieldOrGroup, index) => {
    if (Array.isArray(fieldOrGroup)) {
      // Calculate column span based on number of fields in the group
      const getColSpan = (totalFields: number) => {
        switch (totalFields) {
          case 2:
            return 6; // Two columns
          case 3:
            return 4; // Three columns
          default:
            return 12; // Single column or fallback
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
                      renderFormField(field, form, apiFieldData) as React.ReactElement,
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
                  renderFormField(fieldOrGroup, form, apiFieldData) as React.ReactElement,
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

export const FormPreview: React.FC<FormPreviewProps> = ({
  formFields,
  apiFieldData
  
}) => {
  const formSchema = generateZodSchema(formFields);

  const defaultVals = generateDefaultValues(formFields);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultVals,
  });

  function onSubmit(data: any) {
    try {
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }


  return (
    <div className="w-full  h-full rounded-xl flex justify-center">
      <If
        condition={formFields.length > 0}
        render={() => (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-5 w-full md:w-[90%] mx-auto"
            >
              {renderFormFields(formFields, form, apiFieldData)}
              {/* <Button type="submit">Submit</Button> */}
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
