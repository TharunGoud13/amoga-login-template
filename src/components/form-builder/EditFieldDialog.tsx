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

type EditFieldDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  field: FormFieldType | null;
  onSave: (updatedField: FormFieldType) => void;
};

export const EditFieldDialog: React.FC<EditFieldDialogProps> = ({
  isOpen,
  onClose,
  field,
  onSave,
}) => {
  const [editedField, setEditedField] = useState<FormFieldType | null>(null);
  const [fieldType, setFieldType] = useState<string>();
  const [newOption, setNewOption] = useState("");
  const [comboboxOptions, setComboboxOptions] = useState("");
  const [multiSelect, setMultiSelect] = useState("");

  useEffect(() => {
    setEditedField(field);
  }, [field]);

  const handleSave = () => {
    if (editedField) {
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

  console.log("editedField----",editedField?.options)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {editedField.variant} Field</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
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
            <Label htmlFor="label">Name</Label>
            <Input
              id="name"
              type={field?.type}
              value={editedField.name}
              onChange={(e) =>
                setEditedField({ ...editedField, name: e.target.value })
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
          <div className="flex items-center gap-3">
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
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
