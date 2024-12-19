/* eslint-disable @next/next/no-img-element */
"use client";
import * as React from "react";
import { Bot, Dock, File, Table, User } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FaArrowUp } from "react-icons/fa6";
import RenderInputField from "./render-chat-field";
import Image from "next/image";
import { FaFilePdf, FaRegFilePdf } from "react-icons/fa";
import SendMediaCard from "./field-components/SendMediaCard";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: React.ReactNode;
  componentType?: string;
};

export function ChatForm({ formFields, apiFieldData }: any) {
  const [messages, setMessages] = React.useState<Message[]>([
    // {
    //   id: uuidv4(),
    //   role: "assistant",
    //   // content: "Welcome! Let's go through the form together. We'll start with the first question:"
    // },
  ]);

  const [input, setInput] = React.useState<any>();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [selectedImage, setSelectedImage] = React.useState<string[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<string[]>([]);
  const [selectedPdf, setSelectedPdf] = React.useState<string[]>([]);
  const [fileName, setFileName] = React.useState("");
  const [pdfName, setPdfName] = React.useState("");
  const [videos, setVideos] = React.useState<string[]>([]);
  const [videoError, setVideoError] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [pdfError, setPdfError] = React.useState<string | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(
    null
  );
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const addMessage = React.useCallback(
    (
      role: "user" | "assistant",
      content: React.ReactNode,
      componentType?: string
    ) => {
      setMessages((prev) => [
        ...prev,
        { id: uuidv4(), role, content, componentType },
      ]);
      setTimeout(scrollToBottom, 50);
    },
    []
  );

  // Find the first non-disabled field
  const findFirstActiveField = () => {
    return formFields.findIndex((field: { disabled: any }) => !field.disabled);
  };

  React.useEffect(() => {
    // Find the first non-disabled field
    const firstActiveFieldIndex = findFirstActiveField();

    if (firstActiveFieldIndex !== -1) {
      const firstField = formFields[firstActiveFieldIndex];
      addMessage(
        "assistant",
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <span>{firstField.label}</span>{" "}
            {firstField.required && <span className="text-red-500">*</span>}
          </div>
          <span className="text-sm text-gray-400">
            {firstField.description}
          </span>
        </div>
      );

      // Update current step to the first active field
      setCurrentStep(firstActiveFieldIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFileIcon = (fileName: any) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "doc":
      case "docx":
        return <Dock className="w-8 h-8 text-blue-500" />;
      case "xls":
      case "xlsx":
      case "csv":
        return <Table className="w-8 h-8 text-green-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const displayVideo = (videoUrl: string) => {
    if (/(youtube\.com|youtu\.be)/.test(videoUrl)) {
      return (
        <div className="md:h-64 md:w-[80vw] w-full relative">
          <iframe
            src={videoUrl.replace("watch?v=", "embed/")}
            title="video-preview"
            className="md:h-64 w-full rounded-lg border block"
            style={{ display: "block" }}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      );
    } else {
      return (
        <video src={videoUrl} controls className="md:h-64  rounded-lg border" />
      );
    }
  };

  const displayImage = (imageUrl: string) => {
    return (
      <img
        alt="Uploaded Image"
        src={selectedImage[0]}
        className="md:h-64 w-full rounded-lg border"
      />
    );
  };

  const displaySendImage = (imageUrl: any) => {
    return (
      <img
        alt="Uploaded Image"
        src={imageUrl}
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

  const displaySendFile = (fileName: any) => {
    return (
      <div className="flex flex-col md:w-[80vw] flex-wrap items-center p-4 gap-2.5 rounded-lg">
        {getFileIcon(fileName?.placeholder_file_upload_url)}
        <span
          className="text-sm flex-wrap text-wrap w-[175px]  md:w-1/2 truncate overflow-hidden text-ellipsis"
          title={fileName?.placeholder_file_upload_url?.split("/").at(-1)} // Tooltip for full file name
        >
          {fileName?.placeholder_file_upload_url?.split("/").at(-1)}
        </span>
        <div className="flex w-full justify-center">
          <Button
            className="m-2 flex  flex-end items-end self-end"
            onClick={(e) => {
              e.preventDefault();
              const link: any = document.createElement("a");
              link.href = fileName?.placeholder_file_upload_url;
              link.download =
                fileName?.placeholder_file_upload_url?.split("/").at(-1) ||
                "file";
              link.click();
            }}
          >
            Download
          </Button>
        </div>
      </div>
    );
  };

  const displaySendPdf = (fileName: any) => {
    return (
      <div className="flex flex-col md:w-[80vw] text-center flex-wrap items-center p-4 gap-2.5 rounded-lg">
        <FaFilePdf className="text-red-500 h-5 w-5" />
        <span
          className="text-sm flex-wrap w-[175px] text-w text-center   md:w-1/2 truncate overflow-hidden text-ellipsis"
          title={fileName?.split("/").at(-1)} // Tooltip for full file name
        >
          {fileName?.split("/").at(-1)}
        </span>
        <div className="flex w-full justify-center">
          <Button
            className="m-2 flex  flex-end items-end self-end"
            onClick={(e) => {
              e.preventDefault();
              if (fileName) {
                window.open(fileName, "_blank"); // Open the file in a new tab
              }
            }}
          >
            Download
          </Button>
        </div>
      </div>
    );
  };

  const displayPdf = (imageUrl: string) => {
    return (
      <div className="flex flex-col flex-wrap items-center p-4 gap-2.5 rounded-lg">
        <FaRegFilePdf className="h-5 w-5 text-red-500" />
        <span className="text-sm flex flex-wrap md:text-md">{pdfName}</span>
      </div>
    );
  };

  // Validation function
  const validateInput = (currentField: any, value: any): string | null => {
    // Check if field is required
    if (currentField.required && (!value || value.trim() === "")) {
      return `${currentField.label} is required`;
    }

    // Specific validations based on field variant
    switch (currentField.variant) {
      case "Email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return "Invalid email address";
        }
        break;

      case "Mobile":
        const phoneRegex = /^[0-9]{10}$/;
        if (value && !phoneRegex.test(value)) {
          return "Invalid mobile number (10 digits required)";
        }
        break;

      case "Number":
        if (value && isNaN(Number(value))) {
          return "Please enter a valid number";
        }
        break;

      // case 'Password':
      //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      //   if (value && !passwordRegex.test(value)) {
      //     return 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
      //   }
      //   break;

      case "OTP":
        const otpRegex = /^[0-9]{6}$/;
        if (value && !otpRegex.test(value)) {
          return "OTP must be a 6-digit number";
        }
        break;
    }

    return null;
  };

  const findNextActiveField = (currentIndex: number) => {
    for (let i = currentIndex + 1; i < formFields.length; i++) {
      if (!formFields[i].disabled) {
        return i;
      }
    }
    return -1; // No more active fields
  };

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
      setSelectedImage((prev) => prev.slice(1));
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
            <span className="text-sm text-gray-400">
              {nextField.description}
            </span>
          </div>
        );
      } else {
        addMessage("assistant", "Thank you for completing the form.");
      }
    }

    if (currentField?.variant === "Send Image") {
      const imageToDisplay = currentField?.placeholder_file_url; // Display the first video in the state

      addMessage(
        "user",
        <div className="flex md:h-64 w-full items-center">
          {displaySendImage(imageToDisplay)}
        </div>
      );

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [currentField.name]: imageToDisplay,
      }));
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
            <span className="text-sm text-gray-400">
              {nextField.description}
            </span>
          </div>
        );
      } else {
        addMessage("assistant", "Thank you for completing the form.");
      }
    }

    if (currentField?.variant === "Send Video") {
      const videoToDisplay = currentField?.placeholder_video_url; // Display the first video in the state

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
            <span className="text-sm text-gray-400">
              {nextField.description}
            </span>
          </div>
        );
      } else {
        addMessage("assistant", "Thank you for completing the form.");
      }
    }

    if (currentField?.variant === "Send File") {
      const fileToDisplay = currentField; // Display the first video in the state

      addMessage(
        "user",
        <div className="flex md:h-64 w-[250px] md:w-full items-center">
          {displaySendFile(fileToDisplay)}
        </div>
      );

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [currentField.name]: fileToDisplay,
      }));
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
            <span className="text-sm text-gray-400">
              {nextField.description}
            </span>
          </div>
        );
      } else {
        addMessage("assistant", "Thank you for completing the form.");
      }
    }

    if (currentField?.variant === "Send Pdf") {
      const fileToDisplay = currentField?.placeholder_pdf_file_url; // Display the first video in the state

      addMessage(
        "user",
        <div className="flex md:h-64 w-full items-center">
          {displaySendPdf(fileToDisplay)}
        </div>
      );

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [currentField.name]: fileToDisplay,
      }));
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
            <span className="text-sm text-gray-400">
              {nextField.description}
            </span>
          </div>
        );
      } else {
        addMessage("assistant", "Thank you for completing the form.");
      }
    }

    if (currentField?.variant === "Send Media Card") {
      addMessage(
        "user",
        <div className="flex w-full items-center">
          <SendMediaCard field={currentField} />
        </div>
      );

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [currentField.name]: currentField,
      }));
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
            <span className="text-sm text-gray-400">
              {nextField.description}
            </span>
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
      setSelectedFile((prev) => prev.slice(1));
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
            <span className="text-sm text-gray-400">
              {nextField.description}
            </span>
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
      setSelectedPdf((prev) => prev.slice(1));
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
            <span className="text-sm text-gray-400">
              {nextField.description}
            </span>
          </div>
        );
      } else {
        addMessage("assistant", "Thank you for completing the form.");
      }
    }

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
            <span className="text-sm text-gray-400">
              {nextField.description}
            </span>
          </div>
        );
      } else {
        addMessage("assistant", "Thank you for completing the form.");
      }
    }

    const error =
      ![
        "Video Upload",
        "File Upload",
        "Image Upload",
        "PDF Upload",
        "Send Image",
        "Send Video",
        "Send File",
        "Send Pdf",
        "Send Media Card",
      ].includes(currentField.variant) && validateInput(currentField, input);

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
            <br />
            <span className="label">{nextField.label}</span>
            {nextField.required && <span className="text-red-500">*</span>}
            <br />
            <span className="text-sm text-gray-400">
              {nextField.description}
            </span>
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

  const isUploadOrSpecialVariant = (variant: string | undefined): boolean => {
    const uploadVariants = [
      "File Upload",
      "Image Upload",
      "PDF Upload",
      "Send Image",
      "Send Video",
      "Send File",
      "Send Pdf",
      "From Date to To Date",
      "Send Media Card",
      "Video Upload",
    ];
    return uploadVariants.includes(variant || "");
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
              className={`relative py-[8px]  max-w-[90%] rounded-[10px] ${
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
              {!isUploadOrSpecialVariant(formFields[currentStep]?.variant) && (
                <Button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 transition-colors self-end"
                >
                  <FaArrowUp className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              )}
            </div>
            {isUploadOrSpecialVariant(formFields[currentStep]?.variant) && (
              <Button
                onClick={handleSubmit}
                className="bg-primary mt-2 hover:bg-primary/90 transition-colors self-end"
              >
                <FaArrowUp className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            )}
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
