"use client";
// import EmailDetails from "@/components/profile/emailDetails";
// import SaveEmailDetails from "@/components/profile/saveEmailDetails";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";

const Email = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <div className="h-full flex flex-col md:flex-row  gap-2.5 md:justify-between w-full">
      <div className="w-full order-2 md:order-1">
        {/* <EmailDetails /> */}
        Email
      </div>
      <div className="order-1 md:order-2">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button className="w-full md:w-[150px] md:block">Add</Button>
          </PopoverTrigger>
          <PopoverContent className=" md:w-80 md:fixed  md:right-[10px] md:top-[10px]">
            {/* <SaveEmailDetails setIsPopoverOpen={setIsPopoverOpen} /> */}
            Email
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Email;
