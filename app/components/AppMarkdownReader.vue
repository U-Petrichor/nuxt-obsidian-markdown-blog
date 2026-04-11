<script setup lang="ts">
import type { ContentPage } from '~/types/content'

/**
 * Markdown 阅读器组件，只负责把已经解析到的数据渲染成正文。
 */
defineProps<{
  page: ContentPage
}>()
</script>

<template>
  <ContentRenderer :value="page" />
</template>
