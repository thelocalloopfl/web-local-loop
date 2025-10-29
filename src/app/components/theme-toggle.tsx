"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 🧩 Avoid hydration mismatch
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // 🌗 Determine if dark mode is active
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="
        relative flex items-center justify-between
        w-14 h-8 rounded-full
        border border-gray-300 dark:border-gray-700
        bg-gray-100 dark:bg-gray-800
        transition-all duration-300 ease-in-out
        shadow-sm hover:shadow-md
      "
    >
      {/* Toggle Knob */}
      <span
        className={`
          absolute left-1 top-1 w-6 h-6 rounded-full
          flex items-center justify-center text-white
          transition-transform duration-300 ease-in-out
          ${isDark ? "translate-x-6 bg-[var(--main-orange)]" : "translate-x-0 bg-yellow-300"}
        `}
      >
        {isDark ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4 text-black" />
        )}
      </span>
    </button>
  );
}
