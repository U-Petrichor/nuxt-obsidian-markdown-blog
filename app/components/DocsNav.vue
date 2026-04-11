<script setup lang="ts">
type NavItem = {
  title?: string
  path?: string
  children?: NavItem[]
}

const isActivePath = (itemPath?: string, currentPath?: string) => {
  if (!itemPath || !currentPath) {
    return false
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
}

defineProps<{
  items: NavItem[]
  currentPath: string
}>()
</script>

<template>
  <ul class="nav-list">
    <li
      v-for="item in items"
      :key="item.path || item.title"
      class="nav-item"
    >
      <NuxtLink
        v-if="item.path"
        :to="item.path"
        class="nav-link"
        :class="{ active: isActivePath(item.path, currentPath) }"
      >
        {{ item.title || item.path }}
      </NuxtLink>
      <p v-else class="nav-group">
        {{ item.title }}
      </p>

      <DocsNav
        v-if="item.children?.length"
        :items="item.children"
        :current-path="currentPath"
      />
    </li>
  </ul>
</template>

<style scoped src="~/assets/styles/components/docs-nav.css"></style>
