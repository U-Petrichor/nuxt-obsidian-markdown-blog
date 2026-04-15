<script setup lang="ts">
const props = defineProps<{
  type?: string
  title?: string
}>()

const isOpen = ref(true)

interface CalloutStyle {
  bg: string
  border: string
  icon: string
}

const DEFAULT_STYLE: CalloutStyle = {
  bg: 'var(--md-callout-info-bg)',
  border: 'var(--md-callout-info-border)',
  icon: 'ℹ',
}

const typeMap: Record<string, CalloutStyle> = {
  info:    { bg: 'var(--md-callout-info-bg)',    border: 'var(--md-callout-info-border)',    icon: 'ℹ' },
  tip:     { bg: 'var(--md-callout-success-bg)', border: 'var(--md-callout-success-border)', icon: '💡' },
  note:    { bg: 'var(--md-callout-info-bg)',    border: 'var(--md-callout-info-border)',    icon: '📝' },
  warning: { bg: 'var(--md-callout-warning-bg)', border: 'var(--md-callout-warning-border)', icon: '⚠' },
  caution: { bg: 'var(--md-callout-warning-bg)', border: 'var(--md-callout-warning-border)', icon: '⚠' },
  danger:  { bg: 'var(--md-callout-danger-bg)',  border: 'var(--md-callout-danger-border)',  icon: '✖' },
  error:   { bg: 'var(--md-callout-danger-bg)',  border: 'var(--md-callout-danger-border)',  icon: '✖' },
  success: { bg: 'var(--md-callout-success-bg)', border: 'var(--md-callout-success-border)', icon: '✓' },
}

const calloutStyle = computed(() => {
  const t = (props.type ?? 'info').toLowerCase()
  const m: CalloutStyle = typeMap[t] ?? DEFAULT_STYLE
  return {
    '--callout-bg': m.bg,
    '--callout-border': m.border,
  }
})

const calloutIcon = computed(() => {
  const t = (props.type ?? 'info').toLowerCase()
  return (typeMap[t] ?? DEFAULT_STYLE).icon
})
</script>

<template>
  <div class="callout" :style="calloutStyle" :data-type="type">
    <div class="callout-header" @click="isOpen = !isOpen">
      <span class="callout-icon" aria-hidden="true">{{ calloutIcon }}</span>
      <span class="callout-title">{{ title }}</span>
      <span class="callout-toggle" :class="{ 'is-closed': !isOpen }" aria-hidden="true">▾</span>
    </div>
    <div v-if="isOpen" class="callout-body">
      <!-- ContentSlot ensures the inner markdown goes through the full render pipeline,
           not rendered as raw plain text. unwrap="p" removes the wrapping <p> from
           single-paragraph content for cleaner output. -->
      <ContentSlot :use="$slots.default" unwrap="p" />
    </div>
  </div>
</template>

<style scoped>
.callout {
  margin: 1.25rem 0;
  border-left: 4px solid var(--callout-border);
  background: var(--callout-bg);
  border-radius: 0.375rem;
  overflow: hidden;
}

.callout-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  cursor: pointer;
  user-select: none;
}

.callout-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.callout-title {
  flex: 1;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--callout-border);
}

.callout-toggle {
  font-size: 0.85rem;
  color: var(--callout-border);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.callout-toggle.is-closed {
  transform: rotate(-90deg);
}

.callout-body {
  padding: 0.25rem 0.875rem 0.75rem;
}

/* Prevent double-margin on the first child inside the body */
.callout-body :deep(> :first-child) {
  margin-top: 0;
}

.callout-body :deep(> :last-child) {
  margin-bottom: 0;
}
</style>
