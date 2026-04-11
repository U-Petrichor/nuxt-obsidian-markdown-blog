<script setup lang="ts">
import { findSeriesNavItemByPath } from '~/utils/series'
import { useArticleProgressState } from '~/composables/useArticleProgressState'
import type { ContentPage } from '~/types/content'

const route = useRoute()
const normalizedPath = computed(() => decodeURIComponent(route.path))
const { setArticleProgress, resetArticleProgress } = useArticleProgressState()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(normalizedPath.value).first()
})

const { data: fallbackPage } = await useAsyncData('page-fallback-' + route.path, async () => {
  const navItem = findSeriesNavItemByPath(normalizedPath.value)

  if (!navItem?.title) {
    return null
  }

  return queryCollection('content').where('title', '=', navItem.title).first()
})

const resolvedPage = computed(() => (page.value || fallbackPage.value) as ContentPage | null)

watchEffect(() => {
  setArticleProgress({
    path: route.path,
    title: resolvedPage.value?.title,
    links: resolvedPage.value?.body?.toc?.links || [],
  })
})

onBeforeUnmount(() => {
  resetArticleProgress()
})

if (!resolvedPage.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}
</script>

<template>
  <AppMarkdownReader
    v-if="resolvedPage"
    :page="resolvedPage"
  />
</template>
