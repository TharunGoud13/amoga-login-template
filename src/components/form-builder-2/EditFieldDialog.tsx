import React, { useState, useEffect } from "react";
import * as Locales from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormFieldType } from "@/types";
import If from "@/components/ui/if";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Import Select components
import {  X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "../ui/use-toast";
import { ADD_CONNECTIONS, NEXT_PUBLIC_API_KEY } from "@/constants/envConfig";

type EditFieldDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  field: FormFieldType | null;
  onSave: (updatedField: FormFieldType) => void;
  existingField: string[];
  setApiFieldData: any
};

export const EditFieldDialog: React.FC<EditFieldDialogProps> = ({
  isOpen,
  onClose,
  field,
  onSave,
  existingField,
  setApiFieldData
}) => {
  const [editedField, setEditedField] = useState<FormFieldType | null>(null);
  const [fieldType, setFieldType] = useState<string>();
  const [newOption, setNewOption] = useState("");
  const [comboboxOptions, setComboboxOptions] = useState("");
  const [multiSelect, setMultiSelect] = useState("");
  const [radioGroup, setRadioGroup] = useState("");
  const [error, setError] = useState(false);
  const [useAPI, setUseAPI] = useState(false);
  const [apiURL, setAPIURL] = useState("");
  const [apiField, setApiField] = useState("");



  useEffect(() => {
    setEditedField(field);
  }, [field]);

  

  const fetchValidApi = async() => {
    const requestOptions = {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${NEXT_PUBLIC_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
    try{
    const response = await fetch(ADD_CONNECTIONS,requestOptions)
    if(!response.ok){
      toast({description: "Failed to fetch data", variant: "destructive"})
    }

    const result = await response.json()
    const validApis = result.filter((item: any) => item?.test_status === "passed");
    return validApis;
  }catch(error){
    toast({ description: "Error fetching valid APIs", variant: "destructive" });
    return [];
  }

  }

  const handleSave = async() => {
    if(useAPI){
      setRadioGroup("")
      
      
    const validApis = await fetchValidApi();
    

    const isValid = validApis.filter((item:any) => item.api_url === apiURL)
   

    if(isValid.length === 0){
      toast({description: "Invalid API URL", variant: "destructive"})
    }

    if(!isValid || !apiURL || !apiField){
      toast({description: "Something went wrong", variant: "destructive"})
    }

    if(isValid && isValid.length > 0 && apiURL && apiField){
      const {key, secret} = isValid && isValid[0];

      try{
        const requestOptions = {
          method: "GET",
          headers: {
            [key]: secret,
            'Content-Type': 'application/json'
          }
        }
        const response = await fetch(apiURL, requestOptions)
        if(!response.ok){
          toast({description: "Failed to fetch data", variant: "destructive"})
        }
        const data = await response.json()
        const firstNameValues = data.map((item: any) => item[apiField]);
        setApiFieldData(firstNameValues)
      
        if(firstNameValues) {
          toast({
            description: "Options added from API successfully",
            variant: "default",
          });
        } else {
          toast({
            description: "No valid `firstName` values found",
            variant: "destructive",
          });
        }
      }
      catch(error){
        toast({ description: "Failed to fetch data", variant: "destructive" })

      }
    }
  } 
    if (editedField) {
      const isDuplicate =
      existingField.includes(editedField.name) &&
      editedField.name !== field?.name;

    if (isDuplicate) {
      toast({ description: "Name already exists", variant: "destructive" });
      const error = document.getElementById("error_msg");
      if (error) error.textContent = "Name already exists";
      setError(true);
      return;
    }
    if(useAPI){
      if(useAPI){
        if(!apiURL){
          toast({description: "API URL is required", variant: "destructive"})
          let error:any = document.getElementById("api_url_error_msg");
          error.textContent = "URL cannot be empty";
          setError(true)
          return
        }
        if(!apiField){
          toast({description: "API URL Field required", variant: "destructive"})
          let error:any = document.getElementById("api_field_error_msg");
          error.textContent = "Api cannot be empty";
          setError(true)
          return
        }
      }
    }
      if(editedField.name === ""){
        toast({description: "Name cannot be empty", variant: "destructive"})
        let error:any = document.getElementById("error_msg");
        error.textContent = "Name cannot be empty";
        setError(true)
        return
      }
      onSave(editedField);
      onClose();
    }
  };

  const handleRemoveItem = (index: number | string) => {
    if(editedField) {
      setEditedField({
        ...editedField,
        options:editedField?.options?.filter((_,i) => i !== index)
      })
    }
  }

  if (!editedField) return null;



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Field ID: {editedField.name} </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="settings">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
        <div className="py-4 space-y-4">
        <div>
            <Label htmlFor="label">Name *</Label>
            <Input
              id="name"
              type={field?.type}
              required
              className={`${error && "border"}`}
              value={editedField.name}
              onChange={(e) =>
                setEditedField({ ...editedField, name: e.target.value })
              }
            />
          </div>
          <span className="text-red-500 text-sm" id="error_msg"></span>
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={editedField.label}
              onChange={(e) =>
                setEditedField({ ...editedField, label: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="label">Variant Code</Label>
            <Input
              id="variant_code"
              // type={field?.type}
              value={editedField.variant_code}
              onChange={(e) =>
                setEditedField({ ...editedField, variant_code: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="label">Validation  Message</Label>
            <Input
              id="validation_message"
              // type={field?.type}
              value={editedField.validation_message}
              onChange={(e) =>
                setEditedField({ ...editedField, variant_code: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="label">Description</Label>
            <Input
              id="description"
              value={editedField.description}
              onChange={(e) =>
                setEditedField({ ...editedField, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={editedField.placeholder}
              onChange={(e) =>
                setEditedField({ ...editedField, placeholder: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="className">className</Label>
            <Input
              id="className"
              value={editedField.className}
              onChange={(e) =>
                setEditedField({ ...editedField, className: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border p-3 rounded">
              <Checkbox
                checked={editedField.disabled}
                onCheckedChange={(checked) =>
                  setEditedField({
                    ...editedField,
                    disabled: checked as boolean,
                    required: checked ? false : editedField.required,
                  })
                }
              />
              <Label>Hide</Label>
            </div>
            <div className="flex items-center gap-1 border p-3 rounded">
              <Checkbox
                checked={editedField.required}
                onCheckedChange={(checked) =>
                  setEditedField({
                    ...editedField,
                    required: checked as boolean,
                    disabled: checked ? false : editedField.disabled,
                  })
                }
              />
              <Label>Required</Label>
            </div>
            
          </div>
          <If
            condition={field?.variant === "Input"}
            render={() => (
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  // id="type"
                  value={editedField.type}
                  onValueChange={(value) => {
                    setFieldType(value);
                    setEditedField({ ...editedField, type: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <If
            condition={fieldType === "number" || fieldType === "text"}
            render={() => (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1 flex flex-col gap-1 ">
                  <Label>Min Value</Label>
                  <Input
                    id="min"
                    type="number"
                    value={editedField.min}
                    onChange={(e) =>
                      setEditedField({
                        ...editedField,
                        min: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="col-span-1 flex flex-col gap-1 ">
                  <Label>Max Value</Label>
                  <Input
                    id="max"
                    type="number"
                    value={editedField.max}
                    onChange={(e) =>
                      setEditedField({
                        ...editedField,
                        max: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}
          />
          <If
            condition={field?.variant === "Slider"}
            render={() => (
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 flex flex-col gap-1 ">
                  <Label>Min Value</Label>
                  <Input
                    id="min"
                    type="number"
                    value={editedField.min}
                    onChange={(e) =>
                      setEditedField({
                        ...editedField,
                        min: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="col-span-1 flex flex-col gap-1 ">
                  <Label>Max Value</Label>
                  <Input
                    id="max"
                    type="number"
                    value={editedField.max}
                    onChange={(e) =>
                      setEditedField({
                        ...editedField,
                        max: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="col-span-1 flex flex-col gap-1 ">
                  <Label>Step</Label>
                  <Input
                    id="step"
                    type="number"
                    value={editedField.step}
                    onChange={(e) =>
                      setEditedField({
                        ...editedField,
                        step: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}
          />
          <If
            condition={field?.variant === "Dropdown"}
            render={() => (
              <div>
                <Label>Dropdown Options</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add new option"
                    />
                    <Button
                      onClick={() => {
                        if (newOption && editedField) {
                          setEditedField({
                            ...editedField,
                            options: [
                              ...(editedField.options || []),
                              newOption,
                            ],
                          });
                          setNewOption("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  {editedField?.options?.map((item,index) => (
                    <div key={index} className="p-2.5 bg-secondary rounded flex justify-between items-center">
                      <span>{item}</span>
                      <span className="cursor-pointer"
                      onClick={() => handleRemoveItem(index)}
                      
                      ><X/></span>
                    </div>
                  ))}
                  
                </div>
              </div>
            )}
          />
          <If
            condition={field?.variant === "Combobox"}
            render={() => (
              <div>
                <Label>ComboBox Options</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={comboboxOptions}
                      onChange={(e) => setComboboxOptions(e.target.value)}
                      placeholder="Add new option"
                    />
                    <Button
                      onClick={() => {
                        if (comboboxOptions && editedField) {
                          setEditedField({
                            ...editedField,
                            combobox: [
                              ...(editedField.combobox || []),
                              comboboxOptions,
                            ],
                          });
                          setComboboxOptions("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  {editedField?.combobox?.map((item,index) => (
                    <div key={index} className="p-2.5 bg-secondary rounded flex justify-between items-center">
                      <span>{item}</span>
                      <span className="cursor-pointer"
                      onClick={() => {
                        if(editedField){
                          setEditedField({
                            ...editedField,
                            combobox: editedField.combobox?.filter((_,i) => i !== index)
                          })
                        }
                      }
                    }
                      ><X/></span>
                    </div>
                  ))}
                  
                </div>
              </div>
            )}
          />
          <If
            condition={field?.variant === "Multi Select"}
            render={() => (
              <div>
                <Label>Multi Select Options</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={multiSelect}
                      onChange={(e) => setMultiSelect(e.target.value)}
                      placeholder="Add new option"
                    />
                    <Button
                      onClick={() => {
                        if (multiSelect && editedField) {
                          setEditedField({
                            ...editedField,
                            multiselect: [
                              ...(editedField.multiselect || []),
                              multiSelect,
                            ],
                          });
                          setMultiSelect("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  {editedField?.multiselect?.map((item,index) => (
                    <div key={index} className="p-2.5 bg-secondary rounded flex justify-between items-center">
                      <span>{item}</span>
                      <span className="cursor-pointer"
                      onClick={() => {
                        if(editedField){
                          setEditedField({
                            ...editedField,
                            multiselect: editedField.multiselect?.filter((_,i) => i !== index)
                          })
                        }
                      }
                    }
                      ><X/></span>
                    </div>
                  ))}
                  
                </div>
              </div>
            )}
          />
          <If
            condition={field?.variant === "Radio Group"}
            render={() => (
              <div>
                <Label>Radio Group Options</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={radioGroup}
                      disabled={useAPI}
                      onChange={(e) => setRadioGroup(e.target.value)}
                      placeholder="Add new option"
                    />
                    <Button
                    disabled={useAPI}
                      onClick={() => {
                        if (radioGroup && editedField) {
                          setEditedField({
                            ...editedField,
                            radiogroup: [
                              ...(editedField.radiogroup || []),
                              radioGroup,
                            ],
                          });
                          setRadioGroup("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  {editedField?.radiogroup?.map((item,index) => (
                    <div key={index} className="p-2.5 bg-secondary rounded flex justify-between items-center">
                      <span>{item}</span>
                      <span className="cursor-pointer"
                      onClick={() => {
                        if(editedField){
                          setEditedField({
                            ...editedField,
                            radiogroup: editedField.radiogroup?.filter((_,i) => i !== index)
                          })
                        }
                      }}
                      
                      ><X/></span>
                    </div>
                  ))}
                  
                </div>
              </div>
            )}
          />
          <If
            condition={field?.variant === "Smart Datetime Input"}
            render={() => (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1 flex flex-col gap-1 ">
                  <Label htmlFor="locale">Locale</Label>
                  <Select
                    // id="locale"
                    value={editedField.locale ?? ""}
                    onValueChange={(value) => {
                      setEditedField({
                        ...editedField,
                        locale: value as keyof typeof Locales,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select locale" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(Locales).map((locale) => (
                        <SelectItem key={locale} value={locale}>
                          {locale}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 flex items-end gap-1 p-3 rounded">
                  <Checkbox
                    // id="hour12"
                    checked={editedField.hour12}
                    onCheckedChange={(checked) =>
                      setEditedField({
                        ...editedField,
                        hour12: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="hour12">12 Hour Clock</Label>
                </div>
              </div>
            )}
          />
          {/* <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border p-3 rounded">
              <Checkbox
                checked={editedField.required}
                onCheckedChange={(checked) =>
                  setEditedField({
                    ...editedField,
                    required: checked as boolean,
                  })
                }
              />
              <Label>Required</Label>
            </div>
            <div className="flex items-center gap-1 border p-3 rounded">
              <Checkbox
                checked={editedField.disabled}
                onCheckedChange={(checked) =>
                  setEditedField({
                    ...editedField,
                    disabled: checked as boolean,
                  })
                }
              />
              <Label>Disabled</Label>
            </div>
          </div> */}
          <If 
            condition={[
              "Combobox",
              "Multi Select",
              "Image Upload",
              "File Upload",
              "Location Select",
              "Radio Group",
              "Text Box",
              "Number",
              "Mobile",
              "OTP",
              "Email",
              "Password",
              "Date",
              "Date Time",
              "Dropdown",
              "Check Box",
              "Text Area",
              "Radio Group"
            ].includes(field?.variant ?? "")}
            render={() => (
              <div>
          
            <div className="flex w-fit items-center gap-1 border p-3 rounded">
              <Checkbox
                checked={useAPI}
                onCheckedChange={() =>
                  setUseAPI(!useAPI)
                }
              />
              <Label>Use API</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiURL">API URL</Label>
              <Input
                id="apiURL"
                type="text"
                value={apiURL}
                onChange={(e) => setAPIURL(e.target.value)}
                placeholder="Enter API URL"
                
                disabled={!useAPI}
              />
            </div>
            <span className="text-red-500 text-sm" id="api_url_error_msg"></span>
            <div className="space-y-2">
              <Label htmlFor="apiURL">API Field</Label>
              <Input
                id="apiURL"
                type="text"
                value={apiField}
                onChange={(e) => setApiField(e.target.value)}
                placeholder="Enter API Field"
                
                disabled={!useAPI}
              />
            </div>
            <span className="text-red-500 text-sm" id="api_field_error_msg"></span>
            </div>
            )}
          />
        </div>
        </TabsContent>
        <TabsContent value="cards">
          Card content goes here.
        </TabsContent>
        <TabsContent value="connection">
        Connection content goes here.
        </TabsContent>
        <TabsContent value="actions">
        Actions content goes here.
        </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
