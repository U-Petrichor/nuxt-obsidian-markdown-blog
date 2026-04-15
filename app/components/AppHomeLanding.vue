<script setup lang="ts">
import type { HomeArticleCard } from '~/utils/series'

defineProps<{
  featuredSeriesArticles: HomeArticleCard[]
  standaloneArticles: HomeArticleCard[]
}>()

// ✅ 新增：UI层派生 badge
const getBadge = (kind: HomeArticleCard['kind']) => {
  return kind === 'series' ? 'Series' : 'Article'
}

// Build an inline style for the card cover.
// When a coverImage is provided it takes precedence over the theme gradient class.
const getCoverStyle = (card: HomeArticleCard): Record<string, string> => {
  if (!card.coverImage) return {}
  return {
    backgroundImage: `url(${card.coverImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}
</script>

<template>
  <div class="landing-page">
    <section class="logo-stage">
      <div class="logo-orbit orbit-one" />
      <div class="logo-orbit orbit-two" />
      <p class="logo-kicker">
        Petrichor
      </p>
      <h1 class="logo-mark">
        PETRICHOR
      </h1>
      <p class="logo-description">
        先用全屏 Logo 建立第一印象，再往下滑进入文章内容区。
      </p>
      <a href="#discover" class="scroll-hint">
        向下滑动
      </a>
    </section>

    <section id="discover" class="content-stage">
      <div class="intro-copy">
        <p class="section-kicker">
          Home Archive
        </p>
        <h2 class="stage-title">
          首页直接呈现文章封面，点击后一步进入对应页面
        </h2>
        <p class="stage-description">
          系列文章会直接跳到带左侧导航的阅读页；独立文章会直接进入无侧边栏的单页阅读模式。首页不再做中转。
        </p>
      </div>

      <section v-if="featuredSeriesArticles.length" class="content-block">
        <div class="section-heading">
          <p class="section-kicker">
            系列文章
          </p>
          <h3>保持左侧侧边栏 + 右侧正文的阅读结构</h3>
        </div>

        <div class="card-grid">
          <NuxtLink
            v-for="(card, index) in featuredSeriesArticles"
            :key="card.to"
            :to="card.to"
            class="entry-card"
            :class="card.theme"
            :style="{ animationDelay: `${index * 120}ms` }"
          >
            <div class="card-cover" :style="getCoverStyle(card)">
              <!-- ✅ 修复点 -->
              <span class="card-badge">{{ getBadge(card.kind) }}</span>
              <span class="card-icon">{{ card.icon }}</span>
            </div>

            <div class="card-body">
              <h4>{{ card.title }}</h4>
              <p>{{ card.description }}</p>
              <span class="card-link">直接阅读</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <section class="content-block">
        <div class="section-heading">
          <p class="section-kicker">
            独立文章
          </p>
          <h3>进入页面后不显示左侧侧边栏，专注正文阅读</h3>
        </div>

        <div class="card-grid">
          <NuxtLink
            v-for="(card, index) in standaloneArticles"
            :key="card.to"
            :to="card.to"
            class="entry-card"
            :class="card.theme"
            :style="{ animationDelay: `${(index + featuredSeriesArticles.length) * 120}ms` }"
          >
            <div class="card-cover" :style="getCoverStyle(card)">
              <!-- ✅ 修复点 -->
              <span class="card-badge">{{ getBadge(card.kind) }}</span>
              <span class="card-icon">{{ card.icon }}</span>
            </div>

            <div class="card-body">
              <h4>{{ card.title }}</h4>
              <p>{{ card.description }}</p>
              <span class="card-link">直接阅读</span>
            </div>
          </NuxtLink>
        </div>
      </section>
    </section>
  </div>
</template>

<style scoped src="~/assets/styles/components/app-home-landing.css"></style>