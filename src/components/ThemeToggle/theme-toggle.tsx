// src/components/theme-toggle.tsx
"use client"

import * as React from "react"
import { Moon, Sun, SunMoon, MoonStar } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  
  // Handle mounting state to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const isDark = resolvedTheme === 'dark';
    const colorThemes = ['white', 'blue', 'green', 'violet'];
    const root = document.documentElement;
    
    // Remove all color theme classes first
    colorThemes.forEach(theme => root.classList.remove(theme));
    
    if (isDark) {
      root.classList.remove('dark');
      setTheme('white'); // Default to white theme when switching to light mode
    } else {
      root.classList.add('dark');
      setTheme('dark');
    }
  }

  // Get current theme based icons
  const getLightIcon = () => {
    switch (resolvedTheme) {
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem]" />
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative"
      >
        <span className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative"
    >
      {getLightIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}