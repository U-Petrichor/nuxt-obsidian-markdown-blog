import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        // =====================
        // 通用字段
        // =====================
        title: z.string().min(1),
        description: z.string().optional(),
        kind: z.enum(['standalone', 'series', 'series-root']),
        isFeatured: z.boolean().default(false),
        theme: z.string().default('theme-default'),

        // =====================
        // 路由核心字段（关键！）
        // =====================
        slug: z.string().optional(), // standalone / series 必须有

        // =====================
        // Series Root
        // =====================
        series: z.string().optional(), // root 和 article 都用

        icon: z.string().optional(),

        // Optional custom background image for the homepage card cover.
        // Accepts any path resolvable at runtime (e.g. '/images/my-cover.jpg').
        // Falls back to the theme gradient when omitted.
        coverImage: z.string().optional(),

        // =====================
        // Series Article
        // =====================
        category: z.string().optional(),
        navOrder: z.number().optional(),
      }),
    }),
  },
})