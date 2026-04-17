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
    '~/assets/styles/markdown-core.css',
    '~/assets/styles/themes/light.css',
    '~/assets/styles/themes/dark.css',
    '~/assets/styles/themes/nord.css',
    '~/assets/styles/themes/custom.css',
  ],
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,       // 提取h1,h2,h3标题作为侧边进度栏
          searchDepth: 3, // 搜索深度为3，即提取h1,h2,h3标题
        },
        contentHeading: false, // 不提取h1标题作为文章标题
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
