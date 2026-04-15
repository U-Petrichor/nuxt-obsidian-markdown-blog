<script setup lang="ts">
import { getSeries } from '~/utils/series'
import type { SeriesConfig } from '~/utils/series'

const route = useRoute()

/**
 * 1. 提取当前所属的系列唯一标识符 (seriesKey)
 * * 假设你的文件路由是 /pages/series/[...slug].vue (Catch-all 路由)
 * 当访问 /series/vue-tutorial/chapter-1 时：
 * route.params.slug 将是一个数组: ['vue-tutorial', 'chapter-1']
 * 我们只需要第一项 'vue-tutorial' 作为系列的 Key，用来请求该系列下的文章列表。
 */
const seriesKey = computed(() => {
  const raw = route.params.slug
  // 兼容处理：确保 raw 被转换为数组，即便它只是一个普通字符串
  const parts = Array.isArray(raw) ? raw : [raw]
  // 返回数组的第一项（系列名），如果没有则返回 null , ?? 类似 ||， 当左侧为null或者undefined时返回右侧，而||是左侧为false，略有区别
  return parts[0] ?? null
})

/**
 * 2. 系列数据缓存层 (seriesCache)
 * * 使用 useState 是 Nuxt 中跨组件/跨页面共享状态的标准做法，它在 SSR 和 CSR 间同步。
 * 作用：当你在同一个系列内的不同文章间跳转时（比如从第一章跳到第二章），
 * 因为系列的大纲（左侧边栏内容）没变，所以不需要重新向服务器/Content模块发请求。
 * 这极大地提升了页面的响应速度。
 */
const seriesCache = useState<Record<string, SeriesConfig>>('series-cache', () => ({}))

/**
 * 3. 获取当前系列的数据
 * * useAsyncData 是 Nuxt 核心的数据获取钩子。
 * 第一个参数是唯一的 Key。注意这里动态绑定了 seriesKey.value。
 */
const { data: currentSeries } = await useAsyncData(
  () => `series-layout-${seriesKey.value || 'none'}`,
  async () => {
    // 保护机制：如果没有读取到 seriesKey，直接中止请求
    if (!seriesKey.value) return null
    
    // 缓存命中检查：如果 useState 里已经有这个系列的数据了，直接返回缓存
    if (seriesCache.value[seriesKey.value]) {
      return seriesCache.value[seriesKey.value]
    }
    
    // 缓存未命中：调用外部工具函数发起实际的请求，获取大纲/系列配置
    const result = await getSeries(seriesKey.value)
    
    // 如果获取成功，将其存入缓存供下次使用
    if (result) {
      seriesCache.value[seriesKey.value] = result
    }
    return result
  },
  {
    // 监听器：当 seriesKey 发生变化时（比如用户从 Vue 系列跳到了 React 系列），
    // 强制 useAsyncData 重新执行上面的获取逻辑。
    watch: [seriesKey],
  },
)
</script>

<template>
  <div
    class="app-layout series-layout has-left-sidebar has-right-sidebar"
    :class="currentSeries?.key"
  >
    <AppLeftSidebar
      :current-series="currentSeries || undefined"
      :current-path="route.path"
      :show-sidebar-toggle="Boolean(currentSeries)"
    />

    <main class="content-area">
      <slot />
    </main>

    <AppRightSidebar class="progress-sidebar" />
  </div>
</template>