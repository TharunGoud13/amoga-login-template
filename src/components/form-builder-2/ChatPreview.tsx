"use client"
import * as React from "react"
import { Bot, File, FileText, Table, User, XIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { FaArrowUp } from "react-icons/fa6";
import RenderInputField from "./render-chat-field"
import Image from "next/image"
import { FaRegFilePdf } from "react-icons/fa";

type Message = {
  id: string
  role: "user" | "assistant"
  content: React.ReactNode
  componentType?: string
}

export function ChatForm({ formFields,apiFieldData }: any) {
  const [messages, setMessages] = React.useState<Message[]>([
    // { 
    //   id: uuidv4(), 
    //   role: "assistant", 
    //   // content: "Welcome! Let's go through the form together. We'll start with the first question:" 
    // },
  ]);
  
  const [input, setInput] = React.useState<any>()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState<Record<string, any>>({})
  const [selectedImage, setSelectedImage] = React.useState<string[]>([])
  const [selectedFile, setSelectedFile] = React.useState<string[]>([])
  const [selectedPdf, setSelectedPdf] = React.useState<string[]>([])
  const [fileName, setFileName] = React.useState("")
  const [pdfName, setPdfName] = React.useState("")
  const [videos, setVideos] = React.useState<string[]>([])
  const [videoError, setVideoError] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [pdfError, setPdfError] = React.useState<string | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  console.log("selectedImage----",selectedImage)
  console.log("selectedFile----",selectedFile)
  console.log("fileName----",fileName)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  const addMessage = React.useCallback((role: "user" | "assistant", content: React.ReactNode, componentType?: string) => {
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), role, content, componentType },
    ])
    setTimeout(scrollToBottom, 50)
  }, [])

  // Find the first non-disabled field
  const findFirstActiveField = () => {
    return formFields.findIndex((field: { disabled: any }) => !field.disabled);
  }

  React.useEffect(() => {
    // Find the first non-disabled field
    const firstActiveFieldIndex = findFirstActiveField();
    
    if (firstActiveFieldIndex !== -1) {
      const firstField = formFields[firstActiveFieldIndex];
      addMessage("assistant",
        <div className="flex flex-col"> 
        <div className="flex gap-2 items-center">
        <span>{firstField.label}</span> {firstField.required && <span className="text-red-500">*</span>}
        </div>
        <span className="text-sm text-gray-400">{firstField.description}</span>
        </div>);
      
      // Update current step to the first active field
      setCurrentStep(firstActiveFieldIndex);
    }
  }, []);

  const getFileIcon = (fileName: any) => {
    const extension = fileName.split('.').pop().toLowerCase();
    console.log("extension----",extension);
    switch (extension) {
      
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <Table className="w-8 h-8 text-green-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

//   React.useEffect(() => {
//     if (selectedImage) {
//         const imagePreview = URL.createObjectURL(selectedImage);
//         addMessage(
//             "assistant",
//             <div className="relative w-fit">
//                 <Image
//                     src={imagePreview}
//                     alt="Uploaded"
//                     height={200}
//                     width={200}
//                     className="max-w-[200px] rounded-lg border"
//                 />
//                 {/* <button
//                     onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         setSelectedImage(null);
//                         // Remove the last assistant message which contains the preview
//                         setMessages(prev => prev.slice(0, -1));
//                     }}
//                     hidden={isImageSubmitted}
//                     className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                 >
//                     <XIcon className="h-4 w-4" />
//                 </button> */}
//             </div>
//         );

//         // Cleanup function to revoke the URL when component unmounts or image changes
//         return () => {
//             URL.revokeObjectURL(imagePreview);
//         };
//     }
// }, [addMessage, selectedImage, setMessages]);

// React.useEffect(() => {
//     if (selectedFile) {
//         addMessage(
//             "assistant",
//             <div className="relative w-fit">
//                 <div className="flex items-center p-4 border rounded-lg">
//                     <div className="text-2xl mr-3"><File/></div>
//                     <span className="text-sm font-medium truncate max-w-[200px]">
//                         {selectedFile.name}
//                     </span>
//                 </div>
//                 {/* {!formData[formFields[currentStep].name] &&
//                 <button
//                     onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         setSelectedFile(null);
//                         // Remove the last assistant message which contains the preview
//                         setMessages(prev => prev.slice(0, -1));
//                     }}
//                     className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                 >
//                     <XIcon className="h-4 w-4" />
//                 </button> */}
//     {/* } */}
//             </div>
//         );
//     }
// }, [addMessage, selectedFile, setMessages,  formData, currentStep, formFields]);

console.log("formFields----",formFields)


const displayVideo = (videoUrl: string) => {
  if (/(youtube\.com|youtu\.be)/.test(videoUrl)) {
      return (
        <div className="md:h-64 w-full relative">
        <iframe
              src={videoUrl.replace('watch?v=', 'embed/')}
              title="video-preview"
              className="md:h-64 w-full rounded-lg border block"
              style={{display: "block"}}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
          />
          </div>
          
      );
  } else {
      return (
          <video
              src={videoUrl}
              controls
              className="md:h-64  rounded-lg border"
          />
      );
  }
};

const displayImage = (imageUrl: string) => {
  
      return (
          <img
              src={selectedImage[0]}
              className="md:h-64 w-full rounded-lg border"
          />
      );
  
};

const displayFile = (imageUrl: string) => {
  
  return (
      <div className="flex flex-col flex-wrap items-center p-4 gap-2.5 rounded-lg">
        {getFileIcon(fileName)}
        <span className="text-sm flex flex-wrap md:text-md">{fileName}</span>
      </div>
  );

};

const displayPdf = (imageUrl: string) => {
  return (
      <div className="flex flex-col flex-wrap items-center p-4 gap-2.5 rounded-lg">
        <FaRegFilePdf className="h-5 w-5 text-red-500"/>
        <span className="text-sm flex flex-wrap md:text-md">{pdfName}</span>
      </div>
  );

};

  // Validation function
  const validateInput = (currentField: any, value: any): string | null => {
    // Check if field is required
    if (currentField.required && (!value || value.trim() === '')) {
      return `${currentField.label} is required`;
    }

    // Specific validations based on field variant
    switch (currentField.variant) {
      case 'Email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return 'Invalid email address';
        }
        break;
      
      case 'Mobile':
        const phoneRegex = /^[0-9]{10}$/;
        if (value && !phoneRegex.test(value)) {
          return 'Invalid mobile number (10 digits required)';
        }
        break;
      
      case 'Number':
        if (value && isNaN(Number(value))) {
          return 'Please enter a valid number';
        }
        break;
      
      // case 'Password':
      //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      //   if (value && !passwordRegex.test(value)) {
      //     return 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
      //   }
      //   break;
      
      case 'OTP':
        const otpRegex = /^[0-9]{6}$/;
        if (value && !otpRegex.test(value)) {
          return 'OTP must be a 6-digit number';
        }
        break;
    }

    return null;
  }

  const findNextActiveField = (currentIndex: number) => {
    for (let i = currentIndex + 1; i < formFields.length; i++) {
      if (!formFields[i].disabled) {
        return i;
      }
    }
    return -1; // No more active fields
  }

  const handleSubmit = () => {
    const currentField = formFields[currentStep];

    if (selectedImage.length > 0) {
      const imageToDisplay = selectedImage[0]; // Display the first video in the state
  
      addMessage(
          "user",
          <div className="flex md:h-64 w-full items-center">
              {displayImage(imageToDisplay)}
          </div>
      );
  
      // Update form data
      setFormData((prev) => ({
          ...prev,
          [currentField.name]: imageToDisplay,
      }));
  
      // Reset states
      setSelectedImage((prev) => prev.slice(1))
      // setVideos((prev) => prev.slice(1)); // Remove the displayed video from state
      setInput("");
  
      // Handle next step
      const nextStep = findNextActiveField(currentStep);
      setCurrentStep(nextStep);
  
      if (nextStep !== -1) {
          const nextField = formFields[nextStep];
          addMessage(
              "assistant",
              <div>
                  <span className="label">{nextField.label}</span>
                  {nextField.required && <span className="text-red-500">*</span>}
                  <br />
                  <span className="text-sm text-gray-400">{nextField.description}</span>
              </div>
          );
      } else {
          addMessage("assistant", "Thank you for completing the form.");
      }
    }

    if (selectedFile.length > 0) {
      const fileToDisplay = selectedFile[0]; // Display the first video in the state
  
      addMessage(
          "user",
          <div className="flex h-fit w-full items-center">
              {displayFile(fileToDisplay)}
          </div>
      );
  
      // Update form data
      setFormData((prev) => ({
          ...prev,
          [currentField.name]: fileToDisplay,
      }));
  
      // Reset states
      setSelectedFile((prev) => prev.slice(1))
      // setVideos((prev) => prev.slice(1)); // Remove the displayed video from state
      setInput("");
  
      // Handle next step
      const nextStep = findNextActiveField(currentStep);
      setCurrentStep(nextStep);
  
      if (nextStep !== -1) {
          const nextField = formFields[nextStep];
          addMessage(
              "assistant",
              <div>
                  <span className="label">{nextField.label}</span>
                  {nextField.required && <span className="text-red-500">*</span>}
                  <br />
                  <span className="text-sm text-gray-400">{nextField.description}</span>
              </div>
          );
      } else {
          addMessage("assistant", "Thank you for completing the form.");
      }
    }

    if (selectedPdf.length > 0) {
      const fileToDisplay = selectedPdf[0]; // Display the first video in the state
  
      addMessage(
          "user",
          <div className="flex h-fit w-full items-center">
              {displayPdf(fileToDisplay)}
          </div>
      );
  
      // Update form data
      setFormData((prev) => ({
          ...prev,
          [currentField.name]: fileToDisplay,
      }));
  
      // Reset states
      setSelectedPdf((prev) => prev.slice(1))
      // setVideos((prev) => prev.slice(1)); // Remove the displayed video from state
      setInput("");
  
      // Handle next step
      const nextStep = findNextActiveField(currentStep);
      setCurrentStep(nextStep);
  
      if (nextStep !== -1) {
          const nextField = formFields[nextStep];
          addMessage(
              "assistant",
              <div>
                  <span className="label">{nextField.label}</span>
                  {nextField.required && <span className="text-red-500">*</span>}
                  <br />
                  <span className="text-sm text-gray-400">{nextField.description}</span>
              </div>
          );
      } else {
          addMessage("assistant", "Thank you for completing the form.");
      }
    }

    // if (selectedImage) {
    //   const imagePreview = URL.createObjectURL(selectedImage);
    //   addMessage(
    //     "user",
    //     <Image
    //       src={imagePreview}
    //       alt="Uploaded"
    //       height={200}
    //       width={200}
    //       className="max-w-[200px] rounded-lg border"
    //     />
    //   );
    //   setFormData((prev) => ({
    //     ...prev,
    //     [currentField.name]: selectedImage.name,
    //   }));
     
    //   setSelectedImage(null);
      
    //   setInput("");
    //   const nextStep = findNextActiveField(currentStep);
    //   setCurrentStep(nextStep);

    //   if (nextStep !== -1) {
    //     const nextField = formFields[nextStep];
    //     addMessage(
    //       "assistant",
    //       <div>
    //         <span className="label">{nextField.label}</span>
    //         {nextField.required && <span className="text-red-500">*</span>}
    //         <br />
    //         <span className="text-sm text-gray-400">{nextField.description}</span>
    //       </div>
    //     );
    //   } else {
    //     addMessage("assistant", "Thank you for completing the form.");
    //   }
    //   return;
    // }

  //   if (selectedFile) {
  //     // Get file type icon and styling based on file extension
  //     const getFileDisplay = (file: File) => {
          
          
  //         return (
  //             <div className={`flex items-center p-4  rounded-lg border max-w-[300px]`}>
  //                 <div className="text-2xl mr-3"><File/></div>
  //                 <div className="flex flex-col">
  //                     <span className="text-sm font-medium truncate max-w-[200px]">
  //                         {file.name}
  //                     </span>
  //                     <span className="text-xs text-gray-500">
  //                         {(file.size / (1024 * 1024)).toFixed(2)} MB
  //                     </span>
  //                 </div>
  //             </div>
  //         );
  //     };

  //     // Add file preview to chat
  //     addMessage(
  //         "user",
  //         getFileDisplay(selectedFile)
  //     );

  //     // Update form data
  //     setFormData((prev) => ({
  //         ...prev,
  //         [currentField.name]: selectedFile.name,
  //     }));

  //     // Reset states
      
  //     setSelectedFile(null);
      
  //     setInput("");

  //     // Handle next step
  //     const nextStep = findNextActiveField(currentStep);
  //     setCurrentStep(nextStep);

  //     if (nextStep !== -1) {
  //         const nextField = formFields[nextStep];
  //         addMessage(
  //             "assistant",
  //             <div>
  //                 <span className="label">{nextField.label}</span>
  //                 {nextField.required && <span className="text-red-500">*</span>}
  //                 <br />
  //                 <span className="text-sm text-gray-400">{nextField.description}</span>
  //             </div>
  //         );
  //     } else {
  //         addMessage("assistant", "Thank you for completing the form.");
  //     }
  //     return;
  // }


  if (videos.length > 0) {
    const videoToDisplay = videos[0]; // Display the first video in the state

    addMessage(
        "user",
        <div className="flex md:h-64 w-full items-center">
            {displayVideo(videoToDisplay)}
        </div>
    );

    // Update form data
    setFormData((prev) => ({
        ...prev,
        [currentField.name]: videoToDisplay,
    }));

    // Reset states
    setVideos((prev) => prev.slice(1)); // Remove the displayed video from state
    setInput("");

    // Handle next step
    const nextStep = findNextActiveField(currentStep);
    setCurrentStep(nextStep);

    if (nextStep !== -1) {
        const nextField = formFields[nextStep];
        addMessage(
            "assistant",
            <div>
                <span className="label">{nextField.label}</span>
                {nextField.required && <span className="text-red-500">*</span>}
                <br />
                <span className="text-sm text-gray-400">{nextField.description}</span>
            </div>
        );
    } else {
        addMessage("assistant", "Thank you for completing the form.");
    }
  }


  const error = !["Video Upload", "File Upload", "Image Upload", "PDF Upload"].includes(currentField.variant) && validateInput(currentField, input);


    if (error) {
      // Show validation error
      setValidationError(error);
      return;
    }

    // Clear any previous validation errors
    setValidationError(null);

    if (input) {
      // Add user's message
      addMessage("user", input || "Submitted");

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [currentField.name]: input,
      }));

      setInput("");

      // Find the next active field
      const nextStep = findNextActiveField(currentStep);
      setCurrentStep(nextStep);

      if (nextStep !== -1) {
        const nextField = formFields[nextStep];
        
        // Add next field's prompt
        addMessage(
          "assistant",
          <div>
            <br/>
            <span className="label">{nextField.label}</span> 
            {nextField.required && <span className="text-red-500">*</span>}
            <br/>
            <span className="text-sm text-gray-400">{nextField.description}</span>
          </div>
        );
      } else {
        // Form completed
        addMessage(
          "assistant",
          "Thank you for completing the form. Here's a summary of your inputs:"
        );
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-lg">
      <CardContent className="space-y-4 overflow-x-hidden max-h-[60vh] overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } items-end  animate-move-up`}
          >
            {message.role === "assistant" && (
              <Avatar>
                <Bot className="h-5 w-5 text-primary" />
              </Avatar>
            )}
            <div
              className={`relative py-4  max-w-[80%] rounded-[10px] ${
                message.role === "user"
                  ? "border-primary border  text-primary px-[8px]  rounded-br-none shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
                  : " w-[80%] rounded-[5px]"
              } transition-all duration-300 ease-in-out`}
            >
              {message.content}
            </div>
            {message.role === "user" && (
              <Avatar className="ml-2 mr-[-20px] md:mr-0">
                <User className="h-5 w-5 text-primary" />
              </Avatar>
            )}
          </div>
        ))}
      </CardContent>

      {currentStep !== -1 && (
        <CardFooter className="bg-background px-4 py-3">
          <div className="flex flex-col w-full">
            <div className="flex items-center space-x-2 w-full">
              <div className="flex-grow">
                <RenderInputField
                  currentField={formFields[currentStep]}
                  input={input}
                  setInput={(value) => {
                    setInput(value);
                    setValidationError(null); // Clear error when user starts typing
                  }}
                  formData={formData}
                  setFormData={setFormData}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  setSelectedFile={setSelectedFile}
                  apiFieldData={apiFieldData}
                  videos={videos}
                  setVideos={setVideos}
                  videoError={videoError}
                  setVideoError={setVideoError}
                  selectedFile={selectedFile}
                  imageError={imageError}
                  setImageError={setImageError}
                  fileError={fileError}
                  setFileError={setFileError}
                  setFileName={setFileName}
                  fileName={fileName}
                  selectedPdf={selectedPdf}
                  setSelectedPdf={setSelectedPdf}
                  pdfError={pdfError}
                  pdfName={pdfName}
                  setPdfName={setPdfName}
                  setPdfError={setPdfError}

                />
                {validationError && (
                  <p className="text-red-500 text-sm mt-1">{validationError}</p>
                )}
              </div>
              {!(formFields[currentStep]?.variant === "File Upload" || 
                formFields[currentStep]?.variant === "Image Upload" || 
                formFields[currentStep]?.variant === "PDF Upload" || 
                formFields[currentStep]?.variant === "Video Upload") &&
              <Button
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 transition-colors self-end"
              >
                <FaArrowUp className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
               }
            </div>
            {(formFields[currentStep]?.variant === "File Upload" || 
              formFields[currentStep]?.variant === "Image Upload" || 
              formFields[currentStep]?.variant === "PDF Upload" || 
              formFields[currentStep]?.variant === "Video Upload") &&
            <Button
                onClick={handleSubmit}
                className="bg-primary mt-2 hover:bg-primary/90 transition-colors self-end"
              >
                <FaArrowUp className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
}
          </div>
        </CardFooter>
      )}
      <div ref={messagesEndRef} />
    </Card>
  );
}


export default function ChatPreview({ formFields }: any) {
  return <ChatForm formFields={formFields} />;
}