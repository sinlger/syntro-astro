import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    // Optional explicit topic id used to group language versions of the same
    // article for hreflang clusters. Falls back to pubDate when omitted.
    topic: z.string().optional(),
    author: z.string().default('Admin'),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }).optional(),
    tags: z.array(z.string()).optional()
  })
});

export const collections = {
  blog: blogCollection,
};
