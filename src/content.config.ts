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
			// Visibility
			// - draft: work-in-progress (never rendered or listed)
			// - published: when false, the post is hidden entirely (not rendered or listed)
			draft: z.boolean().optional().default(false),
			published: z.boolean().optional().default(true),

			// Dates
			// Accepts YYYY-MM-DD or other Date-coercible strings
			pubDate: z.coerce.date(), // Transform string to Date object
			revisedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

export const collections = { blog };
