"use client"
import * as React from "react"
import { Bot, Send, User } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import RenderInputField from "./render-chat-field"

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
  
  const [input, setInput] = React.useState("")
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState<Record<string, any>>({})
  const [selectedImage, setSelectedImage] = React.useState(null)

  const addMessage = React.useCallback((role: "user" | "assistant", content: React.ReactNode, componentType?: string) => {
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), role, content, componentType },
    ])
  }, [])

  React.useEffect(() => {
    // Add first field's question
    if (formFields.length > 0) {
      const firstField = formFields[0];
      addMessage("assistant", `${firstField.variant}`);
      // Add the first field's input component
      addMessage("assistant", (
        <RenderInputField
          currentField={firstField}
          input={input}
          setInput={setInput}
          formData={formData}
          setFormData={setFormData}
          setSelectedImage={setSelectedImage}
          
        />
      ), firstField.type);
  
    }
  }, []);

  console.log("formData------",formData)
  console.log("inputValue------",input)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const currentField = formFields[currentStep];

    if (input.trim()) {
      // Add user's message
      addMessage("user", input.trim() || "Submitted");
      
      setInput("");
      // Update form data
      setFormData((prev) => ({ 
        ...prev, 
        [currentField.name]:   input 
      }));

      // Reset input and image

      // Move to next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      if (nextStep < formFields.length) {
        const firstField = formFields[nextStep];
        // Add next field's prompt
        addMessage("assistant", `Great! Now, let's move on to the next question. ${formFields[nextStep].label}`);
        // Add the next field's input component
        addMessage("assistant", (
          <RenderInputField
            currentField={firstField}
            input={input}
            setInput={setInput}
            formData={formData}
            setFormData={setFormData}
            setSelectedImage={setSelectedImage}
            
          />
        ), firstField.type);
      } else {
        // Form completed
        addMessage("assistant", "Thank you for completing the form. Here's a summary of your inputs:")
        setTimeout(() => 
        addMessage("assistant", (
          <div className="bg-gray-100 flex w-[400px] flex-wrap p-2 rounded">
            {JSON.stringify(formData)}
          </div>
        )),100)

      }
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-lg">
      <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } items-end space-x-2 animate-move-up`}
          >
            <Avatar>
              {message.role === "assistant" ? (
                <Bot className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Avatar>
            <div
              className={`relative p-4 max-w-[80%] rounded-[20px] ${
                message.role === "user"
                  ? "bg-[#000000] text-white rounded-br-none shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
                  : "bg-background rounded-[5px]"
              } transition-all duration-300 ease-in-out`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </CardContent>
      
      {currentStep < formFields.length && (
        <CardFooter className="bg-background px-4 py-3">
          <form onSubmit={handleSubmit} className="flex space-x-2 w-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={formFields[currentStep].placeholder}
              className="flex-1"
            />
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90 transition-colors">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      )}
    </Card>
  )
}