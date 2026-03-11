export type NavItem = {
  label: string
  href: string
}

export type NavGroup = {
  title: string
  children: NavItem[]
}

import { siteTaxonomy, type SiteSurface, type SiteTaxonomyGroup, type SiteTaxonomyItem } from "@/lib/site-taxonomy"

const hasSurface = (surfaces: readonly SiteSurface[], surface: SiteSurface) => surfaces.includes(surface)

const isNavigationItem = (item: SiteTaxonomyItem): item is SiteTaxonomyItem & { href: string } => {
  return hasSurface(item.surfaces, "navigation") && typeof item.href === "string"
}

export const navMenuGroups: NavGroup[] = (siteTaxonomy as readonly SiteTaxonomyGroup[])
  .filter((group) => hasSurface(group.surfaces, "navigation"))
  .map((group) => ({
    title: group.shortTitle,
    children: group.items
      .filter(isNavigationItem)
      .map((item) => ({
        label: item.shortSubtitle,
        href: item.href,
      })),
  }))

export function isNavLinkActive(pathname: string, href: string) {
  const normalized = pathname.replace(/\/$/, "") || "/"
  const subpath = normalized.match(/[^/]+/g)

  return href === normalized || href === "/" + (subpath?.[0] || "")
}
