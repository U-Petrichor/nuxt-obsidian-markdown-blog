<script setup lang="ts">
import type { SeriesConfig } from '~/utils/series'

const props = defineProps<{
  currentSeries: SeriesConfig | undefined
  currentPath: string
  showSidebarToggle: boolean
}>()

const COMPACT_SIDEBAR_BREAKPOINT = 1320

const isCompactSidebar = ref(false)
const isSidebarDrawerOpen = ref(false)

let resizeFrameId: number | null = null

const applySidebarMode = () => {
  isCompactSidebar.value = window.innerWidth <= COMPACT_SIDEBAR_BREAKPOINT

  if (!isCompactSidebar.value) {
    isSidebarDrawerOpen.value = false
  }
}

const updateSidebarMode = () => {
  if (!import.meta.client) {
    return
  }

  if (resizeFrameId !== null) {
    return
  }

  resizeFrameId = window.requestAnimationFrame(() => {
    resizeFrameId = null
    applySidebarMode()
  })
}

const toggleSidebarDrawer = () => {
  isSidebarDrawerOpen.value = !isSidebarDrawerOpen.value
}

watch(() => props.currentPath, () => {
  isSidebarDrawerOpen.value = false
})

onMounted(() => {
  updateSidebarMode()
  window.addEventListener('resize', updateSidebarMode, { passive: true })
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }

  window.removeEventListener('resize', updateSidebarMode)

  if (resizeFrameId !== null) {
    window.cancelAnimationFrame(resizeFrameId)
    resizeFrameId = null
  }
})
</script>

<template>
  <button
    v-if="showSidebarToggle"
    class="sidebar-toggle"
    :class="{ compact: isCompactSidebar, open: isSidebarDrawerOpen }"
    type="button"
    @click="toggleSidebarDrawer"
  >
    {{ isSidebarDrawerOpen ? '‹' : '›' }}
  </button>

  <div
    v-if="showSidebarToggle"
    class="sidebar-backdrop"
    :class="{ visible: isCompactSidebar && isSidebarDrawerOpen }"
    @click="isSidebarDrawerOpen = false"
  />

  <aside
    v-if="currentSeries"
    class="sidebar"
    :class="{
      compact: isCompactSidebar,
      open: isSidebarDrawerOpen,
    }"
  >
    <p class="sidebar-kicker">
      {{ currentSeries.icon }}
    </p>
    <p class="sidebar-title">
      {{ currentSeries.title }}
    </p>
    <p class="sidebar-summary">
      {{ currentSeries.description }}
    </p>

    <!-- ✅ 修复点 -->
    <DocsNav
      :items="currentSeries.sidebar"
      :current-path="currentPath"
    />
  </aside>
</template>

<style scoped>
.sidebar {
  align-self: start;
  position: sticky;
  top: 7.5rem;
  width: 260px;
  box-sizing: border-box;
  padding: 1.15rem;
  background: var(--surface-strong);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  box-shadow: 0 10px 30px var(--shadow-color);
  transition:
    transform 0.3s ease,
    opacity 0.3s ease,
    box-shadow 0.3s ease,
    visibility 0.3s ease;
}

.sidebar-kicker {
  margin: 0 0 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--sidebar-kicker);
}

.sidebar-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.sidebar-summary {
  margin: 0.75rem 0 1rem;
  color: var(--text-secondary);
  font-size: 0.92rem;
}

.sidebar-toggle {
  position: fixed;
  left: max(0.75rem, calc((100vw - 1360px) / 2 + 0.25rem));
  top: 50%;
  z-index: 12;
  width: 2.4rem;
  height: 3.25rem;
  border: 1px solid var(--border-color);
  border-left: 0;
  border-radius: 0 999px 999px 0;
  background: var(--surface-strong);
  color: var(--text-primary);
  box-shadow: 0 10px 30px var(--shadow-color);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%);
  transition:
    left 0.3s ease,
    transform 0.3s ease,
    opacity 0.2s ease;
}

.sidebar-toggle.compact {
  opacity: 1;
  pointer-events: auto;
}

.sidebar-toggle.open {
  left: min(calc(100vw - 3rem), max(15.5rem, calc((100vw - 1360px) / 2 + 16rem)));
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10;
  background: rgba(2, 6, 23, 0.34);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.24s ease, visibility 0.24s ease;
}

.sidebar-backdrop.visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

@media (max-width: 1320px) {
  .sidebar.compact {
    position: fixed;
    left: max(0.75rem, calc((100vw - 1360px) / 2 + 0.25rem));
    top: 6.25rem;
    bottom: 1rem;
    z-index: 11;
    overflow-y: auto;
    opacity: 0;
    pointer-events: none;
    transform: translateX(calc(-100% - 0.5rem));
  }

  .sidebar.compact.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
  }
}
</style>