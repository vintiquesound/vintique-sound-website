export type NavItem = {
  label: string
  href: string
}

export type NavGroup = {
  title: string
  children: NavItem[]
}

export const navMenuGroups = [
  {
    title: "Services",
    children: [
      { label: "Mixing & Mastering", href: "/mixing-mastering" },
      { label: "Audio Editing", href: "/audio-editing" },
      { label: "Audio Repair", href: "/audio-repair" },
      { label: "Build Your Package", href: "/build-your-package" },
    ],
  },
  {
    title: "Education",
    children: [
      { label: "Blog", href: "/blog" },
      // { label: "YouTube Videos", href: "/youtube-videos" },
      { label: "YouTube Videos", href: "https://www.youtube.com/@VintiqueSound" }, // Tmp direct link, make embedded page in future
      { label: "Courses", href: "/courses" },
    ],
  },
  {
    title: "Digital Products",
    children: [
      { label: "Audio Tools", href: "/audio-tools" },
      { label: "Audio Plugins", href: "/audio-plugins" },
      { label: "Samples & Loops", href: "/samples-loops" },
    ],
  },
  {
    title: "Company",
    children: [
      { label: "Studio", href: "/studio" },
      { label: "FAQ", href: "/faq" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const satisfies NavGroup[]

export function isNavLinkActive(pathname: string, href: string) {
  const normalized = pathname.replace(/\/$/, "") || "/"
  const subpath = normalized.match(/[^/]+/g)

  return href === normalized || href === "/" + (subpath?.[0] || "")
}
