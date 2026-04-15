<script setup lang="ts">
import faviconUrl from '~/assets/icons/favicon.ico' // 导入网站图标路径
import fontUrl from '~/assets/fonts/ZLabsRoundPix.woff2' // 导入自定义像素字体路径

// 设置 SEO 元数据
useSeoMeta({
  titleTemplate: title => title ? `${title} · Petrichor` : 'Petrichor',
  description: '采用Nuxt4+Vue3搭建的个人博客网站，高度支持客制化',
})

/**
 * 使用 Nuxt 全局状态管理字体加载情况。
 * 使用 useState 确保服务器渲染（SSR）和客户端激活（Hydration）之间的状态一致。
 */
const fontReady = useState('font-ready', () => false)


// 向 <head> 注入全局资源和初始化脚本
useHead({
  link: [
    { rel: 'icon', href: faviconUrl },
    // 预加载字体以提升加载优先级
    { rel: 'preload', href: fontUrl, as: 'font', type: 'font/woff2', crossorigin: '' },
  ],
  script: [
    {
      key: 'theme-init',
      // 页面加载瞬间执行：从 localStorage 读取主题，防止主题颜色闪烁
      innerHTML: `
        try {
          const savedTheme = localStorage.getItem('theme-mode')
          document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark'
        } catch {}
      `,
      tagPosition: 'head',
    },
    {
      key: 'font-init',
      // 初始化状态：默认隐藏内容。
      // 显性展示逻辑（dataset.fontReady = 'true'）交给上方的 onMounted 处理，
      // 以确保在内容显示前，Vue 已经完全接管了 DOM。
      innerHTML: `
        document.documentElement.dataset.fontReady = 'false'
      `,
      tagPosition: 'head',
    },
  ],
})

/**
 * 核心逻辑：解决字体加载导致的布局闪烁（FOUC）
 */
onMounted(async () => {
  // 等待文档中引用的所有字体完成加载。
  // document.fonts.ready 返回一个 Promise，当浏览器完成所有 @font-face 资源加载后 resolve。
  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  // 关键点：将逻辑放在 onMounted 内部执行。
  // 这确保了 Vue 已经完成了首次渲染和客户端激活（Hydration）。
  // 只有在 Vue 挂载完成后才将 fontReady 设为 true，从而显示主体内容。
  // 这样可以彻底消除因字体从缓存读取过快，导致在 Vue 激活前就显示了“破碎布局”的问题。
  document.documentElement.dataset.fontReady = 'true'
  fontReady.value = true
})
</script>

<template>
  <NuxtRouteAnnouncer />

  <div class="app-shell" :class="{ 'font-ready': fontReady }">
    <AppHeader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppFooter />
  </div>
</template>