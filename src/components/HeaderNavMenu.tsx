import * as React from "react"

import { isNavLinkActive, navMenuGroups } from "@/lib/navigation"

import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { HeaderNavigationDropdownMenu } from "@/components/ui/HeaderDropdownMenu"
import { cn } from "@/lib/utils"

type HeaderNavMenuProps = {
  pathname: string
}

export default function HeaderNavMenu({ pathname }: HeaderNavMenuProps) {
  const isActive = React.useCallback(
    (href: string) => isNavLinkActive(pathname, href),
    [pathname]
  )

  const dropdownLinkBase =
    "block w-full px-3 py-2 text-sm text-(--text) hover:text-accent focus:text-accent no-underline transition-colors"

  return (
    <NavigationMenu viewport={false} className="max-w-none flex-1 justify-center">
      <NavigationMenuList className="justify-center gap-2 lg:gap-3">
        {navMenuGroups.map((group) => {
          const groupIsActive = group.children.some((l) => isActive(l.href))

          return (
            <HeaderNavigationDropdownMenu
              key={group.title}
              active={groupIsActive}
              trigger={group.title}
              content={(
                <div className="flex flex-col">
                  {group.children.map((l) => (
                    <NavigationMenuLink
                      key={l.href}
                      href={l.href}
                      className={cn(
                        dropdownLinkBase,
                        isActive(l.href) && "font-bold underline"
                      )}
                    >
                      {l.label}
                    </NavigationMenuLink>
                  ))}
                </div>
              )}
            />
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
