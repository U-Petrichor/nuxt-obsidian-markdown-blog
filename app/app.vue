<script setup lang="ts">
import faviconUrl from '~/assets/icons/favicon.ico'
import fontUrl from '~/assets/fonts/ZLabsRoundPix.woff2'
import { useArticleProgressState } from '~/composables/useArticleProgressState'
import { getSeriesByPath } from '~/utils/series'

const route = useRoute()
const themeMode = useState<'light' | 'dark'>('theme-mode', () => 'dark')
const { articleProgress, resetArticleProgress } = useArticleProgressState()
const fontReady = useState('font-ready', () => false)
const isCompactSidebar = ref(false)
const isSidebarDrawerOpen = ref(false)
const isHomePage = computed(() => route.path === '/')
const isMarkdownRoute = computed(() => {
  const slug = route.params.slug

  return Array.isArray(slug) ? slug.length > 0 : typeof slug === 'string' && slug.length > 0
})
const currentSeries = computed(() => getSeriesByPath(route.path))
const shouldUseDocsLayout = computed(() => !isHomePage.value)
const hasArticleProgress = computed(() => articleProgress.value.path === route.path && Boolean(articleProgress.value.links?.length))
const shouldReserveRightSidebar = computed(() => shouldUseDocsLayout.value && isMarkdownRoute.value)
const showSidebarToggle = computed(() => Boolean(currentSeries.value))

const applyTheme = (mode: 'light' | 'dark') => {
  if (!import.meta.client) {
    return
  }

  document.documentElement.dataset.theme = mode
}

const toggleTheme = () => {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
}

const updateSidebarMode = () => {
  if (!import.meta.client) {
    return
  }

  isCompactSidebar.value = window.innerWidth <= 1320
  if (!isCompactSidebar.value) {
    isSidebarDrawerOpen.value = false
  }
}

const toggleSidebarDrawer = () => {
  isSidebarDrawerOpen.value = !isSidebarDrawerOpen.value
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme-mode')
  const htmlElement = window.document.documentElement

  if (savedTheme === 'light' || savedTheme === 'dark') {
    themeMode.value = savedTheme
  }

  applyTheme(themeMode.value)

  if ('fonts' in document) {
    document.fonts.load('1em "ZLabsRoundPix"').finally(() => {
      fontReady.value = true
      htmlElement.dataset.fontReady = 'true'
    })
  }
  else {
    fontReady.value = true
    htmlElement.dataset.fontReady = 'true'
  }

  updateSidebarMode()
  window.addEventListener('resize', updateSidebarMode, { passive: true })
})

watch(() => route.path, () => {
  isSidebarDrawerOpen.value = false
  resetArticleProgress()
})

watch(themeMode, (mode) => {
  if (!import.meta.client) {
    return
  }

  localStorage.setItem('theme-mode', mode)
  applyTheme(mode)
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }

  window.removeEventListener('resize', updateSidebarMode)
})

useSeoMeta({
  titleTemplate: title => title ? `${title} · Petrichor` : 'Petrichor',
  description: '一个兼顾首页展示与 Markdown 文档沉淀的 Nuxt 站点。',
})

useHead({
  link: [
    {
      rel: 'icon',
      href: faviconUrl,
    },
    {
      rel: 'preload',
      href: fontUrl,
      as: 'font',
      type: 'font/woff2',
      crossorigin: '',
    },
  ],
  script: [
    {
      key: 'theme-init',
      innerHTML: `
        try {
          const savedTheme = localStorage.getItem('theme-mode')
          document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark'
        }
        catch {
          document.documentElement.dataset.theme = 'dark'
        }
      `,
    },
    {
      key: 'font-init',
      innerHTML: `
        document.documentElement.dataset.fontReady = 'false'
        if (document.fonts && document.fonts.load) {
          document.fonts.load('1em "ZLabsRoundPix"').finally(function () {
            document.documentElement.dataset.fontReady = 'true'
          })
        } else {
          document.documentElement.dataset.fontReady = 'true'
        }
      `,
    },
  ],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <div class="app-shell" :class="[currentSeries?.accentClass, { 'font-ready': fontReady }]">
    <AppHeader
      :route-path="route.path"
      :current-series="currentSeries"
      :should-use-docs-layout="shouldUseDocsLayout"
      :theme-mode="themeMode"
      @toggle-theme="toggleTheme"
    />

    <main v-if="!shouldUseDocsLayout" class="page-main">
      <NuxtPage />
    </main>

    <template v-else>
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

      <div
        class="app-layout"
        :class="{
          'has-left-sidebar': !!currentSeries,
          'has-right-sidebar': shouldReserveRightSidebar,
          'sidebar-compact-mode': !!currentSeries && isCompactSidebar,
        }"
      >
        <aside
          v-if="currentSeries"
          class="sidebar"
          :class="{
            compact: isCompactSidebar,
            open: isSidebarDrawerOpen,
          }"
        >
          <p class="sidebar-kicker">
            {{ currentSeries.name }}
          </p>
          <p class="sidebar-title">
            {{ currentSeries.navTitle }}
          </p>
          <p class="sidebar-summary">
            {{ currentSeries.summary }}
          </p>
          <DocsNav
            :items="currentSeries.sidebarItems"
            :current-path="route.path"
          />
        </aside>

        <main class="content-area" :class="{ 'without-sidebar': !currentSeries }">
          <NuxtPage />
        </main>

        <AppRightSidebar
          v-if="shouldReserveRightSidebar"
          class="progress-sidebar"
          :class="{ empty: !hasArticleProgress }"
        >
          <AppArticleProgress
            :title="articleProgress.title"
            :links="articleProgress.links"
          />
        </AppRightSidebar>
      </div>
    </template>

    <AppFooter />
  </div>
</template>

<style src="~/assets/styles/app.css"></style>
