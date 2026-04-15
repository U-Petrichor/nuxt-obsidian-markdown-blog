<script setup lang="ts">
// ✅ 不再依赖 ContentPage
interface MarkdownPage {
  title?: string
  body?: {
    toc?: {
      links?: any[]
    }
  }
  [key: string]: any
}

interface MarkdownReaderProps {
  page: MarkdownPage | null | undefined
  loading?: boolean
}

const props = withDefaults(defineProps<MarkdownReaderProps>(), {
  loading: false,
})

const isDev = import.meta.dev
</script>

<template>
  <NuxtErrorBoundary>

    <!-- loading -->
    <div v-if="props.loading" class="markdown-container">
      <div class="markdown-loading">
        <div class="loading-container">
          <div class="loading-spinner" />
          <p class="loading-text">正在加载内容...</p>
        </div>
      </div>
    </div>

    <!-- empty -->
    <div v-else-if="!props.page" class="markdown-container">
      <div class="markdown-empty">
        <div class="empty-container">
          <h2 class="empty-title">暂无内容</h2>
          <p class="empty-message">当前页面没有可显示的内容。</p>
        </div>
      </div>
    </div>

    <!-- content -->
    <div v-else class="markdown-container">
      <ContentRenderer :value="props.page" />
    </div>

    <!-- error -->
    <template #error="{ error, clearError }">
      <div class="markdown-error">
        <div class="error-container">
          <h2 class="error-title">内容渲染失败</h2>
          <p class="error-message">
            抱歉，当前内容无法正常显示。Markdown 解析可能存在语法错误。
          </p>

          <div v-if="isDev" class="error-details">
            {{ error.message }}
          </div>

          <button @click="clearError()" class="retry-button">
            尝试重新加载
          </button>
        </div>
      </div>
    </template>

  </NuxtErrorBoundary>
</template>

<style scoped src="~/assets/styles/components/app-markdown-reader.css"></style>
