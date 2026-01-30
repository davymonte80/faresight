"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
        <div className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("light")}
        className={cn(
          "h-8 w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-700",
          theme === "light" && "bg-white dark:bg-slate-600 shadow-sm",
        )}
        title="Light mode"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light mode</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("dark")}
        className={cn(
          "h-8 w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-700",
          theme === "dark" && "bg-white dark:bg-slate-600 shadow-sm",
        )}
        title="Dark mode"
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark mode</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("system")}
        className={cn(
          "h-8 w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-700",
          theme === "system" && "bg-white dark:bg-slate-600 shadow-sm",
        )}
        title="System theme"
      >
        <Monitor className="h-4 w-4" />
        <span className="sr-only">System theme</span>
      </Button>
    </div>
  );
}
