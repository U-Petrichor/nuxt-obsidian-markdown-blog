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
const preRef = ref<HTMLElement | null>(null)
const copied = ref(false)

// Collapse state
const isCollapsible = ref(false)
const isCollapsed = ref(true)
const collapsedHeightPx = ref<number | null>(null)

const copyCode = async () => {
  if (!containerRef.value) return
  const codeEl = containerRef.value.querySelector('code')
  if (!codeEl) return
  await navigator.clipboard.writeText(codeEl.innerText)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

onMounted(() => {
  if (!preRef.value) return
  const codeEl = preRef.value.querySelector('code')
  if (!codeEl) return

  // Dual strategy: prefer .line spans (Shiki), fallback to innerText (no-language blocks)
  const lineSpans = codeEl.querySelectorAll('.line')
  let lineCount: number
  let lineHeight: number

  if (lineSpans.length > 0) {
    lineCount = lineSpans.length
    lineHeight = (lineSpans[0] as HTMLElement).offsetHeight
  } else {
    const text = codeEl.innerText || ''
    const textLines = text.split('\n')
    lineCount = textLines[textLines.length - 1] === '' ? textLines.length - 1 : textLines.length
    if (lineCount === 0) return
    lineHeight = codeEl.offsetHeight / lineCount
  }

  if (lineCount > 8) {
    isCollapsible.value = true
    const prePaddingTop = parseFloat(getComputedStyle(preRef.value).paddingTop) || 16
    collapsedHeightPx.value = 8 * lineHeight + prePaddingTop
    // Apply collapsed state immediately to avoid flash of full content
    preRef.value.style.maxHeight = `${collapsedHeightPx.value}px`
  }
})

const toggleCollapse = () => {
  if (!isCollapsible.value || !preRef.value || collapsedHeightPx.value === null) return

  if (isCollapsed.value) {
    // Expanding: animate from collapsed height to full height
    const scrollH = preRef.value.scrollHeight
    preRef.value.style.maxHeight = `${collapsedHeightPx.value}px`
    preRef.value.offsetHeight // force reflow
    preRef.value.style.maxHeight = `${scrollH}px`
    isCollapsed.value = false
    const onEnd = () => {
      if (!isCollapsed.value && preRef.value) {
        preRef.value.style.maxHeight = 'none'
      }
      preRef.value?.removeEventListener('transitionend', onEnd)
    }
    preRef.value.addEventListener('transitionend', onEnd)
  } else {
    // Collapsing: set to current height first, then animate to collapsed
    const scrollH = preRef.value.scrollHeight
    preRef.value.style.maxHeight = `${scrollH}px`
    preRef.value.offsetHeight // force reflow
    preRef.value.style.maxHeight = `${collapsedHeightPx.value}px`
    isCollapsed.value = true
  }
}
</script>

<template>
  <div
    ref="containerRef"
    class="prose-pre-wrapper"
    :class="{
      'is-collapsible': isCollapsible,
      'is-collapsed': isCollapsible && isCollapsed,
    }"
  >
    <div v-if="filename" class="prose-pre-filename">{{ filename }}</div>

    <!-- Top-right action buttons -->
    <div class="prose-pre-actions">
      <button
        v-if="isCollapsible && !isCollapsed"
        class="prose-pre-collapse-btn"
        aria-label="Collapse code"
        @click="toggleCollapse"
      >
        ▲ 收起
      </button>
      <button
        class="prose-pre-copy"
        :aria-label="copied ? 'Copied!' : 'Copy code'"
        @click="copyCode"
      >
        {{ copied ? '✓ Copied' : 'Copy' }}
      </button>
    </div>

    <!-- v-bind="$attrs" passes language class and other attrs to <pre> -->
    <pre ref="preRef" v-bind="$attrs"><slot /></pre>

    <!-- Gradient overlay: only shown when collapsible AND currently collapsed -->
    <div
      v-if="isCollapsible && isCollapsed"
      class="prose-pre-gradient"
      @click="toggleCollapse"
    />

    <!-- Bottom bar: always present when collapsible -->
    <div
      v-if="isCollapsible"
      class="prose-pre-bar"
      @click="toggleCollapse"
    >
      <span class="prose-pre-bar-arrow">{{ isCollapsed ? '▼' : '▲' }}</span>
    </div>
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

/* Top-right action button group */
.prose-pre-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  z-index: 4;
}

.prose-pre-collapse-btn {
  padding: 0.2rem 0.6rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.3rem;
  color: var(--md-code-color, #e5e7eb);
  font-size: 0.72rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.prose-pre-collapse-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.28);
}

.prose-pre-copy {
  padding: 0.2rem 0.6rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.3rem;
  color: var(--md-code-color, #e5e7eb);
  font-size: 0.72rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
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
  background: transparent !important;
  color: inherit !important;
  transition: max-height 0.35s ease;
}

/* Collapsed: clip vertical overflow */
.prose-pre-wrapper.is-collapsed pre {
  overflow-y: hidden;
}

/* Gradient overlay */
.prose-pre-gradient {
  position: absolute;
  bottom: 1.8rem; /* leave space for the bar */
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 40%,
    rgba(0, 0, 0, 0.7) 100%
  );
  cursor: pointer;
  z-index: 2;
}

/* Bottom bar (base-style strip) */
.prose-pre-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0;
  background: rgba(0, 0, 0, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  z-index: 3;
  transition: background 0.15s ease;
}

.prose-pre-bar:hover {
  background: rgba(0, 0, 0, 0.5);
}

.prose-pre-bar-arrow {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
  transition: color 0.15s ease;
}

.prose-pre-bar:hover .prose-pre-bar-arrow {
  color: rgba(255, 255, 255, 0.9);
}
</style>
