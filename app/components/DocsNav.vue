<script setup lang="ts">
import type { SeriesNavItem } from '~/utils/series'

// ✅ 类型守卫：判断是不是链接
const isLinkItem = (
  item: SeriesNavItem,
): item is { title: string; path: string } => {
  return 'path' in item
}

// ✅ 类型守卫：判断是不是分组
const isGroupItem = (
  item: SeriesNavItem,
): item is { title: string; children: { title: string; path: string }[] } => {
  return 'children' in item
}

// ✅ 路径激活判断
const isActivePath = (itemPath?: string, currentPath?: string) => {
  if (!itemPath || !currentPath) return false
  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
}

defineProps<{
  items: SeriesNavItem[]
  currentPath: string
}>()
</script>

<template>
  <ul class="nav-list">
    <li
      v-for="item in items"
      :key="isLinkItem(item) ? item.path : item.title"
      class="nav-item"
    >
      <!-- ✅ 链接 -->
      <NuxtLink
        v-if="isLinkItem(item)"
        :to="item.path"
        class="nav-link"
        :class="{ active: isActivePath(item.path, currentPath) }"
      >
        {{ item.title }}
      </NuxtLink>

      <!-- ✅ 分组标题 -->
      <p v-else class="nav-group">
        {{ item.title }}
      </p>

      <!-- ✅ 子节点 -->
      <DocsNav
        v-if="isGroupItem(item) && item.children.length"
        :items="item.children"
        :current-path="currentPath"
      />
    </li>
  </ul>
</template>

<style scoped src="~/assets/styles/components/docs-nav.css"></style>