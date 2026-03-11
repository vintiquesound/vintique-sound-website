import { siteTaxonomy, type SiteSurface, type SiteTaxonomyGroup } from "@/lib/site-taxonomy";

export type ContactTopicOption = {
  label: string;
  slug: string;
};

export type ContactTopicGroup = {
  label: string;
  options: ContactTopicOption[];
};

const hasSurface = (surfaces: readonly SiteSurface[], surface: SiteSurface) => surfaces.includes(surface);

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const getContactSlug = (href: string | undefined, shortSubtitle: string) => {
  if (typeof href === "string" && href.startsWith("/")) {
    return href.replace(/^\//, "").replace(/\/$/, "");
  }

  return slugify(shortSubtitle);
};

export const contactTopicGroups: ContactTopicGroup[] = (siteTaxonomy as readonly SiteTaxonomyGroup[])
  .filter((group) => hasSurface(group.surfaces, "contact"))
  .map((group) => ({
    label: group.fullTitle,
    options: group.items
      .filter((item) => hasSurface(item.surfaces, "contact"))
      .map((item) => ({
        label: item.fullSubtitle,
        slug: getContactSlug(item.href, item.shortSubtitle),
      })),
  }));
