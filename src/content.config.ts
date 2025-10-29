import { defineCollection, z } from 'astro:content';

// Blog Content Collections setup
const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
      categories: z.array(z.string()),
      year: z.number(),
			pubDate: z.coerce.date(), // Transform string to Date object
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

export const collections = { blog };
