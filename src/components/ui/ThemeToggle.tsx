"use client";
import React, {  } from "react";
import {
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "./button";

export const ThemeToggleButton: React.FC<{
  setTheme: (theme: string) => void;
}> = ({ setTheme }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 rounded-full"
      >
        <Sun className="rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="center" className="w-36">
      <Button
        onClick={() => setTheme("light")}
        className="flex w-full items-center justify-start gap-3 rounded-md p-2"
        variant="ghost"
      >
        <Sun className="h-5 w-5" />
        <span>Light</span>
      </Button>
      <Button
        onClick={() => setTheme("dark")}
        className="flex w-full items-center justify-start gap-3 rounded-md p-2 my-1"
        variant="ghost"
      >
        <Moon className="h-5 w-5" />
        <span>Dark</span>
      </Button>
      <Button
        onClick={() => setTheme("system")}
        className="flex w-full items-center justify-start gap-3 rounded-md p-2"
        variant="ghost"
      >
        <Laptop className="h-5 w-5" />
        <span>System</span>
      </Button>
    </PopoverContent>
  </Popover>
);
