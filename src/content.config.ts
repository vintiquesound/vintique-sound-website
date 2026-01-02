import { defineCollection, z } from 'astro:content';

// Blog Content Collections setup
const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
      // Visibility
			// - draft: work-in-progress (never rendered or listed)
			// - published: when false, the post is hidden entirely (not rendered or listed)
			draft: z.boolean().optional().default(false),
			published: z.boolean().optional().default(true),

      // Year used in URL
      year: z.number(),

      // Post content
      heroImage: image().optional(),
			title: z.string(),
			description: z.string(),

			// Dates
			// Accepts YYYY-MM-DD or other Date-coercible strings
			pubDate: z.coerce.date(), // Transform string to Date object
			revisedDate: z.preprocess(
				(value) => (value === "" ? undefined : value),
				z.coerce.date().optional()
			),

      // Tags (categories)
      tags: z.array(z.string()),

      // Quote from content
      quote: z.string().optional(),
		}),
});

export const collections = { blog };
