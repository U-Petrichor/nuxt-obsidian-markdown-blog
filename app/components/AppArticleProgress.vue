<script setup lang="ts">
type TocLink = {
  id?: string
  text?: string
  depth?: number
  children?: TocLink[]
}

const props = defineProps<{
  title?: string
  links?: TocLink[]
}>()

const flattenLinks = (links: TocLink[] = []): TocLink[] => {
  return links.flatMap(link => {
    const children = flattenLinks(link.children || [])
    return [link, ...children]
  }).filter(link => link.id && link.text)
}

const flatLinks = computed(() => flattenLinks(props.links || []))
const activeId = ref('')

let observer: IntersectionObserver | null = null
// 新增：用于记录重试的定时器，防止用户快速来回切换导致内存泄漏
let retryTimeout: ReturnType<typeof setTimeout> | null = null 

// 新增参数 retryCount，限制最大重试次数，防止死循环
const setupObserver = (retryCount = 0) => {
  // 1. 清理上一次可能遗留的重试任务
  if (retryTimeout) {
    clearTimeout(retryTimeout)
    retryTimeout = null
  }

  // 2. 清理旧的观察器
  if (observer) {
    observer.disconnect()
    observer = null
  }

  if (!import.meta.client || !flatLinks.value.length) {
    return
  }

  activeId.value = flatLinks.value[0]?.id || ''

  // 3. 创建新的观察器
  observer = new IntersectionObserver(
    (entries) => {
      // 收集当前进入视口的所有标题
      const intersecting = entries.filter(e => e.isIntersecting).map(e => e.target.id)

      if (intersecting.length > 0) {
        // 按照目录原本的顺序，挑出第一个出现的标题
        const first = flatLinks.value.find(link => link.id && intersecting.includes(link.id))
        if (first?.id) {
          activeId.value = first.id
        }
      }
    },
    {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0,
    },
  )

  let missingElements = false

  // 4. 开始绑定 DOM 元素
  flatLinks.value.forEach(link => {
    const el = document.getElementById(link.id || '')
    if (el) {
      observer!.observe(el)
    } else {
      missingElements = true // 发现有标题还没渲染出来！
    }
  })

  // 5. 核心修复逻辑：延迟重试机制
  // 如果发现有元素丢失，并且重试次数小于 4 次（最多等 400ms）
  if (missingElements && retryCount < 4) {
    console.warn(`[TOC] 标题 DOM 未就绪，100ms 后进行第 ${retryCount + 1} 次重试...`)
    retryTimeout = setTimeout(() => {
      setupObserver(retryCount + 1) // 递归重试
    }, 100)
  }
}

// 首次挂载时执行
onMounted(() => {
  setupObserver()
})

// 当目录数据（即系列内的文章）发生切换时执行
watch(flatLinks, () => {
  setupObserver()
}, { flush: 'post' })

const scrollToHeading = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div v-if="flatLinks.length" class="article-progress">
    <p class="progress-kicker">
      阅读进度
    </p>
    <h2 class="progress-title">
      {{ title }}
    </h2>

    <nav class="progress-nav">
      <a
        v-for="link in flatLinks"
        :key="link.id"
        :href="`#${link.id}`"
        class="progress-link"
        :class="[{ active: link.id === activeId }, `depth-${link.depth ?? 2}`]"
        @click.prevent="scrollToHeading(link.id || '')"
      >
        <span class="progress-dot" />
        <span>{{ link.text }}</span>
      </a>
    </nav>
  </div>
</template>

<style scoped src="~/assets/styles/components/app-article-progress.css"></style>
