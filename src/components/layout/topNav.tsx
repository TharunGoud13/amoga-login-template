import { ThemeToggle } from "../ThemeToggle/theme-toggle";
import Link from "next/link";
import LogoutButton from "../forms/logout-button";
import LocaleSwitcher from "../language/LocaleSwitcher";
import { useTranslations } from "next-intl";
import UserNav from "./user-nav";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import Themes from "../ThemeToggle/themes";

export default function Header({ session }: { session: any }) {
  const access = session?.user?.roles_json?.length ?? 0 > 0;
  const t = useTranslations("TopNav");
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed  left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          <div className="flex gap-4">
            <Link href="/role_menu" className="flex items-center">
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
              <span className="text-primary"></span>
            </Link>
            {/* <Link href="/dashboard" className="text-primary">
              {t("dashboard")}
            </Link>
            <Link href="/form_maker" className="text-primary">
              Form Maker
            </Link>
            {access && session?.user?.roles_json.includes("Admin") && (
              <Link href="/doc-template" className="text-primary">
                Doc Template
              </Link>
            )}
            <Link href="/chat" className="text-primary">
              Chat Forms
            </Link>
            <Link href="/chat_with_db" className="text-primary">
              Chat with DB
            </Link>
            <Link href="/story_builder" className="text-primary">
              Story Builder
            </Link>
            {access && session?.user?.roles_json.includes("Admin") && (
              <Link href="/myDocs" className="text-primary">
                My Docs
              </Link>
            )} */}
          </div>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2.5">
          <Themes />
          <ThemeToggle />
          <LocaleSwitcher />
          <LogoutButton />
          <UserNav />
        </div>
      </nav>
    </div>
  );
}
