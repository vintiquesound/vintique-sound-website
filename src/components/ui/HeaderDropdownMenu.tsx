import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

type HeaderMenuSharedProps = {
  trigger: React.ReactNode
  content: React.ReactNode
  triggerClassName?: string
  contentClassName?: string
  hoverEffects?: boolean
  gap?: number
}

const DEFAULT_HEADER_DROPDOWN_GAP_PX = 8

type HeaderDropdownMenuProps = HeaderMenuSharedProps & {
  ariaLabel: string
  align?: "start" | "center" | "end"
}

type HeaderNavigationDropdownMenuProps = HeaderMenuSharedProps & {
  active?: boolean
}

const headerDropdownSurfaceBaseClass =
  "relative p-1 rounded-[10px] border border-border shadow-md z-30 text-(--text) bg-background backdrop-blur-lg supports-backdrop-filter:bg-background/85 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none"

const headerDropdownSurfaceClass = headerDropdownSurfaceBaseClass

const headerNavigationSurfaceClass = headerDropdownSurfaceBaseClass

export const headerDropdownItemClass =
  "flex items-center justify-between gap-3 py-[0.6rem] px-3 rounded-lg cursor-pointer"

export function getHeaderDropdownTriggerClass({
  hoverEffects = true,
}: {
  hoverEffects?: boolean
}) {
  return cn(
    "inline-flex items-center justify-center py-4 px-2 bg-transparent border-0 text-(--text) border-b-4 border-transparent transition-colors",
    hoverEffects && "hover:text-accent focus:text-accent"
  )
}

export function getHeaderDropdownContentClass() {
  return headerDropdownSurfaceClass
}

export function getHeaderNavigationContentClass() {
  return headerNavigationSurfaceClass
}

export function HeaderNavigationDropdownMenu(props: HeaderNavigationDropdownMenuProps) {
  const {
    trigger,
    content,
    triggerClassName,
    contentClassName,
    hoverEffects = true,
    gap = DEFAULT_HEADER_DROPDOWN_GAP_PX,
  } = props

  const triggerBaseClass = getHeaderDropdownTriggerClass({ hoverEffects })
  const contentBaseClass = getHeaderNavigationContentClass()
  const { active = false } = props

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          triggerBaseClass,
          "gap-1 text-sm lg:text-base no-underline data-[state=open]:text-accent h-auto font-normal",
          active && "border-accent",
          triggerClassName
        )}
      >
        {trigger}
      </NavigationMenuTrigger>
      <NavigationMenuContent
        disableMotion
        style={{ marginTop: gap }}
        className={cn("mt-0 md:min-w-48", contentBaseClass, contentClassName)}
      >
        {content}
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

export function HeaderDropdownMenu(props: HeaderDropdownMenuProps) {
  const {
    trigger,
    content,
    triggerClassName,
    contentClassName,
    hoverEffects = true,
    gap = DEFAULT_HEADER_DROPDOWN_GAP_PX,
    ariaLabel,
    align = "end",
  } = props

  const triggerBaseClass = getHeaderDropdownTriggerClass({ hoverEffects })
  const contentBaseClass = getHeaderDropdownContentClass()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            triggerBaseClass,
            "cursor-pointer focus-visible:outline-none",
            triggerClassName
          )}
          aria-haspopup="menu"
          aria-label={ariaLabel}
        >
          {trigger}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        sideOffset={gap}
        className={cn(contentBaseClass, contentClassName)}
      >
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
