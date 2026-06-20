import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    date: z.string().optional(),
    category: z.string().optional(),
    image: z.string().optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
