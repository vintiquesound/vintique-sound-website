"use client";

import React, { useState, useEffect } from "react";

// Define the dark mode media query constant
const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

export default function ThemeSwitcherButton() {
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check initial theme on component mount
  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_MODE_QUERY);
    console.log('User prefers dark mode:', mediaQuery.matches);
    setIsDark(mediaQuery.matches);

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      console.log('System theme changed to:', e.matches ? 'dark' : 'light');
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleTheme = () => {
    const html = document.documentElement;

    if (isDark) {
      // Switch to light mode
      html.classList.remove('dark');
    } else {
      // Switch to dark mode
      html.classList.add('dark');
    }

    setIsDark(!isDark);
  };

  return (
    <button
      type="button"
      onClick={handleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="pt-2 pr-5 pb-2 pl-5 cursor-pointer"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isHovered ? (isDark ? '☀️' : '🌙') : (isDark ? '🌙' : '☀️')}
    </button>
  );
}
