"use client"

import * as React from "react"
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TimePickerDropdown } from "./TimePickerDropdown"

interface SimpleDateTimeDisplayProps {
  onDateTimeSelect: (dateTime: string) => void;
  form: any;
  field: any
}

export function SimpleDateTimeDisplay({onDateTimeSelect,form,field}: SimpleDateTimeDisplayProps) {
  const [date, setDate] = React.useState<Date>(new Date())
  const [hour, setHour] = React.useState("09")
  const [minute, setMinute] = React.useState("00")
  const [period, setPeriod] = React.useState("AM")

  React.useEffect(() => {
    const formattedDateTime = `${format(date, "MMMM do, yyyy")} at ${hour}:${minute} ${period}`
    onDateTimeSelect(formattedDateTime)
    if (form && field) {
      form.setValue(field.name, formattedDateTime, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [date, hour, minute, period])

  const handleTimeChange = (newHour: string, newMinute: string, newPeriod: string) => {
    setHour(newHour)
    setMinute(newMinute)
    setPeriod(newPeriod)
  }

  return (
    <div>
      <div className="flex gap-1">
        {/* Date Display */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "flex-1 justify-start text-left font-normal bg-white hover:bg-gray-50",
                "px-3 py-5 text-base"
              )}
            >
              <CalendarIcon className="mr-3 h-5 w-5" />
              {format(date, "MMMM do, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {newDate && setDate(newDate)}}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Time Display */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-white hover:bg-gray-50",
                "px-3 py-5 text-base min-w-[160px]"
              )}
            >
              {`${hour}:${minute} ${period}`}
              <Clock className="ml-3 h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <TimePickerDropdown
              selectedHour={hour}
              selectedMinute={minute}
              selectedPeriod={period}
              onTimeChange={handleTimeChange}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

