"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";

type FormComponent = {
//   max: number;
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
//   min: number;
//   step: number;
};

interface FormComponentRendererProps {
  component: FormComponent;
  isEditing?: boolean;
  formData: Record<string, any>;
  onFormDataChange: (id: string, value: any) => void;
  onLabelChange?: (id: string, label: string) => void;
}

const SignatureInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="border rounded p-4 h-40 bg-white">
      <div className="text-center text-gray-400">Signature pad coming soon</div>
    </div>
  );
};

const SmartDatetimeInput = ({
  value,
  onValueChange,
  placeholder,
}: {
  value: Date;
  onValueChange: (value: Date) => void;
  placeholder?: string;
}) => {
  return (
    <Input
      type="datetime-local"
      value={value ? value.toISOString().slice(0, 16) : ""}
      onChange={(e) => onValueChange(new Date(e.target.value))}
      placeholder={placeholder}
      className="w-full"
    />
  );
};

const TagsInput = ({
  value,
  onValueChange,
  placeholder,
}: {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onValueChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, index) => (
          <div
            key={index}
            className="bg-primary/10 px-2 py-1 rounded-md flex items-center gap-1"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => onValueChange(value.filter((_, i) => i !== index))}
              className="text-xs hover:text-destructive"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Type and press Enter to add tags"}
      />
    </div>
  );
};

const FormComponentRenderer = ({
  component,
  isEditing = false,
  formData,
  onFormDataChange,
  onLabelChange,
}: FormComponentRendererProps) => {
  const commonProps = {
    id: component.id,
    placeholder: component.placeholder,
    required: component.required,
    className: "w-full",
    "aria-label": component.label,
  };

  const renderEditableLabel = () => (
    <Input
      value={component.label}
      onChange={(e) => onLabelChange?.(component.id, e.target.value)}
      className="mb-2"
    />
  );

  const renderLabel = () => (
    <Label htmlFor={component.id} className="mb-2 block">
      {component.label}
      {component.required && <span className="text-destructive ml-1">*</span>}
    </Label>
  );

  switch (component.type) {
    case "input":
    case "otp":
    case "location":
    case "phone":
      return (
        <div className="space-y-2">
          {isEditing ? renderEditableLabel() : renderLabel()}
          <Input
            {...commonProps}
            type={component.type === "phone" ? "number" : "text"}
            value={formData[component.id] || ""}
            onChange={(e) => onFormDataChange(component.id, e.target.value)}
          />
        </div>
      );

    case "password":
      return (
        <div className="space-y-2">
          {isEditing ? renderEditableLabel() : renderLabel()}
          <Input
            {...commonProps}
            type="password"
            value={formData[component.id] || ""}
            onChange={(e) => onFormDataChange(component.id, e.target.value)}
          />
        </div>
      );

    case "checkbox":
      return (
        <div className="flex  items-center space-x-2">
          <Checkbox
            id={component.id}
            checked={formData[component.id] || false}
            onCheckedChange={(checked) =>
              onFormDataChange(component.id, checked)
            }
          />
          {isEditing ? (
            <Input
              value={component.label}
              onChange={(e) => onLabelChange?.(component.id, e.target.value)}
              className="flex-1"
            />
          ) : (
            <Label htmlFor={component.id}>{component.label}</Label>
          )}
        </div>
      );

    case "switch":
      return (
        <div className="flex items-center justify-between space-x-2">
          {isEditing ? (
            <Input
              value={component.label}
              onChange={(e) => onLabelChange?.(component.id, e.target.value)}
              className="flex-1"
            />
          ) : (
            <Label htmlFor={component.id}>{component.label}</Label>
          )}
          <Switch
            id={component.id}
            checked={formData[component.id] || false}
            onCheckedChange={(checked) =>
              onFormDataChange(component.id, checked)
            }
          />
        </div>
      );

    case "datepicker":
    case "datetimepicker":
      return (
        <div className="space-y-2">
          {isEditing ? renderEditableLabel() : renderLabel()}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData[component.id] && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData[component.id]
                  ? format(formData[component.id], "PPP")
                  : component.placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData[component.id]}
                onSelect={(date) => onFormDataChange(component.id, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );

    case "file":
      return (
        <div className="space-y-2">
          {isEditing ? renderEditableLabel() : renderLabel()}
          <Input
            {...commonProps}
            type="file"
            onChange={(e) =>
              onFormDataChange(component.id, e.target.files?.[0])
            }
          />
        </div>
      );

    case "combobox":
    case "multiselect":
    case "select":
      return (
        <div className="space-y-2">
          {isEditing ? renderEditableLabel() : renderLabel()}
          <Select
            value={formData[component.id]}
            onValueChange={(value) => onFormDataChange(component.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={component.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    case "slider":
      return (
        <div className="space-y-2">
          {isEditing ? renderEditableLabel() : renderLabel()}
          <div className="pt-[10px]">
            <Slider
              value={[formData[component.id] || 0]}
              onValueChange={(vals) => onFormDataChange(component.id, vals[0])}
              
            />
          </div>
        </div>
      );

    case "signature":
      return (
        <div className="space-y-2">
          {isEditing ? renderEditableLabel() : renderLabel()}
          <SignatureInput
            value={formData[component.id] || ""}
            onChange={(value) => onFormDataChange(component.id, value)}
          />
        </div>
      );

    case "smartdatetime":
      return (
        <div className="space-y-2">
          {isEditing ? renderEditableLabel() : renderLabel()}
          <SmartDatetimeInput
            value={formData[component.id]}
            onValueChange={(value) => onFormDataChange(component.id, value)}
            placeholder={component.placeholder}
          />
        </div>
      );

    case "tags":
      return (
        <div className="space-y-2">
          {isEditing ? renderEditableLabel() : renderLabel()}
          <TagsInput
            value={formData[component.id] || []}
            onValueChange={(value) => onFormDataChange(component.id, value)}
            placeholder={component.placeholder}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2">
          {isEditing ? renderEditableLabel() : renderLabel()}
          <Textarea
            {...commonProps}
            value={formData[component.id] || ""}
            onChange={(e) => onFormDataChange(component.id, e.target.value)}
          />
        </div>
      );

    default:
      return null;
  }
};

export default FormComponentRenderer;
