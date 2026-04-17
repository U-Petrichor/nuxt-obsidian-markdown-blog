<script setup lang="ts">
import { getSeries } from '~/utils/series'
import { type MarkdownTheme, themeOptions } from '~/types/theme'

const route = useRoute()

// ✅ 使用 cookie 管理主题，确保 SSR 一致性
const theme = useCookie<MarkdownTheme>('markdown-theme', {
  default: () => 'dark',
  maxAge: 60 * 60 * 24 * 365,
})

const navItems = [
  { label: '首页', to: '/' },
  { label: 'TempA', to: '/temp-a' },
  { label: 'TempB', to: '/temp-b' },
  { label: 'TempC', to: '/temp-c' },
]

// Derive series key from catch-all slug param when on a /series/... route
const seriesKey = computed(() => {
  if (!route.path.startsWith('/series/')) return null
  const raw = route.params.slug
  const parts = Array.isArray(raw) ? raw : [raw]
  return typeof parts[0] === 'string' && parts[0] ? parts[0] : null
})

// ✅ 使用新 API：getSeries
const { data: currentSeries } = await useAsyncData(
  () => `app-header-series-${seriesKey.value || 'none'}`,
  async () => {
    if (!seriesKey.value) return null
    return await getSeries(seriesKey.value)
  },
  {
    watch: [seriesKey],
  },
)

// ✅ 首页 vs 文档页判断
const shouldUseDocsHeader = computed(() => route.path !== '/')

// =====================
// 主题逻辑
// =====================
const isThemeMenuOpen = ref(false)
const themeMenuRef = ref<HTMLElement | null>(null)

const applyTheme = (mode: MarkdownTheme) => {
  if (!import.meta.client) return
  document.documentElement.dataset.theme = mode
}

const toggleThemeMenu = (event: Event) => {
  event.stopPropagation()
  isThemeMenuOpen.value = !isThemeMenuOpen.value
}

const selectTheme = (mode: MarkdownTheme) => {
  theme.value = mode
  isThemeMenuOpen.value = false
}

const closeThemeMenu = (event: MouseEvent) => {
  if (themeMenuRef.value && !themeMenuRef.value.contains(event.target as Node)) {
    isThemeMenuOpen.value = false
  }
}

const currentThemeLabel = computed(() => {
  return themeOptions.find(opt => opt.value === theme.value)?.label || '主题'
})

watch(theme, (newTheme) => {
  applyTheme(newTheme)
}, { immediate: true })

// ✅ 主题初始化
onMounted(() => {
  if (import.meta.client) {
    applyTheme(theme.value)
    window.addEventListener('click', closeThemeMenu)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('click', closeThemeMenu)
  }
})

// =====================
// 导航高亮
// =====================
const isActiveLink = (routePath: string, targetPath: string) => {
  if (targetPath === '/') {
    return routePath === '/'
  }
  return routePath === targetPath || routePath.startsWith(`${targetPath}/`)
}
</script>

<template>
  <header
    class="app-header"
    :class="{
      'docs-header': shouldUseDocsHeader,
    }"
  >
    <div>
      <NuxtLink to="/" class="brand">
        Petrichor
      </NuxtLink>

      <p class="tagline">
        {{
          currentSeries?.description ||
          '首页负责建立第一印象，每个系列负责独立承载自己的内容。'
        }}
      </p>
    </div>

    <nav class="header-nav">
      <NuxtLink
        to="/"
        class="header-link"
        :class="{ active: route.path === '/' }"
      >
        首页
      </NuxtLink>

      <NuxtLink
        v-for="item in navItems.slice(1)"
        :key="item.to"
        :to="item.to"
        class="header-link"
        :class="{ active: isActiveLink(route.path, item.to) }"
      >
        {{ item.label }}
      </NuxtLink>

      <div class="theme-dropdown" ref="themeMenuRef">
        <button class="theme-toggle" type="button" @click="toggleThemeMenu">
          {{ currentThemeLabel }}
          <span class="dropdown-arrow" :class="{ 'is-active': isThemeMenuOpen }">▾</span>
        </button>

        <Transition name="fade-slide">
          <div v-if="isThemeMenuOpen" class="theme-menu">
            <button
              v-for="opt in themeOptions"
              :key="opt.value"
              class="theme-menu-item"
              :class="{ active: theme === opt.value }"
              @click="selectTheme(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </Transition>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--surface);
  backdrop-filter: blur(14px);
}

.docs-header {
  box-shadow: 0 8px 30px var(--shadow-color);
}

.brand {
  display: inline-block;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
}

.tagline {
  margin: 0.35rem 0 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-link {
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  color: var(--text-secondary);
  font-weight: 600;
}

.header-link:hover {
  text-decoration: none;
  background: var(--header-hover);
}

.header-link.active {
  background: var(--header-active-bg);
  color: var(--header-active-text);
}

.theme-toggle {
  padding: 0.55rem 0.95rem;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--surface-strong);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.theme-dropdown {
  position: relative;
}

.dropdown-arrow {
  display: inline-block;
  transition: transform 0.2s ease;
  font-size: 0.8rem;
  opacity: 0.7;
}

.dropdown-arrow.is-active {
  transform: rotate(180deg);
}

.theme-menu {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  min-width: 120px;
  padding: 0.5rem;
  background: var(--surface-strong);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px var(--shadow-color);
  z-index: 20;
}

.theme-menu-item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.85rem;
  text-align: left;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.theme-menu-item:hover {
  background: var(--header-hover);
  color: var(--text-primary);
}

.theme-menu-item.active {
  background: var(--header-active-bg);
  color: var(--header-active-text);
}

/* Transition styles */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 900px) {
  .app-header {
    padding: 1rem;
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
