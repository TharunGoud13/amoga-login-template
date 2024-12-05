"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { DatetimePicker } from "../ui/datetime-picker";
import { DropdownMenu } from "../ui/dropdown-menu";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import LocationSelector from "../ui/location-input";
import { Progress } from "../ui/progress";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, ExternalLink } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "../ui/multi-select";
import { MediaCard } from "../ui/media-card";
import  MediaSocialPage  from "../ui/media-social-page";
import BarChartPage from "../ui/bar-chart-page";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

const RenderInputField = ({
  currentField,
  input,
  setInput,
  formData,
  setFormData,
  setSelectedImage,
}: {
  currentField: any;
  input: string;
  setInput: (value: string) => void;
  formData: Record<string, any>;
  setFormData: (formData: Record<string, any>) => void;
  setSelectedImage: any;
}) => {

  const [selectedValues, setSelectedValues] = useState<any>([]);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleIframeUrlChange = (url: string) => {
    setIframeUrl(url);
    setInput(url);
  };


  console.log("currentField-----", currentField);
  console.log("input-----", input);
  switch (currentField.variant) {
    case "Text Area":
      return (
        <Textarea
          placeholder={currentField.placeholder}
          
          onChange={(e) => setInput(e.target.value)}
          className=" border-gray-700 placeholder:text-gray-400"
        />
      );
    case "Text Box":
      return (
        <Input
          type="text"
          placeholder={currentField.placeholder}
          
          onChange={(e) => setInput(e.target.value)}
          className=" border-gray-700 placeholder:text-gray-400"
        />
      );
    case "Number":
      return (
        <Input
          type="number"
          placeholder={currentField.placeholder}
         
          onChange={(e) => setInput(e.target.value)}
          className=" border-gray-700 placeholder:text-gray-400"
        />
      );
    case "Mobile":
      return (
        <Input
          type="number"
          placeholder={currentField.placeholder}
         
          onChange={(e) => setInput(e.target.value)}
          className=" border-gray-700 placeholder:text-gray-400"
        />
      );
    case "OTP":
      return (
        <Input
          type="text"
          maxLength={6}
          placeholder={currentField.placeholder}
          
          onChange={(e) => setInput(e.target.value)}
          className=" border-gray-700 placeholder:text-gray-400"
        />
      );
    case "Email":
      return (
        <Input
          type="email"
          placeholder={currentField.placeholder}
          
          onChange={(e) => setInput(e.target.value)}
          className=" border-gray-700 placeholder:text-gray-400"
        />
      );
    case "Password":
      return (
        <Input
          type="password"
          placeholder={currentField.placeholder}
          
          onChange={(e) => setInput(e.target.value)}
          className=" border-gray-700 placeholder:text-gray-400"
        />
      );
    case "Date":
      return (
        <Calendar
          mode="single"
          // selected={formData[currentField.name]}
          // onSelect={(date:any) =>
          //   setFormData((prev:any) => ({ ...prev, [currentField.name]: new Date(date).toDateString() }))
          // }
          onSelect={(date: any) => setInput(new Date(date).toDateString())}
          className="rounded-md border"
        />
      );
    case "Date Time":
      return (
        <DatetimePicker
          onChange={(newDate) => {
            setInput(newDate ? new Date(newDate).toDateString() : "");
          }}
          className="text-primary bg-secondary"
          format={[
            ["months", "days", "years"],
            ["hours", "minutes", "am/pm"],
          ]}
        />
      );
    case "Dropdown":
      return (
        <Select
          onValueChange={(value) => {
            currentField.onChange;
            setInput(value);
          }}
          defaultValue={currentField?.options && currentField?.options[0]}
        >
          <SelectTrigger>
            <SelectValue placeholder={currentField.placeholder} />
          </SelectTrigger>

          <SelectContent>
            {currentField.options?.map((option: any) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "Check Box":
      return (
        <div className="flex items-center gap-2.5">
          <Checkbox
            checked={formData[currentField.name]}
            // onChange={(value:any) => {
            //   setFormData((prev: any) => ({ ...prev, [currentField.name]: value }))
            //   setInput(`Selected Services: ${value}`)
            // }

            // }
            onCheckedChange={(value: any) => {
              setFormData((prev: any) => ({
                ...prev,
                [currentField.name]: value,
              }));
              if (value) {
                setInput(currentField.label); // Set the label only if the checkbox is checked
              } else {
                setInput(""); // Optionally clear the input when unchecked
              }
            }}
            className="text-primary border border-primary"
          />

          <span>{currentField.label}</span>
        </div>
      );
    case "Radio Group":
      return (
        <RadioGroup
          defaultValue="comfortable"
          onValueChange={(value) => setInput(value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option 1" id="r1" className="text-primary" />
            <Label htmlFor="r1">option 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option 2" id="r2" />
            <Label htmlFor="r2">option 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option 3" id="r3" />
            <Label htmlFor="r3">option 3</Label>
          </div>
        </RadioGroup>
      );

    case "Slider":
      
      return (
        <Slider
          // max={60}
          // step={1}
          // defaultValue={[50]}
          onValueChange={(value: any) =>
            // setFormData((prev: any) => ({ ...prev, [currentField.name]: value }))s
            setInput(value[0].toString())
          }
          // className="text-black w-[500px] bg-red-500 "

        />
      );
    
    case "Switch":
      return (
        <div className="flex items-center gap-2.5">       
         <Switch
          checked={formData[currentField.checked]}
          onCheckedChange={(value: any) => {
            setFormData((prev: any) => ({
              ...prev,
              [currentField.name]: value,
            }));
            {value ? setInput("on"): setInput("off")}
          }}
          className="text-white"
        />
        <span>{currentField.label}</span>
        </div>

      );
    case "Image Upload":
      return (
        <div className="space-y-4  p-4 rounded-lg">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file: any = e.target.files?.[0];
              if (file) {
                console.log("file----", file);
                const reader = new FileReader();
                setInput(file.name);

                reader.onloadend = () => {
                  setSelectedImage(file.name);
                };
                reader.readAsDataURL(file);
              }
            }}
            className=" border-gray-700 text-white"
          />
        </div>
      );
    case "File Upload":
      return (
        <div className="space-y-4  p-4 rounded-lg">
          <Input
            type="file"
            onChange={(e) => {
              const file: any = e.target.files?.[0];
              if (file) {
                console.log("file----", file);
                const reader = new FileReader();
                setInput(file.name);

                reader.onloadend = () => {
                  setSelectedImage(file.name);
                };
                reader.readAsDataURL(file);
              }
            }}
            className=" border-gray-700 text-white"
          />
        </div>
      );

      case "Combobox":
      return (
        
          
          <Popover>
            <PopoverTrigger asChild>
              
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !currentField.value && "text-muted-foreground"
                  )}
                >
                  {currentField.value
                ? currentField.combobox?.find((item:any) => item === currentField.value)
                : "Select option"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search language..." />
                <CommandList>
                  <CommandEmpty>No option found.</CommandEmpty>
                  <CommandGroup>
                  {currentField.combobox?.map((item:any) => (
                  <CommandItem
                    value={item}
                    key={item}
                    onSelect={() => {
                      setInput(item)
                      // setValue(item);
                    }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item === currentField.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        
      );

      case "Multi Select":
      return (
        
          
            <MultiSelector
              values={selectedValues}
              onValuesChange={(newValues:any) => {
                setSelectedValues(newValues);
                setInput(newValues)
                
              }}
              className="max-w-xs"
            >
              <MultiSelectorTrigger>
                <MultiSelectorInput placeholder={currentField.placeholder} />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {currentField?.multiselect?.map((item:any,index:any) => (
                    <MultiSelectorItem key={index} value={item}>
                      {item}
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
          
      );

    case "Location Select":
      return (
        <>
          <LocationSelector
            onCountryChange={(country) => {
              setFormData((prev: any) => ({
                ...prev,
                [currentField.name]: [country?.name || ""],
              }));
              setInput(currentField.name);
            }}
            onStateChange={(state) => {
              setFormData((prev: any) => ({
                ...prev,
                [currentField.name]: [state?.name || ""],
              }));
              setInput(currentField.name);
            }}
          />
        </>
      );
      case "Progress":
        const timer = setTimeout(() => setInput("50"), 500);
        () => clearTimeout(timer)
        return (
          <div>
            <p>{currentField.label}</p>
            <Progress value={50}  className="w-[60%]" />
          </div>
        );
        case "Media Card":
      
      return (
        <div>
          <MediaCard
            title={currentField.label || "Exciting New Product"}
            description={currentField.description || "Discover our latest innovation."}
            value={currentField.value}
            onTitleChange={(newTitle) => {
              currentField.label = newTitle;
              // form.setValue(`${field.name}`, newTitle);
            }}
            onDescriptionChange={(newDescription) => {
              currentField.description = newDescription;
              // form.setValue(`${field.name}`, newDescription);
            }}
            onMediaChange={(media: any) => {
              currentField.value = media;
              // form.setValue(field.name, media);
              setInput(currentField.value.name);
            }}
          />
        </div>
      );
      case "Media Card & Social Icons":
      return (
        <MediaSocialPage
          title={currentField.label || ""}
          description={currentField.description || ""}
          value={currentField.value}
          onTitleChange={(newTitle) => {
            currentField.label = newTitle;
            // form.setValue(`${field.name}`, newTitle);
          }}
          onDescriptionChange={(newDescription) => {
            currentField.description = newDescription;
            // form.setValue(`${field.name}`, newDescription);
          }}
          onMediaChange={(media: any) => {
            currentField.value = media;
            setInput(currentField.value.name)
            // form.setValue(field.name, media);
          }}
        />
      );
      case "Bar Chart with Social":
        return(
          <BarChartPage 
          title={currentField.label || ""}
          description={currentField.description || ""}
          value={currentField.value}
          onTitleChange={(newTitle) => {
            currentField.label = newTitle;
            setInput(currentField.label);
            // form.setValue(`${field.name}`, newTitle);
          }}
          onDescriptionChange={(newDescription) => {
            currentField.description = newDescription;
            // form.setValue(`${field.name}`, newDescription);
            
          }}/>
        )
        case "Iframe":
      return (
        <div>
          
            
            
              
                <Input
                  type="text"
                  className="flex-grow px-2 py-1 border rounded"
                  placeholder="Enter iframe URL"
                  value={iframeUrl || (currentField.value as string) || ""}
                  onChange={(e) => {
                    handleIframeUrlChange(e.target.value);
                  }} // Call handler on change
                />
              
              {currentField.description || "Provide a valid iframe URL."}
            

          {/* Render iframe if URL is provided */}
          {iframeUrl || currentField.value ? (
            <div
              className="relative w-full h-28 mt-2 bg-gray-100 rounded-md overflow-hidden cursor-pointer group"
              onClick={() =>
                window.open(
                  iframeUrl || (currentField.value as string),
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-opacity">
                <ExternalLink className="h-8 w-8 text-white" />
              </div>
              <iframe
                src={iframeUrl || (currentField.value as string)}
                className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                title="Embedded content preview"
              />
            </div>
          ) : (
            <div className="mt-2 w-full h-28 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
              <p className="text-xs text-gray-500 text-center">
                No iframe URL set
              </p>
            </div>
          )}
        </div>
      );
      case "Tool Tip Card":
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button  variant="link">{currentField.label}</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div>
              <p>{currentField.label}</p>
              <p>{currentField.name}</p>
              <p>{currentField.description}</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      );

    default:
      return null;
  }
};

export default RenderInputField;
