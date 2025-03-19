"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";
import { useEffect, useState } from "react";

export default function Themes() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colorThemes = [
    "white",
    "blue",
    "green",
    "violet",
    "gradient",
    "gradient-2",
    "violet-gradient",
    "zinc",
  ];

  const handleThemeChange = (newTheme: string) => {
    const root = document.documentElement;
    const isDark = resolvedTheme === "dark";

    // First, remove all theme classes
    colorThemes.forEach((theme) => root.classList.remove(theme));

    // Add the new theme class
    root.classList.add(newTheme);

    // Maintain dark mode if it's active
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    setTheme(isDark ? "dark" : newTheme);
  };

  // Add cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup function to remove all theme classes when component unmounts
      const root = document.documentElement;
      colorThemes.forEach((theme) => root.classList.remove(theme));
    };
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-none" size="icon">
          <Palette className="h-[1.4rem] text-primary w-[1.4rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="mr-[20px] mt-[20px]">
        {colorThemes.map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => handleThemeChange(theme)}
            className="cursor-pointer"
          >
            {theme}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
