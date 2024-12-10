"use client"
import * as React from "react"
import { Bot, User } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { FaArrowUp } from "react-icons/fa6";
import RenderInputField from "./render-chat-field"

type Message = {
  id: string
  role: "user" | "assistant"
  content: React.ReactNode
  componentType?: string
}

export function ChatForm({ formFields }: any) {
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
  const [selectedImage, setSelectedImage] = React.useState(null)
  const [validationError, setValidationError] = React.useState<string | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

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

  React.useEffect(() => {
    if (formFields.length > 0) {
      const firstField = formFields[0];
      addMessage("assistant",
        <div className="flex flex-col"> 
        <div className="flex gap-2 items-center">
        <span>{firstField.label}</span> {firstField.required && <span className="text-red-500">*</span>}
        </div>
        <span className="text-sm text-gray-400">{firstField.description}</span>
        </div>);
    }
  }, []);

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

  const handleSubmit = () => {
    const currentField = formFields[currentStep];

    // Validate input
    const error = validateInput(currentField, input);

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

      // Move to next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      if (nextStep < formFields.length) {
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
        
        // Optional: Add a summary of form data
        // addMessage(
        //   "assistant", 
        //   <div className="bg-gray-100 p-4 rounded">
        //     {Object.entries(formData).map(([key, value]) => (
        //       <div key={key} className="mb-2">
        //         <strong>{key}:</strong> {value}
        //       </div>
        //     ))}
        //   </div>
        // );
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-lg">
      <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto p-4">
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
              className={`relative py-4  max-w-[80%] rounded-[20px] ${
                message.role === "user"
                  ? "border-primary border text-primary px-4  rounded-br-none shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
                  : " w-[80%] rounded-[5px]"
              } transition-all duration-300 ease-in-out`}
            >
              {message.content}
            </div>
            {message.role === "user" && (
              <Avatar className="ml-4">
                <User className="h-5 w-5 text-primary" />
              </Avatar>
            )}
          </div>
        ))}
      </CardContent>

      {currentStep < formFields.length && (
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
                  setSelectedImage={setSelectedImage}
                />
                {validationError && (
                  <p className="text-red-500 text-sm mt-1">{validationError}</p>
                )}
              </div>
              <Button
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 transition-colors"
              >
                <FaArrowUp className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
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