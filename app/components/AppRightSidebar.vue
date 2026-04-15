<script setup lang="ts">
const { articleProgress } = useArticleProgressState()

const hasArticleProgress = computed(() => Boolean(articleProgress.value.links?.length))
</script>

<template>
  <aside class="right-sidebar-shell" :class="{ empty: !hasArticleProgress }">
    <AppArticleProgress
      :title="articleProgress.title"
      :links="articleProgress.links"
    />
  </aside>
</template>

<style scoped>
.right-sidebar-shell {
  position: sticky;
  top: 7.5rem;
  align-self: start;
  width: 240px;
  min-width: 0;
  padding: 1.2rem;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  background: var(--surface);
  box-shadow: 0 10px 30px var(--shadow-color);
  transition:
    opacity 0.24s ease,
    transform 0.24s ease,
    width 0.24s ease,
    padding 0.24s ease,
    border-color 0.24s ease,
    margin 0.24s ease;
}

.right-sidebar-shell.empty {
  opacity: 0;
  pointer-events: none;
}
</style>
