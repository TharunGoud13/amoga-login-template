import { ThemeToggle } from "../ThemeToggle/theme-toggle";
import Link from "next/link";
import LocaleSwitcher from "../language/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import Themes from "../ThemeToggle/themes";
import { LogIn } from "lucide-react";

export default function PublicHeader() {
  const t = useTranslations("TopNav");
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed  left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          <div className="flex gap-4">
            <Link href="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6 text-primary"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>  
            </Link>
            
          </div> 
        </div>
        <div className={cn('block lg:!hidden')}>
            <MobileSidebar />
          </div>
        <div className="flex items-center gap-2.5">
          <Themes/>
          <ThemeToggle />
          <LocaleSwitcher />
          <Link href="/applogin"><LogIn className="h-6 w-6"/></Link>
        </div>
      </nav>
    </div>
  );
}
