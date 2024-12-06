/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import { FormFieldType } from "@/types";
import { cn } from "@/lib/utils";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
// import { PasswordInput } from '@/components/ui/password-input'
import { PasswordInput } from "../ui/password-input";
import { PhoneInput } from "../ui/phone-input";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-upload";
import { Slider } from "@/components/ui/slider";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  ExternalLink,
  Paperclip,
} from "lucide-react";
// import { TagsInput } from '@/components/ui/tags-input'
import { TagsInput } from "../ui/tags-input";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../ui/multi-select";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input";
import LocationSelector from "@/components/ui/location-input";
import SignatureInput from "@/components/ui/signature-input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Progress } from "../ui/progress";
import { MediaCard } from "../ui/media-card";
import { usePathname } from "next/navigation";
import MediaSocialPage from "../ui/media-social-page";
import BarChartPage from "../ui/bar-chart-page";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </>
  );
};

export const renderFormField = (field: FormFieldType, form: any) => {
  console.log('field.....',field)
  const [checked, setChecked] = useState<boolean>(field.checked);
  const [value, setValue] = useState<any>(field.value);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [tagsValue, setTagsValue] = useState<string[]>([]);
  const [files, setFiles] = useState<File[] | null>(null);
  const [images, setImages] = useState<File[] | null>(null);
  const [date, setDate] = useState<Date>();
  const [datetime, setDatetime] = useState<Date>();
  const [smartDatetime, setSmartDatetime] = useState<Date | null>();
  const [countryName, setCountryName] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(13);
  const [media, setMedia] = useState<File | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const path = usePathname();
  const currentPath = path.includes("submit");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const imageDropZoneConfig = {
    accept: { "image/*": [] },
  };

  const handleIframeUrlChange = (url: string) => {
    setIframeUrl(url);
    field.value = url;
    setValue(url);
  };

  const handleFileChange = async (newFiles: File[] | any) => {
    // Clear previous states
    setUploadError(null);
    setUploadedFileUrl(null);

    if (!currentPath) {
      setUploadError("File upload is disabled in the current path.");
      return;
    }

    setUploading(true);
    setFiles(newFiles);

    const formData = new FormData();
    newFiles.forEach((file: any) => {
      formData.append("file", file);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadedFileUrl(data.url);
      if (data.url) {
        localStorage.setItem("uploadedFileUrl", data.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUrlClick = () => {
    if (uploadedFileUrl) {
      window.open(uploadedFileUrl, "_blank");
    }
  };

  const handleImageChange = (newImages: any) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const filteredImages = newImages.filter((image: any) =>
      validImageTypes.includes(image.type)
    );

    console.log("Filtered Images:", filteredImages);
    setImages(filteredImages);
    setValue(filteredImages);
  };

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  switch (field.variant) {
    case "Check Box":
      return (
        <FormItem
          className={cn(
            "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",
            field.className
          )}
        >
          <FormControl>
            <Checkbox
              checked={checked} // Ensure this is handled as boolean
              onCheckedChange={() => {
                setChecked(!checked);
              }}
              disabled={field.disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{field.label}</FormLabel> {field.required && "*"}
            <FormDescription>{field.description}</FormDescription>
          </div>
          <FormMessage />
        </FormItem>
      );
    case "Radio Group":
      return (
        <FormItem
          className={cn(
            "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",
            field.className
          )}
        >
          <FormControl>
            <RadioGroup defaultValue="comfortable">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" />
                <Label htmlFor="r1">{field.name}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label htmlFor="r2">{field.name}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="r3" />
                <Label htmlFor="r3">{field.name}</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <div className="space-y-1 leading-none">
            {/* <FormLabel>{field.label}</FormLabel> {field.required && "*"} */}
            {/* <FormDescription>{field.description}</FormDescription> */}
          </div>
          <FormMessage />
        </FormItem>
      );
    case "Search Lookup":
      return <div></div>;
    case "Badge":
      return (
        <div>
          <Badge>{field.name}</Badge>
        </div>
      );

    case "Seperator":
      return (
        <div className="space-y-2">
          <p>{field.name}</p>
          <Separator />
          <p>{field.description}</p>
        </div>
      );

    case "Tool Tip Card":
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">{field.label}</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div>
              <p>{field.label}</p>
              <p>{field.name}</p>
              <p>{field.description}</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      );

    case "Progress":
      return (
        <div>
          <p>{form.label}</p>
          <Progress value={progress} className="w-[60%]" />
        </div>
      );
    case "Combobox":
      return (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel>{field.label}</FormLabel> {field.required && "*"}
          </div>{" "}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !value && "text-muted-foreground"
                  )}
                >
                  {value
                ? field.combobox?.find((item) => item === value)
                : "Select option"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search language..." />
                <CommandList>
                  <CommandEmpty>No option found.</CommandEmpty>
                  <CommandGroup>
                  {field.combobox?.map((item) => (
                  <CommandItem
                    value={item}
                    key={item}
                    onSelect={() => {
                      setValue(item);
                      form.setValue(field.name, item);
                    }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item === value
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
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Date":
      return (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel>{field.label}</FormLabel> {field.required && "*"}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  form.setValue(field.name, newDate, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Date Time":
      return (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel>{field.label}</FormLabel> {field.required && "*"}
          </div>
          <DatetimePicker
            {...field}
            value={datetime}
            // onChange={setDatetime}
            onChange={(newDate) => {
              setDatetime(newDate);
              form.setValue(field.name, newDate, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            format={[
              ["months", "days", "years"],
              ["hours", "minutes", "am/pm"],
            ]}
          />
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "File Upload":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && "*"}
          <FormControl>
            <FileUploader
              value={files}
              onValueChange={handleFileChange}
              dropzoneOptions={dropZoneConfig}
              className="relative bg-background rounded-lg p-2"
            >
              <FileInput
                id="fileInput"
                disabled={!currentPath}
                className="outline-dashed outline-1 outline-slate-500"
              >
                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
                  <FileSvgDraw />
                </div>
              </FileInput>
              <FileUploaderContent>
                {files &&
                  files.length > 0 &&
                  files.map((file, i) => (
                    <FileUploaderItem key={i} index={i}>
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}

                {uploadedFileUrl && (
                  <div
                    className="mt-2 text-blue-600 cursor-pointer hover:underline"
                    onClick={handleFileUrlClick}
                  >
                    View Uploaded File: {files && files[0]?.name}
                  </div>
                )}
              </FileUploaderContent>
            </FileUploader>
          </FormControl>
          {uploadError && (
            <div className="text-red-500 text-sm mt-1">{uploadError}</div>
          )}
          <FormDescription>{field.description}</FormDescription>
        </FormItem>
      );
    case "Image Upload":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && "*"}
          <FormControl>
            <FileUploader
              value={images}
              onValueChange={handleImageChange}
              dropzoneOptions={imageDropZoneConfig}
              className="relative bg-background rounded-lg p-2"
            >
              <FileInput
                id="fileInput"
                className="outline-dashed outline-1 outline-slate-500"
              >
                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                  <FileSvgDraw />
                </div>
              </FileInput>
              <FileUploaderContent>
                {images &&
                  images.length > 0 &&
                  images.map((file, i) => (
                    <FileUploaderItem key={i} index={i}>
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
              </FileUploaderContent>
            </FileUploader>
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
        </FormItem>
      );
    case "Text Box":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && "*"}
          <FormControl>
            <Input
              placeholder={field.placeholder}
              disabled={field.disabled}
              type={field?.type}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Email":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && "*"}
          <FormControl>
            <Input
              placeholder={field.placeholder}
              disabled={field.disabled}
              type={field?.type}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Check box label":
      return (
        <FormItem>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "OTP":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && "*"}
          <FormControl>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Location Select":
      return (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel>{field.label}</FormLabel> {field.required && "*"}
          </div>
          <LocationSelector
            onCountryChange={(country) => {
              setCountryName(country?.name || "");
              form.setValue(field.name, [country?.name || "", stateName || ""]);
            }}
            onStateChange={(state) => {
              setStateName(state?.name || "");
              form.setValue(field.name, [countryName || "", state?.name || ""]);
            }}
          />
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Multi Select":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <MultiSelector
              values={selectedValues}
              onValuesChange={(newValues) => {
                setSelectedValues(newValues);
                form.setValue(field.name, newValues, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              className="max-w-xs"
            >
              <MultiSelectorTrigger>
                <MultiSelectorInput placeholder={field.placeholder} />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {field?.multiselect?.map((item,index) => (
                    <MultiSelectorItem key={index} value={item}>
                      {item}
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Dropdown":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && "*"}
          <Select onValueChange={field.onChange} defaultValue={field?.options && field?.options[0]}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder}/>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
            {field.options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
            </SelectContent>
          </Select>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Slider":
      const min = field.min || 0;
      const max = field.max || 100;
      const step = field.step || 1;
      const defaultValue = 5;

      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Slider
              min={min}
              max={max}
              step={step}
              defaultValue={[defaultValue]}
              onValueChange={(value) => {
                setValue(value[0]);
              }} // Update to set the first value as a number
            />
          </FormControl>
          <FormDescription className="py-3">
            {field.description} Selected value is {value || defaultValue},
            minimun valus is {min}, maximim values is {max}, step size is {step}
          </FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Media Card":
      const handleMediaChange = (newMedia: File | null) => {
        setMedia(newMedia);
        form.setValue(field.name, newMedia); // Synchronize with react-hook-form
      };
      return (
        <div>
          <MediaCard
            title={field.label || "Exciting New Product"}
            description={field.description || "Discover our latest innovation."}
            value={field.value}
            onTitleChange={(newTitle) => {
              field.label = newTitle;
              form.setValue(`${field.name}`, newTitle);
            }}
            onDescriptionChange={(newDescription) => {
              field.description = newDescription;
              form.setValue(`${field.name}`, newDescription);
            }}
            onMediaChange={(media: any) => {
              field.value = media;
              form.setValue(field.name, media);
            }}
          />
        </div>
      );
    case "Media Card & Social Icons":
      return (
        <MediaSocialPage
          title={field.label || ""}
          description={field.description || ""}
          value={field.value}
          onTitleChange={(newTitle) => {
            field.label = newTitle;
            form.setValue(`${field.name}`, newTitle);
          }}
          onDescriptionChange={(newDescription) => {
            field.description = newDescription;
            form.setValue(`${field.name}`, newDescription);
          }}
          onMediaChange={(media: any) => {
            field.value = media;
            form.setValue(field.name, media);
          }}
        />
      );
      case "Bar Chart with Social":
        return(
          <BarChartPage 
          title={field.label || ""}
          description={field.description || ""}
          value={field.value}
          onTitleChange={(newTitle) => {
            field.label = newTitle;
            form.setValue(`${field.name}`, newTitle);
          }}
          onDescriptionChange={(newDescription) => {
            field.description = newDescription;
            form.setValue(`${field.name}`, newDescription);
          }}/>
        )
    case "Signature Input":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <SignatureInput
              canvasRef={canvasRef}
              onSignatureChange={(signature) => {
                if (signature) field.onChange(signature);
              }}
            />
          </FormControl>
          <FormDescription className="py-3">
            {field.description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Iframe":
      return (
        <div>
          <FormItem>
            <FormLabel>{field.label || "Embedded Content"}</FormLabel>{" "}
            {field.required && "*"}
            <FormControl>
              {!currentPath && (
                <Input
                  type="text"
                  className="flex-grow px-2 py-1 border rounded"
                  placeholder="Enter iframe URL"
                  value={iframeUrl || (field.value as string) || ""}
                  onChange={(e) => {
                    handleIframeUrlChange(e.target.value);
                  }} // Call handler on change
                />
              )}
            </FormControl>
            <FormDescription>
              {field.description || "Provide a valid iframe URL."}
            </FormDescription>
            <FormMessage />
          </FormItem>

          {/* Render iframe if URL is provided */}
          {iframeUrl || field.value ? (
            <div
              className="relative w-full h-28 mt-2 bg-gray-100 rounded-md overflow-hidden cursor-pointer group"
              onClick={() =>
                window.open(
                  iframeUrl || (field.value as string),
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-opacity">
                <ExternalLink className="h-8 w-8 text-white" />
              </div>
              <iframe
                src={iframeUrl || (field.value as string)}
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

    case "Smart Datetime Input":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <SmartDatetimeInput
              locale={field.locale as any}
              hour12={field.hour12}
              value={smartDatetime}
              onValueChange={(newDate) => {
                setSmartDatetime(newDate);
                form.setValue(field.name, newDate, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              placeholder="e.g. tomorrow at 3pm"
            />
          </FormControl>
          <FormDescription className="py-3">
            {field.description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Switch":
      return (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel>{field.label}</FormLabel> {field.required && "*"}
            <FormDescription>{field.description}</FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={checked}
              onCheckedChange={() => {
                setChecked(!checked);
              }}
            />
          </FormControl>
        </FormItem>
      );
    case "Tags Input":
      const currentTags = Array.isArray(form.watch(field.name))
        ? form.watch(field.name)
        : [];

      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <TagsInput
              value={tagsValue}
              onValueChange={(newTags) => {
                setTagsValue(newTags);
                form.setValue(field.name, newTags, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              placeholder="Enter your tags"
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Text Area":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={field.placeholder}
              className="resize-none"
              // {...field}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Password":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <PasswordInput
              value={password}
              placeholder="password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
                form.setValue(field.name, e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Number":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <PhoneInput
              defaultCountry="IN"
              onChange={(phoneNumber) => {
                form.setValue(field.name, phoneNumber, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    case "Mobile":
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <PhoneInput
              defaultCountry="IN"
              onChange={(phoneNumber) => {
                form.setValue(field.name, phoneNumber, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    default:
      return null;
  }
};
