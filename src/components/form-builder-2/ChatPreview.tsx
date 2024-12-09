"use client"
import * as React from "react"
import { Bot, Send, User } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import RenderInputField from "./render-chat-field"
import { FaArrowUp } from "react-icons/fa6";

type Message = {
  id: string
  role: "user" | "assistant"
  content: React.ReactNode
  componentType?: string
}

export function ChatForm({ formFields }: any) {
  const [messages, setMessages] = React.useState<Message[]>([
    { 
      id: uuidv4(), 
      role: "assistant", 
      content: "Welcome! Let's go through the form together. We'll start with the first question:" 
    },
  ]);
  
  const [input, setInput] = React.useState<any>()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState<Record<string, any>>({})
  const [selectedImage, setSelectedImage] = React.useState(null)
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
    // Add first field's question
    if (formFields.length > 0) {
      const firstField = formFields[0];
      addMessage("assistant",
        <div className="flex flex-col"> 
        <span>{firstField.label}</span>
        <span className="text-sm text-gray-400">{firstField.description}</span>
        </div>);
      // Add the first field's input component
      // addMessage(
      //   "assistant",
      //   <RenderInputField
      //     currentField={firstField}
      //     input={input}
      //     setInput={setInput}
      //     formData={formData}
      //     setFormData={setFormData}
      //     setSelectedImage={setSelectedImage}
      //     onSubmit={handleSubmit}
          
      //   />,
      //   firstField.type
      // );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("formData------", formData);
  console.log("inputValue------", input);

  const handleSubmit = () => {
    console.log("rendered--")

    const currentField = formFields[currentStep];

    if (input) {
      // Add user's message
      addMessage("user", input || "Submitted");

      setInput("");
      // Update form data
      setFormData((prev) => ({
        ...prev,
        [currentField.name]: input,
      }));

      // Reset input and image

      // Move to next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      if (nextStep < formFields.length) {
        const firstField = formFields[nextStep];
        setInput("")
        // Add next field's prompt
        addMessage(
          "assistant",
         <div>
           <span>Great! Now, let's move on to the next question.</span>
           <br/>
           <span className="label">{formFields[nextStep].label}</span>
           <br/>
           <span className="text-sm text-gray-400">{formFields[nextStep].description}</span>
         </div>
         
          
        );
        setInput("")
        // Add the next field's input component
        // addMessage(
        //   "assistant",
        //   <RenderInputField
        //     currentField={firstField}
        //     input={input}
        //     setInput={setInput}
        //     formData={formData}
        //     setFormData={setFormData}
        //     setSelectedImage={setSelectedImage}
        //     onSubmit={handleSubmit}
           
        //   />,
        //   firstField.type
        // );
      } else {
        // Form completed
        addMessage(
          "assistant",
          "Thank you for completing the form. Here's a summary of your inputs:"
        );
        // setTimeout(() =>
        // addMessage("assistant", (
        //   <div className="bg-gray-100 flex w-[400px] flex-wrap p-2 rounded">
        //     {JSON.stringify(formData)}
        //   </div>
        // )),100)
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
                <Bot className="h-5 w-5" />
              </Avatar>
            )}
            <div
              className={`relative py-4  max-w-[80%] rounded-[20px] ${
                message.role === "user"
                  ? "bg-[#000000] px-4 text-white rounded-br-none shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
                  : " w-[80%] rounded-[5px]"
              } transition-all duration-300 ease-in-out`}
            >
              {message.content}
            </div>
            {message.role === "user" && (
              <Avatar className="ml-4">
                <User className="h-5 w-5" />
              </Avatar>
            )}
          </div>
        ))}
      </CardContent>

      {currentStep < formFields.length && (
        <CardFooter className="bg-background px-4 py-3">
          <div  className="flex items-center space-x-2 w-full">
          <RenderInputField
          currentField={formFields[currentStep]}
          input={input}
          setInput={setInput}
          formData={formData}
          setFormData={setFormData}
          setSelectedImage={setSelectedImage}
 
          
        />
            <Button
              onClick={handleSubmit}
              className="bg-primary  hover:bg-primary/90 transition-colors"
            >
              <FaArrowUp className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      )}
        <div ref={messagesEndRef} />
    </Card>
  );
}