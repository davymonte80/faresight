"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
              ✈️ FareSight
            </h1>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
