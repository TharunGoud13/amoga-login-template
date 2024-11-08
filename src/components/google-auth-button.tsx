"use client";

import { Button } from "./ui/button";
import { login } from "@/app/actions";
import { FC } from "react";
import { MailIcon } from "lucide-react";

const GoogleSignInButton: FC<any> = ({ loginLog }) => {
  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={async () => {
        login("google");
      }}
    >
      <MailIcon className="mr-2 h-4 w-4"/>
      Google
    </Button>
  );
};

export default GoogleSignInButton;
