"use client";

import React, { useState, useEffect } from "react";

export default function ThemeSwitcherButton() {
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check initial theme on component mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleTheme = () => {
    const root = document.documentElement;

    if (isDark) {
      // Switch to light mode
      root.style.setProperty('--color-background', 'oklch(100.00% 0.000 89.88)'); /* white */
      root.style.setProperty('--color-foreground', 'oklch(29.82% 0.001 17.24)'); /* dark */
      root.style.setProperty('--color-muted', 'oklch(29.82% 0.00143 15.934 / 0.5)'); /* muted */
    } else {
      // Switch to dark mode
      root.style.setProperty('--color-background', 'oklch(29.82% 0.001 17.24)'); /* dark */
      root.style.setProperty('--color-foreground', 'oklch(100.00% 0.000 89.88)'); /* white */
      root.style.setProperty('--color-muted', 'oklch(100% 0.00011 271.152 / 0.5)'); /* muted */
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
      {isHovered ? (isDark ? '🌙' : '☀️') : (isDark ? '☀️' : '🌙')}
    </button>
  );
}
