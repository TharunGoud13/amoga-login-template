import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "../ui/avatar";
import { auth } from "@/auth";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

export default async function UserNav() {
  const session = await auth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="flex items-center justify-center">
          <FontAwesomeIcon icon={faUser} className="text-2xl text-primary" />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" fixed left-[-200px] top-[20px] ">
        <DropdownMenuLabel className="text-primary">
          {session?.user?.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem className="text-primary">
            {session?.user?.email}
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
