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

const NAV_HASH_SCOPES: Record<string, readonly string[]> = {
  "audio-services": ["audio-services", "mixing-and-mastering", "audio-editing", "audio-repair"],
  training: ["training", "education", "one-on-one-training", "project-feedback"],
}

const NAV_QUERY_GROUP_SCOPES: Record<string, readonly string[]> = {
  audio: ["audio", "audio-services", "mixing-and-mastering", "audio-editing", "audio-repair"],
  training: ["training", "education", "one-on-one-training", "project-feedback"],
}

function normalizeNavHref(href: string) {
  if (!href.startsWith("/")) return href
  const withoutQueryOrHash = href.split(/[?#]/, 1)[0] ?? href
  return withoutQueryOrHash.replace(/\/$/, "") || "/"
}

function normalizeNavHash(hash?: string) {
  return (hash ?? "").replace(/^#/, "").trim().toLowerCase()
}

function getNavSearchGroup(search?: string) {
  const params = new URLSearchParams(search ?? "")
  return (params.get("group") ?? "").trim().toLowerCase()
}

export function isNavLinkActive(pathname: string, href: string, currentHash?: string, currentSearch?: string) {
  const normalized = pathname.replace(/\/$/, "") || "/"
  const subpath = normalized.match(/[^/]+/g)
  const normalizedHref = normalizeNavHref(href)
  const normalizedCurrentHash = normalizeNavHash(currentHash)
  const normalizedCurrentGroup = getNavSearchGroup(currentSearch)
  const hrefHash = href.includes("#") ? normalizeNavHash(href.split("#")[1]) : ""

  const pathMatches = normalizedHref === normalized || normalizedHref === "/" + (subpath?.[0] || "")

  if (!pathMatches) return false
  if (!hrefHash) return true
  if (normalizedCurrentHash) {
    return (NAV_HASH_SCOPES[hrefHash] ?? [hrefHash]).includes(normalizedCurrentHash)
  }

  if (normalizedCurrentGroup) {
    return (NAV_QUERY_GROUP_SCOPES[normalizedCurrentGroup] ?? [normalizedCurrentGroup]).includes(hrefHash)
  }

  return true
}
