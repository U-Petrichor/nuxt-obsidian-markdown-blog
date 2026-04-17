<script setup lang="ts">
// Disable attribute inheritance on root so $attrs (language-*, etc.) go to <pre>
defineOptions({ inheritAttrs: false })

defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
}>()

const containerRef = ref<HTMLElement | null>(null)
const copied = ref(false)

const copyCode = async () => {
  if (!containerRef.value) return
  // IMPORTANT: query the DOM for the <code> element and use innerText, NOT
  // slot.innerText — the slot value contains raw HTML tags from Shiki's output.
  const codeEl = containerRef.value.querySelector('code')
  if (!codeEl) return
  await navigator.clipboard.writeText(codeEl.innerText)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div ref="containerRef" class="prose-pre-wrapper">
    <div v-if="filename" class="prose-pre-filename">{{ filename }}</div>
    <button
      class="prose-pre-copy"
      :aria-label="copied ? 'Copied!' : 'Copy code'"
      @click="copyCode"
    >
      {{ copied ? '✓ Copied' : 'Copy' }}
    </button>
    <!-- v-bind="$attrs" passes language class and other attrs to <pre> -->
    <pre v-bind="$attrs"><slot /></pre>
  </div>
</template>

<style scoped>
.prose-pre-wrapper {
  position: relative;
  margin: 1rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--md-code-bg);
  color: var(--md-code-color);
}

.prose-pre-filename {
  padding: 0.3rem 1rem;
  background: rgba(0, 0, 0, 0.45);
  color: var(--md-code-color, #e5e7eb);
  font-size: 0.78rem;
  font-family: "Cascadia Code", "Fira Code", monospace;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.prose-pre-copy {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.2rem 0.6rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.3rem;
  color: var(--md-code-color, #e5e7eb);
  font-size: 0.72rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  z-index: 1;
}

.prose-pre-copy:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.28);
}

pre {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  border-radius: 0;
  background: transparent !important; /* 让父容器的变量背景透过来，或者直接在这里使用变量 */
  color: inherit !important;
}
</style>
