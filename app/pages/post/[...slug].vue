<script setup lang="ts">
import { useArticleProgressState } from '~/composables/useArticleProgressState'

definePageMeta({
  layout: 'article',
})

const route = useRoute()
const { setArticleProgress, resetArticleProgress } = useArticleProgressState()

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
// 阅读进度
// =====================
// watchEffect tracks BOTH resolvedPage AND route.path as reactive dependencies.
// When navigating back to a cached article, useAsyncData returns the same cached
// object reference — a plain watch(resolvedPage) would not fire because === hasn't
// changed. route.path always changes on every navigation, so watchEffect is
// guaranteed to re-run and push fresh TOC data to the right sidebar.
watchEffect(() => {
  const newPage = resolvedPage.value
  const path = route.path // explicitly tracked
  if (newPage) {
    setArticleProgress({
      path,
      title: newPage.title,
      links: newPage.body?.toc?.links || [],
    })
  }
})

onBeforeUnmount(() => {
  resetArticleProgress()
})

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