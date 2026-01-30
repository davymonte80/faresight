"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "group toast",
          title: "text-sm font-semibold",
          description: "text-sm opacity-90",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          error: "bg-red-500 text-white border-red-600",
          success: "bg-green-500 text-white border-green-600",
          warning: "bg-yellow-500 text-white border-yellow-600",
          info: "bg-blue-500 text-white border-blue-600",
        },
      }}
    />
  );
}
