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

export const contactTopicGroups: ContactTopicGroup[] = (siteTaxonomy as readonly SiteTaxonomyGroup[])
  .filter((group) => hasSurface(group.surfaces, "contact"))
  .map((group) => ({
    label: group.title,
    options: group.items
      .filter((item) => hasSurface(item.surfaces, "contact"))
      .map((item) => ({
        label: item.contactTitle ?? item.title,
        slug: item.contactHash ?? item.href?.replace(/^\//, "") ?? "",
      })),
  }));
