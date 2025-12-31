import * as React from "react"
import { Check, Monitor, Moon, Sun } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ThemeMode = "light" | "dark" | "system"

const STORAGE_KEY = "theme-mode"

function applyMode(mode: ThemeMode) {
  document.documentElement.dataset.themeMode = mode

  if (mode === "light" || mode === "dark") {
    document.documentElement.dataset.theme = mode
  } else {
    delete document.documentElement.dataset.theme
  }
}

export default function ThemeToggleMenu() {
  const [mode, setMode] = React.useState<ThemeMode>("system")

  React.useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || "system"
    setMode(saved)
    applyMode(saved)
  }, [])

  const setThemeMode = React.useCallback((next: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, next)
    setMode(next)
    applyMode(next)
  }, [])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center py-4 px-2 bg-transparent border-0 cursor-pointer text-(--text) hover:text-accent focus:text-accent border-b-4 border-transparent focus-visible:outline-none transition-colors"
          aria-haspopup="menu"
          aria-label="Theme"
        >
          <span
            className="hidden leading-none in-data-[theme-mode=light]:inline-flex"
            aria-hidden="true"
          >
            <Sun size={18} />
          </span>
          <span
            className="hidden leading-none in-data-[theme-mode=dark]:inline-flex"
            aria-hidden="true"
          >
            <Moon size={18} />
          </span>
          <span
            className="hidden leading-none in-data-[theme-mode=system]:inline-flex"
            aria-hidden="true"
          >
            <Monitor size={18} />
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-40 p-1 rounded-[10px] bg-background/95 supports-backdrop-filter:bg-background/80 backdrop-blur-lg border border-border shadow-md z-30 text-(--text)"
      >
        <DropdownMenuItem
          className="flex items-center justify-between gap-3 py-[0.6rem] px-3 rounded-lg cursor-pointer"
          onSelect={() => setThemeMode("light")}
        >
          <span className="flex items-center gap-2">
            <span className="inline-flex leading-none" aria-hidden="true">
              <Sun size={18} />
            </span>
            <span>Light</span>
          </span>
          {mode === "light" ? <Check className="size-4" aria-hidden="true" /> : null}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center justify-between gap-3 py-[0.6rem] px-3 rounded-lg cursor-pointer"
          onSelect={() => setThemeMode("dark")}
        >
          <span className="flex items-center gap-2">
            <span className="inline-flex leading-none" aria-hidden="true">
              <Moon size={18} />
            </span>
            <span>Dark</span>
          </span>
          {mode === "dark" ? <Check className="size-4" aria-hidden="true" /> : null}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center justify-between gap-3 py-[0.6rem] px-3 rounded-lg cursor-pointer"
          onSelect={() => setThemeMode("system")}
        >
          <span className="flex items-center gap-2">
            <span className="inline-flex leading-none" aria-hidden="true">
              <Monitor size={18} />
            </span>
            <span>System</span>
          </span>
          {mode === "system" ? <Check className="size-4" aria-hidden="true" /> : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
