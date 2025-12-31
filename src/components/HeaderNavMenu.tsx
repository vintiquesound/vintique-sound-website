import * as React from "react"

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
  const subpath = React.useMemo(() => pathname.match(/[^/]+/g), [pathname])

  const isActive = React.useCallback(
    (href: string) => href === pathname || href === "/" + (subpath?.[0] || ""),
    [pathname, subpath]
  )

  const servicesLinks = React.useMemo(
    () => [
      { href: "/mixing-mastering", label: "Mixing & Mastering" },
      { href: "/editing-repairs", label: "Audio Editing" },
      { href: "/editing-repairs", label: "Audio Restoration" },
    ],
    []
  )

  const educationLinks = React.useMemo(
    () => [
      { href: "/tutorial-videos", label: "YouTube Videos" },
      { href: "/tutorial-videos", label: "Tutorial Videos" },
    ],
    []
  )

  const digitalProductsLinks = React.useMemo(
    () => [
      { href: "/plugins", label: "Plugins" },
      { href: "/samples-loops", label: "Samples & Loops" },
    ],
    []
  )

  const servicesActive = React.useMemo(
    () => servicesLinks.some((l) => isActive(l.href)),
    [servicesLinks, isActive]
  )
  const educationActive = React.useMemo(
    () => educationLinks.some((l) => isActive(l.href)),
    [educationLinks, isActive]
  )
  const digitalProductsActive = React.useMemo(
    () => digitalProductsLinks.some((l) => isActive(l.href)),
    [digitalProductsLinks, isActive]
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
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={`${topTriggerBase} ${servicesActive ? "border-accent" : ""}`}
          >
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent className="md:min-w-55">
            <div className="flex flex-col">
              {servicesLinks.map((l) => (
                <NavigationMenuLink
                  key={l.label}
                  href={l.href}
                  className={`${dropdownLinkBase} ${isActive(l.href) ? "font-bold underline" : ""}`}
                >
                  {l.label}
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={`${topTriggerBase} ${educationActive ? "border-accent" : ""}`}
          >
            Education
          </NavigationMenuTrigger>
          <NavigationMenuContent className="md:min-w-55">
            <div className="flex flex-col">
              {educationLinks.map((l) => (
                <NavigationMenuLink
                  key={l.label}
                  href={l.href}
                  className={`${dropdownLinkBase} ${isActive(l.href) ? "font-bold underline" : ""}`}
                >
                  {l.label}
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={`${topTriggerBase} ${digitalProductsActive ? "border-accent" : ""}`}
          >
            Digital Products
          </NavigationMenuTrigger>
          <NavigationMenuContent className="md:min-w-55">
            <div className="flex flex-col">
              {digitalProductsLinks.map((l) => (
                <NavigationMenuLink
                  key={l.label}
                  href={l.href}
                  className={`${dropdownLinkBase} ${isActive(l.href) ? "font-bold underline" : ""}`}
                >
                  {l.label}
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href="/studio"
            className={`${topLinkBase} ${isActive("/studio") ? "border-accent" : ""}`}
          >
            Studio
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href="/blog"
            className={`${topLinkBase} ${isActive("/blog") ? "border-accent" : ""}`}
          >
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href="/about"
            className={`${topLinkBase} ${isActive("/about") ? "border-accent" : ""}`}
          >
            About
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href="/contact"
            className={`${topLinkBase} ${isActive("/contact") ? "border-accent" : ""}`}
          >
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
