<script setup lang="ts">
import { getSeries } from '~/utils/series'

const route = useRoute()
const themeMode = useState<'light' | 'dark'>('theme-mode', () => 'dark')

const navItems = [
  { label: '首页', to: '/' },
  { label: 'TempA', to: '/temp-a' },
  { label: 'TempB', to: '/temp-b' },
  { label: 'TempC', to: '/temp-c' },
]

// ✅ 主题初始化
onMounted(() => {
  if (import.meta.client) {
    const savedTheme = localStorage.getItem('theme-mode')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      themeMode.value = savedTheme
    }
    applyTheme(themeMode.value)
  }
})

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
const applyTheme = (mode: 'light' | 'dark') => {
  if (!import.meta.client) return
  document.documentElement.dataset.theme = mode
}

const toggleTheme = () => {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
}

watch(themeMode, (mode) => {
  if (!import.meta.client) return
  localStorage.setItem('theme-mode', mode)
  applyTheme(mode)
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

      <button class="theme-toggle" type="button" @click="toggleTheme">
        {{ themeMode === 'light' ? '浅色' : '深色' }}
      </button>
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
}

@media (max-width: 900px) {
  .app-header {
    padding: 1rem;
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
