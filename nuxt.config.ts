// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    './modules/obsidian-callout.ts',
  ],
  css: [
    '~/assets/styles/global.css',
    '~/assets/styles/app.css',
    '~/assets/styles/katex.css',
    '~/assets/styles/markdown.css',
  ],
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,       // include h1, h2, h3
          searchDepth: 3, // search up to 3 levels deep for headings
        },
        // remark-math parses $...$ and $$...$$ syntax into math AST nodes
        remarkPlugins: { 'remark-math': {} },
        // rehype-katex renders the math nodes to HTML using KaTeX
        rehypePlugins: { 'rehype-katex': {} },
        highlight: {
          theme: 'github-dark',
          preload: ['ts', 'js', 'vue', 'json', 'bash', 'html', 'css', 'python'],
        },
      },
    },
  },
  components: [
    {
      // 修改路径呈现形式,不添加路径前缀
      path: '~/components',
      pathPrefix: false,
    },
  ],
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },

  },
  debug: true,
  compatibilityDate: '2024-04-03',
})
