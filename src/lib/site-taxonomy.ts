export type SiteSurface = "navigation" | "contact";

export type SiteTaxonomyItem = {
  title: string;
  href?: string;
  contactTitle?: string;
  contactHash?: string;
  surfaces: readonly SiteSurface[];
};

export type SiteTaxonomyGroup = {
  title: string;
  items: readonly SiteTaxonomyItem[];
  surfaces: readonly SiteSurface[];
};

export const siteTaxonomy = [
  {
    title: "Services",
    surfaces: ["navigation", "contact"],
    items: [
      {
        title: "Mixing & Mastering",
        href: "/mixing-mastering",
        contactTitle: "Mixing & Mastering Services",
        contactHash: "mixing-and-mastering",
        surfaces: ["navigation", "contact"],
      },
      {
        title: "Audio Editing",
        href: "/audio-editing",
        contactTitle: "Audio Editing Services",
        contactHash: "audio-editing",
        surfaces: ["navigation", "contact"],
      },
      {
        title: "Audio Repair",
        href: "/audio-repair",
        contactTitle: "Audio Repair Services",
        contactHash: "audio-repair",
        surfaces: ["navigation", "contact"],
      },
      {
        title: "Build Your Package",
        href: "/build-your-package",
        contactHash: "build-your-package",
        surfaces: ["navigation", "contact"],
      },
    ],
  },
  {
    title: "Education",
    surfaces: ["navigation", "contact"],
    items: [
      {
        title: "Blog",
        href: "/blog",
        contactTitle: "Blog Content",
        contactHash: "blog-content",
        surfaces: ["navigation", "contact"],
      },
      {
        title: "YouTube Videos",
        href: "https://www.youtube.com/@VintiqueSound",
        contactHash: "youtube-videos",
        surfaces: ["navigation", "contact"],
      },
      {
        title: "Online Courses",
        href: "/courses",
        contactHash: "online-courses",
        surfaces: ["navigation", "contact"],
      },
      {
        title: "1-on-1 Training",
        href: "/training",
        contactHash: "one-on-one-training",
        surfaces: ["navigation", "contact"],
      },
    ],
  },
  {
    title: "Digital Products",
    surfaces: ["navigation", "contact"],
    items: [
      {
        title: "Audio Tools",
        href: "/audio-tools",
        contactHash: "audio-tools",
        surfaces: ["navigation", "contact"],
      },
      {
        title: "Audio Plugins",
        href: "/audio-plugins",
        contactHash: "audio-plugins",
        surfaces: ["navigation", "contact"],
      },
      {
        title: "Presets & Templates",
        href: "/presets-and-templates",
        contactHash: "presets-and-templates",
        surfaces: ["navigation", "contact"],
      },
      {
        title: "Samples & Loops",
        href: "/samples-loops",
        contactHash: "samples-and-loops",
        surfaces: ["navigation", "contact"],
      },
    ],
  },
  {
    title: "Company",
    surfaces: ["navigation"],
    items: [
      { title: "Studio", href: "/studio", surfaces: ["navigation"] },
      { title: "FAQ", href: "/faq", surfaces: ["navigation"] },
      { title: "About", href: "/about", surfaces: ["navigation"] },
      { title: "Contact", href: "/contact", surfaces: ["navigation"] },
    ],
  },
  {
    title: "Other",
    surfaces: ["contact"],
    items: [
      {
        title: "Other / General Inquiry",
        contactHash: "other",
        surfaces: ["contact"],
      },
    ],
  },
] as const satisfies readonly SiteTaxonomyGroup[];
