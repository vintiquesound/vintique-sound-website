import * as React from "react"
import { Check, Monitor, Moon, Sun } from "lucide-react"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  HeaderDropdownMenu,
  headerDropdownItemClass,
} from "@/components/ui/HeaderDropdownMenu"

type ThemeMode = "light" | "dark" | "system"

const STORAGE_KEY = "theme-mode"
const THEME_OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const

const triggerIconClassByMode: Record<ThemeMode, string> = {
  light: "hidden leading-none in-data-[theme-mode=light]:inline-flex",
  dark: "hidden leading-none in-data-[theme-mode=dark]:inline-flex",
  system: "hidden leading-none in-data-[theme-mode=system]:inline-flex",
}

export default function ThemeToggleMenu() {
  const [mode, setMode] = React.useState<ThemeMode>("system")

  React.useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || "system"
    setMode(saved)
  }, [])

  React.useEffect(() => {
    document.documentElement.dataset.themeMode = mode

    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      const isDark = mode === "dark" || (mode === "system" && mql.matches)
      document.documentElement.classList.toggle("dark", isDark)
    }

    apply()

    if (mode !== "system") return

    mql.addEventListener("change", apply)
    return () => mql.removeEventListener("change", apply)
  }, [mode])

  const setThemeMode = React.useCallback((next: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, next)
    setMode(next)
  }, [])

  return (
    <HeaderDropdownMenu
      ariaLabel="Theme"
      align="end"
      contentClassName="min-w-40"
      trigger={(
        <>
          {THEME_OPTIONS.map(({ value, Icon }) => (
            <span key={value} className={triggerIconClassByMode[value]} aria-hidden="true">
              <Icon size={18} />
            </span>
          ))}
        </>
      )}
      content={(
        <>
          {THEME_OPTIONS.map(({ value, label, Icon }) => (
            <DropdownMenuItem
              key={value}
              className={headerDropdownItemClass}
              onSelect={() => setThemeMode(value)}
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex leading-none" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span>{label}</span>
              </span>
              {mode === value ? <Check className="size-4" aria-hidden="true" /> : null}
            </DropdownMenuItem>
          ))}
        </>
      )}
    />
  )
}
