'use client';

import React, { useState } from "react";
import { Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import renderInputField from "./render-chat-field";

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
}

export function ChatForm({ formFields }: any) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", type: "bot", content: "Hi! I'm here to help you. Let's get started with your information." },
    { id: "2", type: "bot", content: `What's your value ${formFields[0].label}?` },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState<any>();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)

  console.log("formData------",formData)
  console.log("inputValue------",inputValue)

  const currentField = formFields[currentStep];

  const handleUserInput = (input: any) => {
    const updatedMessages: Message[] = [
      ...messages,
      { id: `${Date.now()}`, type: "user", content: input },
    //   { id: `${Date.now() + 1}`, type: "bot", content: `Got it, thanks for the ${currentField.label}.` },
    ];

    setMessages(updatedMessages);
    setFormData((prev) => ({ ...prev, [currentField.name]: input }));
    setInputValue("");
    setCurrentStep((prev) => prev + 1);

    if (formFields[currentStep + 1]) {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now() + 2}`, type: "bot", content: `What's your value for ${formFields[currentStep + 1].label}?` },
      ]);
    } else {
      // All fields are completed
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now() + 2}`, type: "bot", content: "Thank you! Here's the information you provided:" },
       
        // { id: `${Date.now() + 3}`, type: "bot", content: JSON.stringify(formData, null, 2) },
      ]);
    }
  };

  

  return (
    <Card className="h-[600px] bg-[#0f1117] w-full hover:bg-[#0f1117] text-white overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold">Chat Preview</h2>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex items-start max-w-[80%] space-x-2">
              {message.type === "bot" && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`rounded-lg p-3 ${
                  message.type === "user" ? "bg-blue-600" : "bg-[#1a1d27]"
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      {currentField && (
        <div className="p-4 border-t border-gray-800">
          {/* <div className="mb-2 text-gray-300">{currentField.description}</div> */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserInput(inputValue || "No input");
            }}
            className=" flex gap-2 items-center"
          >
            {renderInputField({currentField, inputValue, setInputValue,formData, setFormData, setSelectedImage})}
            <Button type="submit" className=" bg-blue-600 hover:bg-blue-700">
              Next
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
}