import React, { useState, useEffect, ChangeEvent } from "react";
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
import {  Link, UploadIcon, X, XIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "../ui/use-toast";
import { ADD_CONNECTIONS, NEXT_PUBLIC_API_KEY } from "@/constants/envConfig";
import Image from "next/image";

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
  const [editedField, setEditedField] = useState<any>(null);
  const [fieldType, setFieldType] = useState<string>();
  const [newOption, setNewOption] = useState("");
  const [comboboxOptions, setComboboxOptions] = useState("");
  const [multiSelect, setMultiSelect] = useState("");
  const [radioGroup, setRadioGroup] = useState("");
  const [error, setError] = useState(false);
  const [useAPI, setUseAPI] = useState(false);
  const [apiURL, setAPIURL] = useState("");
  const [apiField, setApiField] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false)
  const [isPlaceholderChecked, setIsPlaceholderChecked] = useState(false)
  const [isUrlChecked, setIsUrlChecked] = useState(false)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_VIDEO_SIZE = 2 * 1024 * 1024;



  useEffect(() => {
    setEditedField(field);
  }, [field]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    
      if (e.target.files) {
        setUploading(true)
        const newImages = Array.from(e.target.files);
        const validImages = newImages.filter(
          (file) =>
            file.size <= MAX_FILE_SIZE
        );
  
        if (validImages.length !== newImages.length) {
          setUploadError(
            "Some files were not added. Please ensure all files are images (JPG, PNG, or GIF) and under 5MB."
          );
        } else {
          setUploadError("");
        }

        const newPreviews = validImages.map((file) => URL.createObjectURL(file));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
          const formData = new FormData();
          validImages.forEach((file) => {
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
            setEditedField({ ...editedField, placeholder_file_url: data.url })
            setUploading(false)
            
          } catch (error) {
            console.error("Upload error:", error);
            setUploadError("Failed to upload file. Please try again.");
            setUploading(false)
          } 
      }
    };

    const handleFileSubmit = async (e: any) => {
      setUploading(true)
      e.preventDefault();
      setUploadError("");
      if (!imageUrl) {
        setUploadError("Please enter a valid video url");
        return;
      }
      const validImageUrlPattern =
        /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp|tif|svg))$/i;
      if (!validImageUrlPattern.test(imageUrl)) {
        setUploadError(
          "Invalid Image URL. Please provide a valid Image Link."
        );
        return;
      }
      setImagePreviews((prevVideos) => [...prevVideos, imageUrl]);
      const payload = {
        url: imageUrl,
      };
      
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
  
          if (!response.ok) {
            throw new Error("Upload failed");
          }
  
          const data = await response.json();
          if (data.url) {
            setEditedField({ ...editedField, placeholder_file_url: data.url })
            setUploading(false)

          }
          setImagePreviews((prevVideos) => [...prevVideos, imageUrl]);
          // setValue(validImages);
        } catch (error) {
          console.error("Upload error:", error);
          setUploadError("Failed to upload video URL. Please try again.");
          setUploading(false)
        }
      
    };

  const removeImage = (index: number) => {
      setImagePreviews((prevPreviews) =>
        prevPreviews.filter((_, i) => i !== index)
      );
  };

  const handleVideoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploading(true)
      const newVideo = Array.from(e.target.files);
      const validVideo = newVideo.filter(
        (video) => video.size <= MAX_VIDEO_SIZE
      );
      if (validVideo.length !== newVideo.length) {
        setVideoUrl("");
      }
      const newPreview = validVideo.map((video) => URL.createObjectURL(video));
      setVideoPreviews((prevPreviews) => [...prevPreviews,...newPreview]);

        const formData = new FormData();
        validVideo.forEach((file) => {
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
          if (data.url) {
            setEditedField({...editedField, placeholder_video_url: data.url})
            setUploading(false)
          }
          setVideoUrl("");
          
        } catch (error) {
          console.error("Upload error:", error);
          setUploadError("Failed to upload file. Please try again.");
          setUploading(false)
        } finally {
          setUploading(false);
        }
      
    }
  };

  const handleVideoSubmit = async (e: any) => {
    setUploading(true)
    e.preventDefault();
    setUploadError("");
    if (!videoUrl) {
      setUploadError("Please enter a valid video url");
      return;
    }
    const validUrlPattern =
      /^(https?:\/\/.*\.(mp4|mov|avi|mkv|webm))|(https?:\/\/(www\.)?youtube\.com\/watch\?v=\w+)|(https?:\/\/youtu\.be\/\w+)/;
    
    if (!validUrlPattern.test(videoUrl)) {
      setUploadError(
        "Invalid Video URL. Please provide a valid Video Link."
      );
      return;
    }
    setVideoPreviews((prevVideos) => [...prevVideos, videoUrl]);
    const payload = {
      url: videoUrl,
    };
    
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        if (data.url) {
          setEditedField({ ...editedField, placeholder_video_url: data.url })
          setUploading(false)

        }
        setVideoPreviews((prevVideos) => [...prevVideos, videoUrl]);
        // setValue(validImages);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError("Failed to upload video URL. Please try again.");
        setUploading(false)
      }
    
  };

const removeVideo = (index: number) => {
    setVideoPreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
};

  

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

  const handleAddApiData = async() => {
    setUploading(true);
    const validApis = await fetchValidApi();
    const isValid = validApis.filter((item:any) => item.api_url === apiURL);

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
        setUploading(false);
        if(editedField?.variant === "Radio Group"){
          const firstNameValues = data.map((item: any) => item[apiField]);
          setApiFieldData(firstNameValues)
        }
        if(editedField?.variant === "Send Image"){
        setEditedField({...editedField, placeholder_file_url : data.map((item: any) => item[apiField])[0]})
        }
        else if(editedField?.variant === "Send Video"){
          setEditedField({...editedField, placeholder_video_url : data.map((item: any) => item[apiField])[0]})
        }
       
        
        
      
        if(data) {
          toast({
            description: "Options added from API successfully",
            variant: "default",
          });
        } else {
          toast({
            description: "No valid  values found",
            variant: "destructive",
          });
        setUploading(false);

        }
      }
      catch(error){
        toast({ description: "Failed to fetch data", variant: "destructive" })

      }
    }

  }

  const handleSave = async() => {
  //   if(useAPI){
  //     setRadioGroup("")
      
      
  //   const validApis = await fetchValidApi();
    

  //   const isValid = validApis.filter((item:any) => item.api_url === apiURL)
   

  //   if(isValid.length === 0){
  //     toast({description: "Invalid API URL", variant: "destructive"})
  //   }

  //   if(!isValid || !apiURL || !apiField){
  //     toast({description: "Something went wrong", variant: "destructive"})
  //   }

  //   if(isValid && isValid.length > 0 && apiURL && apiField){
  //     const {key, secret} = isValid && isValid[0];

  //     try{
  //       const requestOptions = {
  //         method: "GET",
  //         headers: {
  //           [key]: secret,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //       const response = await fetch(apiURL, requestOptions)
  //       if(!response.ok){
  //         toast({description: "Failed to fetch data", variant: "destructive"})
  //       }
  //       const data = await response.json()
  //       const firstNameValues = data.map((item: any) => item[apiField]);
  //       setApiFieldData(firstNameValues)
      
  //       if(firstNameValues) {
  //         toast({
  //           description: "Options added from API successfully",
  //           variant: "default",
  //         });
  //       } else {
  //         toast({
  //           description: "No valid `firstName` values found",
  //           variant: "destructive",
  //         });
  //       }
  //     }
  //     catch(error){
  //       toast({ description: "Failed to fetch data", variant: "destructive" })

  //     }
  //   }
  // } 
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
        options:editedField?.options?.filter((_: any,i: string | number) => i !== index)
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
          <If condition={field?.variant !== "Send Video"}
          render={() => (
          <div>
          <div>
            <Label htmlFor="file-upload">
             <div className="flex items-center gap-2.5 my-2">
               <Checkbox checked={isPlaceholderChecked} 
               onCheckedChange={() => setIsPlaceholderChecked(!isPlaceholderChecked)} /> Use upload placeholder</div>
            </Label>
            
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className={`relative flex flex-col items-center justify-center w-full h-64 border border-primary border-dashed rounded-lg ${!isPlaceholderChecked ? "cursor-not-allowed" : "cursor-pointer"} bg-secondary hover:bg-secondary transition-all duration-300 ease-in-out overflow-hidden`}
                    >
                      {imagePreviews.length > 0 ? (
                        <>
                          <Image
                            src={imagePreviews[0]}
                            alt="Preview"
                            layout="fill"
                            className=""
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeImage(0);
                            }}
                            className="absolute top-2 right-2 z-10"
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className={`flex ${!isPlaceholderChecked && "bg-gray-100 cursor-not-allowed"} flex-col items-center justify-center pt-5 pb-6`}>
                          <UploadIcon className="w-8 h-8 mb-4 text-primary" />
                          <p className="mb-2 text-sm text-primary">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-primary">
                            JPG, PNG, or GIF (MAX. 5MB)
                          </p>
                        </div>
                      )}
                      <Input
                        id="file-upload"
                        type="file"
                        disabled={!isPlaceholderChecked || uploading || imageUrl?.length > 0}
                        onChange={handleFileUpload}
                        accept=".jpg,.jpeg,.png,.gif"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
          </div>
          
          <div>
            <div className="flex gap-2.5 items-center my-2">
              <Checkbox checked={isUrlChecked}
               onCheckedChange={() => setIsUrlChecked(!isUrlChecked)}
               /> Use URL placeholder
            </div>
            <div className="mt-2.5 flex items-center gap-2.5">
                    <Input
                      value={imageUrl}
                      placeholder="Enter Image URL"
                      className="border-secondary"
                      disabled={!isUrlChecked || imagePreviews?.length > 0}
                      onChange={(e) => {
                        setImageUrl(e.target.value)

                      }}
                    />
                    <Button
                      disabled={!isUrlChecked || !imageUrl || imagePreviews?.length > 0}
                      onClick={handleFileSubmit}
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Add URL
                    </Button>
                  </div>
          </div>
          {uploadError && <span className="text-red-500">{uploadError}</span>}
          </div>
          )}
          />
          <If condition={field?.variant === "Send Video"}
          render={() => (
            <div>
            <div>
              <Label htmlFor="video-upload">
               <div className="flex items-center gap-2.5 my-2">
                 <Checkbox checked={isPlaceholderChecked} 
                 onCheckedChange={() => setIsPlaceholderChecked(!isPlaceholderChecked)} /> Use upload placeholder</div>
              </Label>
              
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="video-upload"
                        className={`relative flex flex-col items-center justify-center w-full h-64 border border-primary border-dashed rounded-lg ${!isPlaceholderChecked ? "cursor-not-allowed" : "cursor-pointer"} bg-secondary hover:bg-secondary transition-all duration-300 ease-in-out overflow-hidden`}
                      >
                        {videoPreviews.length > 0 ? (
                        <div className="relative w-full">
                          {videoPreviews[0].startsWith("http") ? (
                            /(youtube\.com|youtu\.be)/.test(videoPreviews[0]) ? (
                              <iframe
                                src={videoPreviews[0].replace("watch?v=", "embed/")}
                                title="video-preview"
                                className="h-64 w-full"
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                              />
                            ) : (
                              <video
                                src={videoPreviews[0]}
                                controls
                                className="h-fit w-full"
                              />
                            )
                          ) : (
                            <video
                              src={videoPreviews[0]}
                              controls
                              className="h-fit w-full"
                            />
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeVideo(0);
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
                            <span className="font-semibold">
                              Click to upload a video
                            </span>
                          </p>
                        </div>
                      )}
                        <Input
                          id="video-upload"
                          type="file"
                          disabled={!isPlaceholderChecked || uploading || videoUrl?.length > 0}
                          onChange={handleVideoUpload}
                          accept=".mp4, .mov, .avi, .mkv, .webm"
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
            </div>
            
            <div>
              <div className="flex gap-2.5 items-center my-2">
                <Checkbox checked={isUrlChecked}
                 onCheckedChange={() => setIsUrlChecked(!isUrlChecked)}
                 /> Use URL placeholder
              </div>
              <div className="mt-2.5 flex items-center gap-2.5">
                      <Input
                        value={videoUrl}
                        placeholder="Enter Video URL"
                        className="border-secondary"
                        disabled={!isUrlChecked || videoPreviews?.length > 0}
                        onChange={(e) => {
                          setVideoUrl(e.target.value)
  
                        }}
                      />
                      <Button
                        disabled={!isUrlChecked || !videoUrl || videoPreviews?.length > 0}
                        onClick={handleVideoSubmit}
                      >
                        <Link className="w-4 h-4 mr-2" />
                        Add URL
                      </Button>
                    </div>
            </div>
            {uploadError && <span className="text-red-500">{uploadError}</span>}
            </div>

          )}
          />
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
                  {editedField?.options?.map((item: any,index: any) => (
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
                  {editedField?.combobox?.map((item: any,index: any) => (
                    <div key={index} className="p-2.5 bg-secondary rounded flex justify-between items-center">
                      <span>{item}</span>
                      <span className="cursor-pointer"
                      onClick={() => {
                        if(editedField){
                          setEditedField({
                            ...editedField,
                            combobox: editedField.combobox?.filter((_: any,i: any) => i !== index)
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
                  {editedField?.multiselect?.map((item: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined,index: React.Key | null | undefined) => (
                    <div key={index} className="p-2.5 bg-secondary rounded flex justify-between items-center">
                      <span>{item}</span>
                      <span className="cursor-pointer"
                      onClick={() => {
                        if(editedField){
                          setEditedField({
                            ...editedField,
                            multiselect: editedField.multiselect?.filter((_: any,i: any) => i !== index)
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
                  {editedField?.radiogroup?.map((item: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined,index: React.Key | null | undefined) => (
                    <div key={index} className="p-2.5 bg-secondary rounded flex justify-between items-center">
                      <span>{item}</span>
                      <span className="cursor-pointer"
                      onClick={() => {
                        if(editedField){
                          setEditedField({
                            ...editedField,
                            radiogroup: editedField.radiogroup?.filter((_: any,i: any) => i !== index)
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
              "Radio Group",
              "Send Image",
              "Send Video"
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
            <Button className="mt-2" onClick={handleAddApiData}>Add Data</Button>
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
          <Button onClick={handleSave} disabled={uploading}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
