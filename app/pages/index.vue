<script setup lang="ts">
import { featuredSeriesArticles, standaloneArticles } from '~/utils/series'

useSeoMeta({
  title: '首页',
  description: 'Petrichor 首站，先展示全屏 Logo，再以下滑方式进入系列文章与独立文章入口。',
})
</script>

<template>
  <AppHomeLanding
    :featured-series-articles="featuredSeriesArticles"
    :standalone-articles="standaloneArticles"
  />
</template>
