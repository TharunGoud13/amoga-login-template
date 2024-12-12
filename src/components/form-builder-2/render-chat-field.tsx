"use client";
import { ChangeEvent, useEffect, useState } from "react";
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
import { Check, ChevronsUpDown, ExternalLink, File, ImageIcon, Link, UploadIcon, XIcon } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "../ui/multi-select";
import { MediaCard } from "../ui/media-card";
import  MediaSocialPage  from "../ui/media-social-page";
import BarChartPage from "../ui/bar-chart-page";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

const RenderInputField = ({
  currentField,
  input,
  setInput,
  formData,
  setFormData,
  setSelectedImage,
  setSelectedFile,
  apiFieldData,
  videos,
  setVideos,
  videoError,
  setVideoError,
  imageError,
  setImageError,
  selectedImage,
  selectedFile,
  fileError,
  setFileError,
  fileName,
  setFileName,

}: {
  currentField: any;
  input: string;
  setInput: (value: string) => void;
  formData: Record<string, any>;
  setFormData: (formData: Record<string, any>) => void;
  setSelectedImage: any;
  setSelectedFile: any;
  apiFieldData: any;
  videos: any,
  setVideos: any;
  videoError: any;
  setVideoError: any
  imageError:any
  setImageError:any
  selectedImage: any
  selectedFile: any
  fileError: any
  setFileError: any
  fileName: any;
  setFileName: any
}) => {

  const [selectedValues, setSelectedValues] = useState<any>([]);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [value, setValue] = useState(currentField.value)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [multiSelectedItems, setMultiSelectedItems] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");

  const MAX_VIDEO_SIZE = 2 * 1024 * 1024
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024
  const MAX_FILE_SIZE = 5 * 1024 * 1024


  const handleIframeUrlChange = (url: string) => {
    setIframeUrl(url);
    setInput(url);
  };

  useEffect(() => {
    if(currentField.variant === "Badge"){
      setInput(currentField.name)
    }
    else if(currentField.variant === "Label"){
      setInput(currentField.placeholder)
    }

  },[currentField.variant])

  


  const handleVideoChange = async(e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
      const newVideo = Array.from(e.target.files)
      const validVideo = newVideo.filter(video => 
        video.size <= MAX_VIDEO_SIZE
      )
      if(validVideo.length !== newVideo.length){
        setVideoError('No video selected')
      }
      const newPreview = validVideo.map(video => URL.createObjectURL(video))
      
      setVideos((prevPreviews: any) => [...prevPreviews, ...newPreview])
      // setInput(newPreview[0])
      
    }
  }

  const handleVideoSubmit = async(e:any) => {
    e.preventDefault();
    if(!videoUrl){
      setVideoError("Please enter a valid video url");
      return;
    }
    const validUrlPattern = /^(https?:\/\/.*\.(mp4|mov|avi|mkv|webm))|(https?:\/\/(www\.)?youtube\.com\/watch\?v=\w+)|(https?:\/\/youtu\.be\/\w+)/;
    if (!validUrlPattern.test(videoUrl)) {
      setVideoError('Invalid video URL. Please provide a direct video link or YouTube link.');
      return;
    }
      setVideos((prevVideos: any) => [...prevVideos, videoUrl]);
      // setInput(videoUrl)
      
    
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
  
      // Validate image size
      const validImages = newImages.filter(
        (image) => image.size <= MAX_IMAGE_SIZE // Replace `MAX_IMAGE_SIZE` with your desired size limit in bytes
      );
  
      if (validImages.length !== newImages.length) {
        setImageError("Some images were not uploaded. Please ensure all images are under the size limit.");
        return;
      }
  
      // Generate previews for valid images
      const newPreviews = validImages.map((image) => URL.createObjectURL(image));
  
      // Update state
      setSelectedImage((prevImages: any) => [...prevImages, ...newPreviews]);
      // setInput(newPreviews[0]);
      setImageError(null);
    }
  };

  const handleImageSubmit = async (e: any) => {
    e.preventDefault();
  
    if (!imageUrl) {
      setImageError("Please enter a valid image URL.");
      return;
    }
  
    const validImageUrlPattern = /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp))$/i;
    if (!validImageUrlPattern.test(imageUrl)) {
      setImageError("Invalid Image URL. Please provide a valid image link.");
      return;
    }
  
    // Add the image URL to the state
    setSelectedImage((prevImages: any) => [...prevImages, imageUrl]);
    setImageUrl(""); // Clear input field
  };

  const handleFileSubmit = async (e: any) => {
    e.preventDefault();
  
    if (!fileUrl) {
      setFileError("Please enter a valid file URL.");
      return;
    }
  
    const validFileUrlPattern =  /^(https?:\/\/.*\.(doc|docx|xls|xlsx|csv|pdf|ppt|pptx|txt))$|^(https?:\/\/docs\.google\.com\/(document|spreadsheets)\/d\/[a-zA-Z0-9-_]+)/i
    if (!validFileUrlPattern.test(fileUrl)) {
      setFileError("Invalid File URL. Please provide a valid file link.");
      return;
    }
  
    // Add the image URL to the state
    setSelectedFile((prevImages: any) => [...prevImages, fileUrl]);
    setFileName(fileUrl)
    setFileUrl(""); // Clear input field
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
  
      // Validate image size
      const validFiles = newFiles.filter(
        (file) => file.size <= MAX_FILE_SIZE // Replace `MAX_IMAGE_SIZE` with your desired size limit in bytes
      );
  
      if (validFiles.length !== newFiles.length) {
        setFileError("Some Files were not uploaded. Please ensure all files are under the size limit.");
        return;
      }
  
      // Generate previews for valid images
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
  
      // Update state
      setSelectedFile((prevFiles: any) => [...prevFiles, ...newPreviews]);
      // setInput(newPreviews[0]);
    setFileName(e.target.files[0].name)

      setFileError(null);
    }
  };

  


  
  switch (currentField.variant) {
    case "Text Area":
      return (
        <Textarea
          placeholder={currentField.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className=" border-gray-700 w-full placeholder:text-gray-400"
        />
      );
    case "Text Box":
      return (
        <Input
          type="text"
          placeholder={currentField.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className=" border-gray-700 w-full placeholder:text-gray-400"
        />
      );
      case "Label":
      return (
        <Input
          type="text"
          placeholder={currentField.placeholder}
          readOnly
          value={currentField.placeholder}
          
          className=" border-gray-700 bg-gray-100 placeholder:text-gray-400"
        />
      );
    case "Number":
      return (
        <Input
          type="number"
          placeholder={currentField.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className=" border-gray-700 placeholder:text-gray-400"
        />
      );
    case "Mobile":
      return (
        <Input
          type="number"
          placeholder={currentField.placeholder}
          value={input}
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className=" border-gray-700 placeholder:text-gray-400"
        />
      );
    case "Email":
      return (
        <Input
          type="email"
          placeholder={currentField.placeholder}
          value={input}
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
          selected={selectedDate}
          onSelect={(date: any) => {
            setSelectedDate(date)
            setInput(new Date(date).toDateString())
          }}
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
    // case "Dropdown":
    //   return (
    //     <Select
    //       onValueChange={(value) => {
    //         currentField.onChange;
    //         setInput(value);
    //       }}
    //       defaultValue={currentField?.options && currentField?.options[0]}
    //     >
    //       <SelectTrigger>
    //         <SelectValue placeholder={currentField.placeholder} />
    //       </SelectTrigger>

    //       <SelectContent>
    //         {currentField.options?.map((option: any) => (
    //           <SelectItem key={option} value={option}>
    //             {option}
    //           </SelectItem>
    //         ))}
    //       </SelectContent>
    //     </Select>
    //   );
    case "Dropdown":
      return(
        <div className="flex gap-2.5 items-center w-full">
          {currentField.options?.map((option:any,index:number) => (
            <div key={index} className={`flex ${selectedOption === option ? "bg-primary text-secondary" : "bg-background"} cursor-pointer  border rounded-full p-2.5`}
            onClick={() => {
              setInput(option)
              setSelectedOption(option)
              }}>
              <span>{option}</span>
            </div>
          ))}
        </div>
      )
    case "Check Box":
      return (
        <div className="flex w-full items-center gap-2.5">
          <div className="flex  w-full items-center space-x-2">
                <div className="border rounded-full flex gap-2 items-center p-2.5">
                <Checkbox id="terms" onCheckedChange={(value: any) => setInput(currentField.label)} />
                <Label htmlFor="terms">{currentField.label}</Label>
                </div>
              </div>
            

          {/* <span>{currentField.label}</span> */}
        </div>
      );
      case "Check box label":
        return (
         
              <div className="flex  w-full items-center space-x-2">
                <div className="border rounded-full flex gap-2 items-center p-2.5">
                <Checkbox id="terms" onCheckedChange={(value: any) => setInput(currentField.label)} />
                <Label htmlFor="terms">{currentField.label}</Label>
                </div>
              </div>
            
        );
        case "Badge":
      return (
        <div>
          <Badge>{currentField.name}</Badge>
          
        </div>
      );
    case "Radio Group":
      return (
        <RadioGroup
        value={formData.preference}
        onValueChange={(value) => setInput(value)}
        className="flex w-full flex-wrap items-center"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          {apiFieldData?.length > 0 ? 
          apiFieldData?.map((item: any,index: any) => (
            <div key={index} className="flex border rounded-full p-2.5  items-center gap-2">
              <RadioGroupItem value={item} id={index}/>
              <Label htmlFor={index}>{item}</Label>
            </div>
          )):
          currentField.radiogroup?.map((item: any,index: any) => (
            <div key={index} className="flex border rounded-full p-2.5  items-center gap-2">
              <RadioGroupItem value={item} id={index}/>
              <Label htmlFor={index}>{item}</Label>
            </div>
          ))
        }
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
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor={"image-upload"}
                    className={`relative flex flex-col items-center justify-center w-full ${
                      selectedImage?.length > 0 ? "h-fit" : "h-64"
                    } border border-primary border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-secondary transition-all duration-300 ease-in-out overflow-hidden`}
                  >
                    {selectedImage?.length > 0 ? (
                      <div className="relative w-full">
                        <img
                          src={selectedImage[0]}
                          alt="Preview"
                          className="h-fit w-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedImage((prevImages: any) =>
                              prevImages.filter((_: any, index: number) => index !== 0)
                            );
                          }}
                          className="absolute top-2 right-2 z-10"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-8 h-8 mb-4 text-primary" />
                        <p className="mb-2 text-sm text-primary">
                          <span className="font-semibold">Click to upload an image</span>
                        </p>
                      </div>
                    )}
                    <Input
                      id={"image-upload"}
                      type="file"
                      onChange={handleImageChange}
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-2.5">
                <Input
                  value={imageUrl}
                  placeholder="Enter image URL"
                  className="border-secondary"
                  disabled={selectedImage?.length > 0}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button disabled={!imageUrl} onClick={handleImageSubmit}>
                  <Link className="w-4 h-4 mr-2" />
                  Add URL
                </Button>
              </div>
              {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
            </CardContent>
          </Card>
        );
    case "File Upload":
      return (
        <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor={"file-upload"}
                    className={`relative flex flex-col items-center justify-center w-full ${
                      selectedFile?.length > 0 ? "h-64" : "h-64"
                    } border border-primary border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-secondary transition-all duration-300 ease-in-out overflow-hidden`}
                  >
                    {selectedFile && selectedFile?.length > 0 ? (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <File/>
                      <span>{fileName}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedFile((prevImages: any) =>
                            prevImages.filter((_: any, index: number) => index !== 0)
                          );
                        }}
                        className="absolute top-2 right-2"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadIcon className="w-8 h-8 mb-4 text-primary" />
                      <p className="mb-2 text-sm text-primary">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-primary">
                        PDF, DOC, DOCX, XLS, XLSX, CSV (MAX. 5MB)
                      </p>
                    </div>
                  )}
                    <Input
                      id={"file-upload"}
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.xlsx,.xls,.doc,.ppt,.txt,.docx,.pptx,.csv"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-2.5">
                <Input
                  value={fileUrl}
                  placeholder="Enter image URL"
                  className="border-secondary"
                  disabled={selectedFile?.length > 0}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
                <Button disabled={!fileUrl} onClick={handleFileSubmit}>
                  <Link className="w-4 h-4 mr-2" />
                  Add URL
                </Button>
              </div>
              {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
            </CardContent>
          </Card>
      );
    case "Video Upload":
      return(
        
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor={"video-upload"}
                className={`relative flex flex-col items-center justify-center w-full ${
                  videos?.length > 0 ? 'h-fit' : 'h-64'
                } border border-primary border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-secondary transition-all duration-300 ease-in-out overflow-hidden`}
              >
                {videos.length > 0 ? (
                  <div className="relative w-full">
                    {videos[0].startsWith('http') ? (
                      /(youtube\.com|youtu\.be)/.test(videos[0]) ? (
                        <iframe
                          src={videos[0].replace('watch?v=', 'embed/')}
                          title="video-preview"
                          className="h-64 w-full"
                          frameBorder="0"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      ) : (
                        <video src={videos[0]} controls className="h-fit w-full" />
                      )
                    ) : (
                      <video src={videos[0]} controls className="h-fit w-full" />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // removeVideo(0);
                      }}
                      className="absolute top-2 right-2 z-10"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-8 h-8 mb-4 text-primary" />
                    <p className="mb-2 text-sm text-primary">
                      <span className="font-semibold">Click to upload a video</span>
                    </p>
                  </div>
                )}
                <Input
                  id={"video-upload"}
                  type="file"
                  onChange={handleVideoChange}
                  accept=".mp4, .mov, .avi, .mkv, .webm"
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <Input
              value={videoUrl}
              placeholder="Enter video URL (supports YouTube links)"
              className="border-secondary"
              disabled={videos?.length > 0}
              onChange={(e) => setVideoUrl(e.target.value)}
              
            />
            <Button  disabled={!videoUrl} onClick={handleVideoSubmit}>
              <Link className="w-4 h-4 mr-2" />
              Add URL
            </Button>
          </div>
          {videoError && <p className="text-red-500 mt-2">{videoError}</p>}
        </CardContent>
      </Card>
      )

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
                  {value
                ? currentField.combobox?.find((item:any) => item === value)
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
                      setValue(item);
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

      // case "Multi Select":
      // return (
        
          
      //       <MultiSelector
      //         values={selectedValues}
      //         onValuesChange={(newValues:any) => {
      //           setSelectedValues(newValues);
      //           setInput(newValues)
                
      //         }}
      //         className="max-w-xs"
      //       >
      //         <MultiSelectorTrigger>
      //           <MultiSelectorInput placeholder={currentField.placeholder} />
      //         </MultiSelectorTrigger>
      //         <MultiSelectorContent>
      //           <MultiSelectorList>
      //             {currentField?.multiselect?.map((item:any,index:any) => (
      //               <MultiSelectorItem key={index} value={item}>
      //                 {item}
      //               </MultiSelectorItem>
      //             ))}
      //           </MultiSelectorList>
      //         </MultiSelectorContent>
      //       </MultiSelector>
          
      // );
    case "Multi Select":
      const toggleItem = (item: string) => {
        const updatedSelection = multiSelectedItems.includes(item)
          ? multiSelectedItems.filter((selected) => selected !== item) // Remove item if already selected
          : [...multiSelectedItems, item]; // Add item if not selected
    
        setMultiSelectedItems(updatedSelection);
        setInput(updatedSelection.join(","));
      };
      return (
        <div className="w-full flex gap-2.5 items-center flex-wrap">
        {currentField?.multiselect?.map((item: string, index: number) => (
          <div
            key={index}
            className={`border cursor-pointer gap-3 rounded-full flex  items-center p-2.5 ${
              multiSelectedItems.includes(item) ? "bg-primary text-secondary" : ""
            }`}
            onClick={() => toggleItem(item)}
          >
            <Checkbox
              checked={multiSelectedItems.includes(item)}
              // onChange={() => toggleItem(item)}
              onCheckedChange={() => toggleItem(item)}
              className="cursor-pointer"
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    )

    case "Location Select":
      return (
        <div className="w-full">
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
        </div>
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
