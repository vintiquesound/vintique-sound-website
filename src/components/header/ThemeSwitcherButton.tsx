"use client";

import React, { useState, useEffect } from "react";

// Define the dark mode media query constant
const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

export default function ThemeSwitcherButton() {
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check initial theme on component mount
  useEffect(() => {
    const html = document.documentElement;
    const mediaQuery = window.matchMedia(DARK_MODE_QUERY);

    // Check if there's already a manual theme set, otherwise use system preference
    const hasManualTheme = html.classList.contains('dark') || html.classList.contains('light');
    const systemPrefersDark = mediaQuery.matches;
    const isCurrentlyDark = hasManualTheme ? html.classList.contains('dark') : systemPrefersDark;

    console.log('System prefers dark mode:', systemPrefersDark);
    console.log('Manual theme set:', hasManualTheme);
    console.log('Currently dark:', isCurrentlyDark);

    setIsDark(isCurrentlyDark);

    // Listen for system theme changes only if no manual theme is set
    const handleChange = (e: MediaQueryListEvent) => {
      if (!html.classList.contains('dark') && !html.classList.contains('light')) {
        console.log('System theme changed to:', e.matches ? 'dark' : 'light');
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleTheme = () => {
    const html = document.documentElement;

    if (isDark) {
      // Switch to light mode - remove dark class and add light class for explicit override
      html.classList.remove('dark');
      html.classList.add('light');
      console.log('Switched to light mode');
    } else {
      // Switch to dark mode - remove light class and add dark class
      html.classList.remove('light');
      html.classList.add('dark');
      console.log('Switched to dark mode');
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
