<script setup lang="ts">
type TocLink = {
  id?: string
  text?: string
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

const updateActiveId = () => {
  if (!import.meta.client || !flatLinks.value.length) {
    return
  }

  let nextActiveId = flatLinks.value[0]?.id || ''

  for (const link of flatLinks.value) {
    const element = document.getElementById(link.id || '')

    if (!element) {
      continue
    }

    if (element.getBoundingClientRect().top <= 180) {
      nextActiveId = link.id || nextActiveId
    }
  }

  activeId.value = nextActiveId
}

onMounted(() => {
  updateActiveId()
  window.addEventListener('scroll', updateActiveId, { passive: true })
})

watch(flatLinks, async () => {
  await nextTick()
  updateActiveId()
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }

  window.removeEventListener('scroll', updateActiveId)
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
        :class="{ active: link.id === activeId }"
      >
        <span class="progress-dot" />
        <span>{{ link.text }}</span>
      </a>
    </nav>
  </div>
</template>

<style scoped src="~/assets/styles/components/app-article-progress.css"></style>
