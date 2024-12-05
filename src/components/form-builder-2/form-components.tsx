import * as React from "react"
import { Calendar, Clock, Upload, Star, Share2, MapPin, Hash } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const componentClasses = "rounded-[3px] border-2 border-gray-300 focus:border-blue-500"

export const formComponents: {
  type: string;
  label: string;
  render: (setInput: React.Dispatch<React.SetStateAction<string>>, field?: { label: string; placeholder?: string; options?: string[] }) => React.ReactNode;
}[] = [
  {
    type: "text",
    label: "Text Input",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label htmlFor="name">{field?.label || "Text Input"}</Label>
        <Input 
          id="name" 
          placeholder={field?.placeholder || "Enter text"} 
          onChange={(e) => setInput(e.target.value)}
          className={componentClasses}
        />
      </div>
    ),
  },
  {
    type: "textarea",
    label: "Textarea",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label htmlFor="message">{field?.label || "Textarea"}</Label>
        <Textarea 
          id="message" 
          placeholder={field?.placeholder || "Enter your message"} 
          onChange={(e) => setInput(e.target.value)}
          className={componentClasses}
        />
      </div>
    ),
  },
  {
    type: "select",
    label: "Dropdown (Select)",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Dropdown (Select)"}</Label>
        <Select onValueChange={(value) => setInput(value)}>
          <SelectTrigger className={`${componentClasses} bg-background`}>
            <SelectValue placeholder={field?.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {(field?.options || ["Option 1", "Option 2", "Option 3"]).map((option, index) => (
              <SelectItem key={index} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
  },
  {
    type: "radio",
    label: "Radio Buttons",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Radio Buttons"}</Label>
        <RadioGroup onValueChange={(value) => setInput(value)}>
          {(field?.options || ["Option 1", "Option 2"]).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option${index + 1}`} />
              <Label htmlFor={`option${index + 1}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    ),
  },
  {
    type: "checkbox",
    label: "Checkboxes",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Checkboxes"}</Label>
        <div className="space-y-2">
          {(field?.options || ["Accept terms and conditions", "Receive marketing emails"]).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox id={`checkbox${index + 1}`} onCheckedChange={(checked) => setInput(checked ? option : "")} />
              <label htmlFor={`checkbox${index + 1}`}>{option}</label>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    type: "datepicker",
    label: "Date Picker",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Date Picker"}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={componentClasses}>
              <Calendar className="mr-2 h-4 w-4" />
              {field?.placeholder || "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={new Date()}
              onSelect={(date) => setInput(date ? date.toISOString() : "")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    ),
  },
  {
    type: "timepicker",
    label: "Time Picker",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Time Picker"}</Label>
        <div className="flex items-center space-x-2">
          <Input 
            type="time" 
            onChange={(e) => setInput(e.target.value)}
            className={componentClasses}
          />
          <Clock className="h-4 w-4" />
        </div>
      </div>
    ),
  },
  {
    type: "rangeslider",
    label: "Range Slider",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Range Slider"}</Label>
        <Slider defaultValue={[50]} max={100} step={1} onValueChange={(value) => setInput(value[0].toString())} />
      </div>
    ),
  },
  {
    type: "switch",
    label: "Toggle Switch",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Toggle Switch"}</Label>
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" onCheckedChange={(checked) => setInput(checked ? "on" : "off")} />
          <Label htmlFor="airplane-mode">{field?.placeholder || "Airplane Mode"}</Label>
        </div>
      </div>
    ),
  },
  {
    type: "fileupload",
    label: "File Upload",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "File Upload"}</Label>
        <div className="flex items-center space-x-2">
          <Input 
            id="picture" 
            type="file" 
            onChange={(e) => setInput(e.target.files?.[0]?.name || "")}
            className={componentClasses}
          />
          <Button size="sm" className={componentClasses}>
            <Upload className="mr-2 h-4 w-4" />
            {field?.placeholder || "Upload"}
          </Button>
        </div>
      </div>
    ),
  },
  {
    type: "mediacard",
    label: "File Preview Media Card",
    render: (setInput, field) => (
      <Card>
        <CardHeader>
          <CardTitle>{field?.label || "File Preview Media Card"}</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src="/placeholder.svg?height=100&width=200"
            alt="Preview"
            className="rounded-lg object-cover"
          />
        </CardContent>
      </Card>
    ),
  },
  {
    type: "datacard",
    label: "Data Card",
    render: (setInput, field) => (
      <Card>
        <CardHeader>
          <CardTitle>{field?.label || "Data Card"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a sample data card with some information.</p>
        </CardContent>
      </Card>
    ),
  },
  {
    type: "carousel",
    label: "Carousel",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Carousel"}</Label>
        <div className="flex space-x-2 overflow-x-auto p-2">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="w-64 flex-shrink-0">
              <CardContent className="p-4">
                <img
                  src={`/placeholder.svg?height=100&width=200&text=Slide ${item}`}
                  alt={`Slide ${item}`}
                  className="rounded-lg object-cover"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  {
    type: "videoplayer",
    label: "Video Player",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Video Player"}</Label>
        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    ),
  },
  {
    type: "imageviewer",
    label: "Image Viewer",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Image Viewer"}</Label>
        <img
          src="/placeholder.svg?height=200&width=300&text=Sample Image"
          alt="Sample"
          className="rounded-lg object-cover"
        />
      </div>
    ),
  },
  {
    type: "buttons",
    label: "Buttons",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Buttons"}</Label>
        <div className="flex space-x-2">
          <Button variant="default" onClick={() => setInput("Default clicked")}>Default</Button>
          <Button variant="secondary" onClick={() => setInput("Secondary clicked")}>Secondary</Button>
          <Button variant="outline" onClick={() => setInput("Outline clicked")}>Outline</Button>
        </div>
      </div>
    ),
  },
  {
    type: "iconbuttons",
    label: "Icon Buttons",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Icon Buttons"}</Label>
        <div className="flex space-x-2">
          <Button size="icon" variant="outline" onClick={() => setInput("Calendar clicked")}>
            <Calendar className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => setInput("Share clicked")}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => setInput("Location clicked")}>
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ),
  },
  {
    type: "actionmenu",
    label: "Action Menu",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Action Menu"}</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{field?.placeholder || "Open Menu"}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(field?.options || ["Profile", "Settings", "Logout"]).map((option, index) => (
              <DropdownMenuItem key={index} onSelect={() => setInput(`${option} selected`)}>{option}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
  {
    type: "progressindicator",
    label: "Progress Indicator",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Progress Indicator"}</Label>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
        </div>
      </div>
    ),
  },
  {
    type: "stepper",
    label: "Stepper/Progress Tracker",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Stepper/Progress Tracker"}</Label>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">1</div>
          <div className="flex-1 h-1 bg-gray-200"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">2</div>
          <div className="flex-1 h-1 bg-gray-200"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">3</div>
        </div>
      </div>
    ),
  },
  {
    type: "rating",
    label: "Rating Component",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Rating Component"}</Label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className="w-5 h-5 text-yellow-400 cursor-pointer" 
              onClick={() => setInput(star.toString())}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    type: "shareableicons",
    label: "Shareable Icons",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Shareable Icons"}</Label>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => setInput("Share clicked")}>
            <Share2 className="mr-2 h-4 w-4" />
            {field?.placeholder || "Share"}
          </Button>
        </div>
      </div>
    ),
  },
  {
    type: "tooltip",
    label: "Tooltip",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Tooltip"}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={() => setInput("Tooltip button clicked")}>{field?.placeholder || "Hover me"}</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a tooltip</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
  {
    type: "richtexteditor",
    label: "Rich Text Editor",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Rich Text Editor"}</Label>
        <Card>
          <CardContent className="p-2">
            <div className="flex space-x-1 mb-2">
              <Button size="sm" variant="outline">B</Button>
              <Button size="sm" variant="outline">I</Button>
              <Button size="sm" variant="outline">U</Button>
            </div>
            <Textarea 
              placeholder={field?.placeholder || "Enter rich text here"} 
              rows={4} 
              onChange={(e) => setInput(e.target.value)}
              className={componentClasses}
            />
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    type: "signaturepad",
    label: "Signature Pad",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Signature Pad"}</Label>
        <Card>
          <CardContent className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            {field?.placeholder || "Sign here"}
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    type: "captcha",
    label: "Captcha",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Captcha"}</Label>
        <Card>
          <CardContent className="p-4 flex items-center space-x-2">
            <div className="bg-gray-100 p-2 rounded-lg">
              <img src="/placeholder.svg?height=50&width=150&text=CAPTCHA" alt="CAPTCHA" className="w-full" />
            </div>
            <Input 
              placeholder={field?.placeholder || "Enter CAPTCHA"} 
              className={`flex-1 ${componentClasses}`}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    type: "geolocation",
    label: "Geolocation Picker",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Geolocation Picker"}</Label>
        <div className="flex items-center space-x-2">
          <Input 
            placeholder={field?.placeholder || "Enter location"} 
            className={componentClasses}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button size="icon" variant="outline" onClick={() => setInput("Geolocation requested")}>
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ),
  },
  {
    type: "tagselector",
    label: "Tag Selector",
    render: (setInput, field) => (
      <div className="space-y-2">
        <Label>{field?.label || "Tag Selector"}</Label>
        <div className="flex flex-wrap gap-2">
          {(field?.options || ["React", "Next.js", "TypeScript"]).map((tag) => (
            <Button 
              key={tag} 
              size="sm" 
              variant="outline"
              onClick={() => setInput(tag)}
            >
              <Hash className="mr-2 h-4 w-4" />
              {tag}
            </Button>
          ))}
        </div>
      </div>
    ),
  },
]

