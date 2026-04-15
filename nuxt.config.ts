// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  css: [
    '~/assets/styles/global.css',
    '~/assets/styles/app.css',
  ],
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
