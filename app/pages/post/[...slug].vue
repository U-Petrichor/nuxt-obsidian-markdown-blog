<script setup lang="ts">
import { useArticleProgressState } from '~/composables/useArticleProgressState'

definePageMeta({
  layout: 'article',
})

const route = useRoute()
const { setArticleProgress } = useArticleProgressState()

// Extract slug from catch-all route params: /post/my-article → slug = 'my-article'
const articleSlug = computed(() => {
  const raw = route.params.slug
  const parts = Array.isArray(raw) ? raw : [raw]
  return parts[parts.length - 1] ?? ''
})

// =====================
// 文章数据（Data-Driven: query by frontmatter slug field）
// =====================
const { data: page, status: pageStatus } = await useAsyncData(
  () => `post-page-${articleSlug.value}`,
  () => queryCollection('content').where('slug', '=', articleSlug.value).first(),
  {
    watch: [articleSlug],
  }
)

const resolvedPage = computed(() => page.value as any)

const isLoading = computed(() => pageStatus.value === 'pending')

// =====================
// 阅读进度 (已修复生命周期陷阱)
// =====================
// 使用更精确的 watch 替代 watchEffect，确保依赖明确
watch(
  [() => resolvedPage.value, () => route.path],
  ([newPage, path]) => {
    if (newPage) {
      setArticleProgress({
        path: path as string,
        title: newPage.title,
        links: newPage.body?.toc?.links || [],
      })
    }
  },
  { immediate: true, deep: true } // immediate 确保刷新时立即同步一次
)

// ⚠️ 彻底删除了 onBeforeUnmount 里的 resetArticleProgress！
// 原因：离开文章去别的页面时，Layout 会发生切换，RightSidebar 会被销毁，不需要手动清空。
// 如果是在文章间跳转，上面的 watch 会自动用新文章的数据覆盖旧数据。
// 删除它可以完美避开 Nuxt 的 Suspense 幽灵卸载 Bug。

// =====================
// 404 处理
// =====================
// Only throw after a completed fetch (status === 'success') that returned no data.
// Watching pageStatus avoids false 404s during 'idle' or 'pending' transient states
// that occur on browser-back navigation or mid-flight key changes.
watch(
  pageStatus,
  () => {
    if (pageStatus.value === 'success' && !resolvedPage.value) {
      throw createError({ statusCode: 404, statusMessage: 'Page not found' })
    }
  },
  { immediate: true }
)
</script>

<template>
  <AppMarkdownReader
    :page="resolvedPage"
    :loading="isLoading"
  />
</template>