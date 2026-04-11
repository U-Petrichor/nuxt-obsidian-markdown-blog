<script setup lang="ts">
import type { SeriesConfig } from '~/utils/series'

const navItems = [
  { label: '首页', to: '/' },
  { label: 'TempA', to: '/temp-a' },
  { label: 'TempB', to: '/temp-b' },
  { label: 'TempC', to: '/temp-c' },
]

const isActiveLink = (routePath: string, targetPath: string) => {
  if (targetPath === '/') {
    return routePath === '/'
  }

  return routePath === targetPath || routePath.startsWith(`${targetPath}/`)
}

defineProps<{
  routePath: string
  currentSeries?: SeriesConfig
  shouldUseDocsLayout: boolean
  themeMode: 'light' | 'dark'
}>()

defineEmits<{
  toggleTheme: []
}>()
</script>

<template>
  <header class="app-header" :class="{ 'docs-header': shouldUseDocsLayout }">
    <div>
      <NuxtLink to="/" class="brand">
        Petrichor
      </NuxtLink>
      <p class="tagline">
        {{ currentSeries?.tagline || '首页负责建立第一印象，每个系列负责独立承载自己的内容。' }}
      </p>
    </div>

    <nav class="header-nav">
      <NuxtLink to="/" class="header-link" :class="{ active: routePath === '/' }">
        首页
      </NuxtLink>
      <NuxtLink
        v-for="item in navItems.slice(1)"
        :key="item.to"
        :to="item.to"
        class="header-link"
        :class="{ active: isActiveLink(routePath, item.to) }"
      >
        {{ item.label }}
      </NuxtLink>
      <button class="theme-toggle" type="button" @click="$emit('toggleTheme')">
        {{ themeMode === 'light' ? '浅色' : '深色' }}
      </button>
    </nav>
  </header>
</template>
