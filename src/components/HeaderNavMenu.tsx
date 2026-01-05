import * as React from "react"

import { isNavLinkActive, navMenuGroups } from "@/lib/navigation"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

type HeaderNavMenuProps = {
  pathname: string
}

export default function HeaderNavMenu({ pathname }: HeaderNavMenuProps) {
  const isActive = React.useCallback(
    (href: string) => isNavLinkActive(pathname, href),
    [pathname]
  )

  const topLinkBase =
    "inline-flex items-center gap-1 py-4 px-2 text-sm lg:text-base text-(--text) hover:text-accent focus:text-accent border-b-4 border-transparent no-underline transition-colors"
  const topTriggerBase =
    `${topLinkBase} data-[state=open]:text-accent h-auto font-normal`
  const dropdownLinkBase =
    "block w-full px-3 py-2 text-sm text-(--text) hover:text-accent focus:text-accent no-underline transition-colors"

  return (
    <NavigationMenu viewport={false} className="max-w-none flex-1 justify-center">
      <NavigationMenuList className="justify-center gap-2 lg:gap-3">
        {navMenuGroups.map((group) => {
          const groupIsActive = group.children.some((l) => isActive(l.href))

          return (
            <NavigationMenuItem key={group.title}>
              <NavigationMenuTrigger
                className={`${topTriggerBase} ${groupIsActive ? "border-accent" : ""}`}
              >
                {group.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="md:min-w-55">
                <div className="flex flex-col">
                  {group.children.map((l) => (
                    <NavigationMenuLink
                      key={l.href}
                      href={l.href}
                      className={`${dropdownLinkBase} ${isActive(l.href) ? "font-bold underline" : ""}`}
                    >
                      {l.label}
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
