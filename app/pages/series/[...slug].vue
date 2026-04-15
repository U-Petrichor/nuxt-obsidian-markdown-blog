<script setup lang="ts">
import { getSeries } from '~/utils/series'
import { useArticleProgressState } from '~/composables/useArticleProgressState'

definePageMeta({
  layout: 'series',
})

const route = useRoute()
const { setArticleProgress, resetArticleProgress } = useArticleProgressState()

// Route: /series/[seriesKey]/[articleSlug]
// route.params.slug is a string[] catch-all, e.g. ['blog-settings', 'series-article']
const slugParts = computed(() => {
  const raw = route.params.slug
  return Array.isArray(raw) ? raw : [raw]
})

// First segment is always the series key
const seriesKey = computed(() => slugParts.value[0] ?? null)

// Second segment (if present) is the article slug; absent on series-root pages
const articleSlug = computed(() => slugParts.value[1] ?? null)

// =====================
// 文章数据（Data-Driven: query by frontmatter slug or series field）
// =====================
const { data: page, status: pageStatus } = await useAsyncData(
  () => `series-page-${seriesKey.value}-${articleSlug.value}`,
  async () => {
    if (articleSlug.value) {
      // Series article: match by slug frontmatter field
      return queryCollection('content')
        .where('slug', '=', articleSlug.value)
        .where('series', '=', seriesKey.value!)
        .first()
    }
    else {
      // Series root: match by series + kind = 'series-root'
      return queryCollection('content')
        .where('series', '=', seriesKey.value!)
        .where('kind', '=', 'series-root')
        .first()
    }
  },
  {
    watch: [seriesKey, articleSlug],
  },
)

// =====================
// 系列数据（cached via useState in layout; also needed here for 404 guard）
// =====================
const { data: currentSeries, status: seriesStatus } = await useAsyncData(
  () => `series-sidebar-${seriesKey.value || 'none'}`,
  async () => {
    if (!seriesKey.value) return null
    return await getSeries(seriesKey.value)
  },
  {
    watch: [seriesKey],
  },
)

const resolvedPage = computed(() => page.value as any)

const isLoading = computed(() => pageStatus.value === 'pending')
const isSeriesLoading = computed(() => seriesStatus.value === 'pending')

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
// 原因：离开系列文章去别的页面时，Layout 会发生切换，RightSidebar 会被销毁，不需要手动清空。
// 如果是在系列内跳转，上面的 watch 会自动用新文章的数据覆盖旧数据。
// 删除它可以完美避开 Nuxt 的 Suspense 幽灵卸载 Bug。


// =====================
// 404 处理 (已修复未捕获的 Promise 异常)
// =====================
watch(
  [pageStatus, seriesStatus],
  () => {
    if (pageStatus.value === 'success' && !resolvedPage.value) {
      // 必须使用 showError 替代 throw createError
      showError({ statusCode: 404, statusMessage: 'Page not found' })
    }

    if (seriesKey.value && seriesStatus.value === 'success' && !currentSeries.value) {
      showError({ statusCode: 404, statusMessage: 'Series not found' })
    }
  },
  { immediate: true },
)
</script>

<template>
  <AppMarkdownReader
    :page="resolvedPage"
    :loading="isLoading"
  />
</template>
