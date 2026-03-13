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
  const [currentHash, setCurrentHash] = React.useState("")
  const [currentSearch, setCurrentSearch] = React.useState("")

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined

    const syncLocationState = () => {
      setCurrentHash(window.location.hash)
      setCurrentSearch(window.location.search)
    }

    syncLocationState()
    window.addEventListener("hashchange", syncLocationState)

    return () => {
      window.removeEventListener("hashchange", syncLocationState)
    }
  }, [])

  const isActive = React.useCallback(
    (href: string) => isNavLinkActive(pathname, href, currentHash, currentSearch),
    [currentHash, currentSearch, pathname]
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
