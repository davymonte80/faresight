"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-amber-800/10">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />

      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="group flex items-center gap-4">
            {/* Decorative element */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-700/20 to-amber-600/20 blur-sm group-hover:blur-md transition-all duration-300" />
              <div className="relative w-8 h-8 bg-gradient-to-br from-amber-700 to-amber-600 flex items-center justify-center">
                <div className="w-2 h-2 bg-background/90" />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight leading-none">
                <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 bg-clip-text text-transparent">
                  AeroLogic
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-px w-4 bg-gradient-to-r from-amber-600 to-transparent" />
                <span className="text-xs tracking-widest text-amber-700 uppercase font-medium">
                  Flight Intelligence
                </span>
                <div className="h-px w-4 bg-gradient-to-l from-amber-600 to-transparent" />
              </div>
            </div>
          </Link>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-6">
            {/* Minimal Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/search"
                className="text-sm tracking-wider text-foreground/70 hover:text-amber-700 transition-colors relative group"
              >
                Analysis
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-amber-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/methodology"
                className="text-sm tracking-wider text-foreground/70 hover:text-amber-700 transition-colors relative group"
              >
                Methodology
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-amber-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/enterprise"
                className="text-sm tracking-wider text-foreground/70 hover:text-amber-700 transition-colors relative group"
              >
                Enterprise
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-amber-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/insights"
                className="text-sm tracking-wider text-foreground/70 hover:text-amber-700 transition-colors relative group"
              >
                Insights
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-amber-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </nav>

            {/* Separator */}
            <div className="hidden md:block h-6 w-px bg-amber-800/20" />

            {/* Theme Toggle */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-700/10 to-transparent blur-sm" />
              <div className="relative">
                <ThemeToggle />
              </div>
            </div>

            {/* Access Button */}
            <Link
              href="/search"
              className="hidden sm:inline-flex items-center justify-center bg-gradient-to-r from-amber-800 to-amber-700 text-white text-sm font-medium tracking-wider px-6 py-2.5 hover:shadow-lg hover:shadow-amber-900/20 transition-all duration-300 uppercase relative overflow-hidden group"
            >
              <span className="relative z-10">Access Platform</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-amber-400/50 to-transparent" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-600/10 to-transparent" />
    </header>
  );
}
