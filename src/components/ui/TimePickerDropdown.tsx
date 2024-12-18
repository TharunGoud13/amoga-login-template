"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TimePickerDropdownProps {
  selectedHour: string
  selectedMinute: string
  selectedPeriod: string
  onTimeChange: (hour: string, minute: string, period: string) => void
}

export function TimePickerDropdown({
  selectedHour,
  selectedMinute,
  selectedPeriod,
  onTimeChange
}: TimePickerDropdownProps) {
  const hours = Array.from({ length: 12 }, (_, i) => 
    String(i + 1).padStart(2, '0')
  )
  const minutes = Array.from({ length: 60 }, (_, i) => 
    String(i).padStart(2, '0')
  )
  const periods = ['AM', 'PM']

  return (
    <div className="flex rounded-md border bg-white shadow-sm">
      <ScrollArea className="h-[200px] w-[70px] rounded-l-md border-r">
        <div className="p-1">
          {hours.map((hour) => (
            <button
              key={hour}
              onClick={() => onTimeChange(hour, selectedMinute, selectedPeriod)}
              className={cn(
                "w-full rounded-sm px-2 py-1 text-left text-sm transition-colors",
                selectedHour === hour
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-50"
              )}
            >
              {hour}
            </button>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea className="h-[200px] w-[70px] border-r">
        <div className="p-1">
          {minutes.map((minute) => (
            <button
              key={minute}
              onClick={() => onTimeChange(selectedHour, minute, selectedPeriod)}
              className={cn(
                "w-full rounded-sm px-2 py-1 text-left text-sm transition-colors",
                selectedMinute === minute
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-50"
              )}
            >
              {minute}
            </button>
          ))}
        </div>
      </ScrollArea>
      <div className="w-[70px]">
        <div className="p-1">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => onTimeChange(selectedHour, selectedMinute, period)}
              className={cn(
                "w-full rounded-sm px-2 py-1 text-left text-sm transition-colors",
                selectedPeriod === period
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-50"
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

