'use client';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';

type CompProps = {};

export default function Themes({}: CompProps) {
  const { setTheme, themes } = useTheme();
  
  // Filter out the "system" theme
  const filteredThemes = themes.filter((theme) => theme !== 'system');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className='border-none' size="icon">
          <Palette className="h-[1.4rem] text-primary w-[1.4rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className='mr-[20px] mt-[20px]'>
        {filteredThemes.map((theme) => (
          <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
            {theme}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
