

import React from 'react'
import { FormFieldType } from '@/types';
import If from '../ui/if';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { Files } from 'lucide-react';
import { Highlight, themes } from "prism-react-renderer";
import { formatJSXCode } from '@/lib/utils';
import { generateFormCode } from './generate-code-parts';


export type FormFieldOrGroup = FormFieldType | FormFieldType[];

export type FormPreviewProps = {
    formFields: FormFieldOrGroup[];
    activeTab: string;
  };

const FormCode = ({formFields}:any) => {

    const generatedCode = generateFormCode(formFields);
  const formattedCode = formatJSXCode(generatedCode);

  return (
    <div>
        <If
              condition={formFields.length > 0} 
              render={() => (
                <div className="relative">
                  <Button
                    className="absolute right-2 top-2"
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(formattedCode)
                      toast({"description": "Code copied Successfully",variant:"default"})
                    }}
                  >
                    <Files />
                  </Button>
                  <Highlight
                    code={formattedCode}
                    language="tsx"
                    theme={themes.oneDark}
                  >
                    {({
                      className,
                      style,
                      tokens,
                      getLineProps,
                      getTokenProps,
                    }: any) => (
                      <pre
                        className={`${className} p-4 text-sm bg-gray-100 rounded-lg 
                        h-full md:max-h-[70vh] overflow-auto`}
                        style={style}
                      >
                        {tokens.map((line: any, i: number) => (
                          <div {...getLineProps({ line, key: i })} key={i}>
                            {line.map((token: any, key: any) => (
                              <span key={key} {...getTokenProps({ token, key })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              )}
              otherwise={() => (
                <div className="h-[50vh] flex justify-center items-center">
                  <p>No form element selected yet.</p>
                </div>
              )}
            />
    </div>
  )
}

export default FormCode