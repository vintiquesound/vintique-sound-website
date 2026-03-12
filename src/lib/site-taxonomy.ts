export type SiteSurface = "navigation" | "contact";

export type SiteTaxonomyItem = {
  shortSubtitle: string;
  fullSubtitle: string;
  href?: string;
  surfaces: readonly SiteSurface[];
};

export type SiteTaxonomyGroup = {
  shortTitle: string;
  fullTitle: string;
  items: readonly SiteTaxonomyItem[];
  surfaces: readonly SiteSurface[];
};

export const siteTaxonomy = [
  {
    shortTitle: "Services",
    fullTitle: "Audio Engineering Services",
    surfaces: ["navigation", "contact"],
    items: [
      {
        shortSubtitle: "Mixing & Mastering",
        fullSubtitle: "Mixing & Mastering Services",
        href: "/mixing-and-mastering",
        surfaces: ["navigation", "contact"],
      },
      {
        shortSubtitle: "Audio Editing",
        fullSubtitle: "Audio Editing Services",
        href: "/audio-editing",
        surfaces: ["navigation", "contact"],
      },
      {
        shortSubtitle: "Audio Repair",
        fullSubtitle: "Audio Repair Services",
        href: "/audio-repair",
        surfaces: ["navigation", "contact"],
      },
      {
        shortSubtitle: "Build Your Package",
        fullSubtitle: "Build Your Package for Audio Services",
        href: "/build-your-package#audio-services",
        surfaces: ["navigation"],
      },
    ],
  },
  {
    shortTitle: "Education",
    fullTitle: "Audio Education",
    surfaces: ["navigation", "contact"],
    items: [
      {
        shortSubtitle: "Online Courses",
        fullSubtitle: "Online Courses",
        href: "/online-courses",
        surfaces: ["navigation", "contact"],
      },
      {
        shortSubtitle: "1-on-1 Training",
        fullSubtitle: "1-on-1 Training",
        href: "/one-on-one-training",
        surfaces: ["navigation", "contact"],
      },
      {
        shortSubtitle: "Project Feedback",
        fullSubtitle: "Project Feedback",
        href: "/project-feedback",
        surfaces: ["navigation", "contact"],
      },
      {
        shortSubtitle: "Build Your Package",
        fullSubtitle: "Build Your Package for Training & Feedback",
        href: "/build-your-package#training",
        surfaces: ["navigation"],
      },
    ],
  },
  {
    shortTitle: "Digital Products",
    fullTitle: "Digital Audio Products",
    surfaces: ["navigation", "contact"],
    items: [
      {
        shortSubtitle: "Audio Tools",
        fullSubtitle: "Audio Tools",
        href: "/audio-tools",
        surfaces: ["navigation", "contact"],
      },
      {
        shortSubtitle: "Audio Plugins",
        fullSubtitle: "Audio Plugins",
        href: "/audio-plugins",
        surfaces: ["navigation", "contact"],
      },
      {
        shortSubtitle: "Presets & Templates",
        fullSubtitle: "Presets & Templates",
        href: "/presets-and-templates",
        surfaces: ["navigation", "contact"],
      },
      {
        shortSubtitle: "Samples & Loops",
        fullSubtitle: "Samples & Loops",
        href: "/samples-and-loops",
        surfaces: ["navigation", "contact"],
      },
    ],
  },
  {
    shortTitle: "Company",
    fullTitle: "Company Information",
    surfaces: ["navigation"],
    items: [
      { shortSubtitle: "Studio", fullSubtitle: "Studio", href: "/studio", surfaces: ["navigation"] },
      { shortSubtitle: "FAQ", fullSubtitle: "FAQ", href: "/faq", surfaces: ["navigation"] },
      { shortSubtitle: "About", fullSubtitle: "About", href: "/about", surfaces: ["navigation"] },
      { shortSubtitle: "Contact", fullSubtitle: "Contact", href: "/contact", surfaces: ["navigation"] },
    ],
  },
  {
    shortTitle: "Blog",
    fullTitle: "Blog Content",
    surfaces: ["navigation"],
    items: [
      {
        shortSubtitle: "Blog Home",
        fullSubtitle: "Blog Home",
        href: "/blog",
        surfaces: ["navigation"],
      },
      {
        shortSubtitle: "All Tags",
        fullSubtitle: "All Blog Tags",
        href: "/blog/tags",
        surfaces: ["navigation"],
      },
    ],
  },
  {
    shortTitle: "Other",
    fullTitle: "Other Inquiries",
    surfaces: ["contact"],
    items: [
      {
        shortSubtitle: "Other",
        fullSubtitle: "Other / General Inquiry",
        surfaces: ["contact"],
      },
    ],
  },
] as const satisfies readonly SiteTaxonomyGroup[];
