export type SeriesNavItem = {
  title: string
  path?: string
  children?: SeriesNavItem[]
}

export type SeriesConfig = {
  key: 'series-a' | 'series-b'
  name: string
  basePath: '/series-a' | '/series-b'
  tagline: string
  navTitle: string
  summary: string
  accentClass: string
  sidebarItems: SeriesNavItem[]
}

export type HomeArticleCard = {
  kind: 'series' | 'standalone'
  badge: string
  title: string
  description: string
  to: string
  icon: string
  theme: string
}

export const seriesConfigs: SeriesConfig[] = [
  {
    key: 'series-a',
    name: '系列 A',
    basePath: '/series-a',
    tagline: '偏产品说明与组件规范，适合沉淀结构化参考文档。',
    navTitle: '系列 A 导航',
    summary: '适合放设计规范、组件说明、接口约束这一类需要严谨结构的资料。',
    accentClass: 'series-a',
    sidebarItems: [
      {
        title: '基础文档',
        children: [
          {
            title: '总览',
            path: '/series-a/overview',
          },
          {
            title: '组件规范',
            path: '/series-a/component-spec',
          },
          {
            title: '分析样本编写追踪器',
            path: '/series-a/analysis-tracker',
          },
        ],
      },
    ],
  },
  {
    key: 'series-b',
    name: '系列 B',
    basePath: '/series-b',
    tagline: '偏研究记录与方法沉淀，适合更灵活的专题化内容。',
    navTitle: '系列 B 导航',
    summary: '适合放项目复盘、技术专题、研究记录等更具探索感的内容。',
    accentClass: 'series-b',
    sidebarItems: [
      {
        title: '专题内容',
        children: [
          {
            title: '快速开始',
            path: '/series-b/getting-started',
          },
          {
            title: '规划路线',
            path: '/series-b/roadmap',
          },
        ],
      },
    ],
  },
]

export const featuredSeriesArticles: HomeArticleCard[] = [
  {
    kind: 'series',
    badge: 'Series A',
    title: '系列 A · 总览',
    description: '直接进入系列 A 的第一篇文章，阅读时保留左侧导航与系列化结构。',
    to: '/series-a/overview',
    icon: '🧩',
    theme: 'theme-blue',
  },
  {
    kind: 'series',
    badge: 'Series B',
    title: '系列 B · 快速开始',
    description: '直接进入系列 B 的专题文章，保留系列导航，但视觉氛围与系列 A 区分开。',
    to: '/series-b/getting-started',
    icon: '🌌',
    theme: 'theme-purple',
  },
]

export const standaloneArticles: HomeArticleCard[] = [
  {
    kind: 'standalone',
    badge: 'Single',
    title: '关于这个站点',
    description: '一篇独立文章，不挂载系列侧边栏，进入后直接阅读正文。',
    to: '/about',
    icon: '🌿',
    theme: 'theme-emerald',
  },
  {
    kind: 'standalone',
    badge: 'Single',
    title: '如何开始整理 Markdown',
    description: '以单篇文章形式沉淀方法论，不需要系列导航即可独立阅读。',
    to: '/guide/getting-started',
    icon: '🪄',
    theme: 'theme-amber',
  },
]

export function getSeriesByPath(path: string) {
  return seriesConfigs.find(series => path === series.basePath || path.startsWith(`${series.basePath}/`))
}

export function findSeriesNavItemByPath(path: string) {
  const walk = (items: SeriesNavItem[]): SeriesNavItem | undefined => {
    for (const item of items) {
      if (item.path === path) {
        return item
      }

      if (item.children?.length) {
        const match = walk(item.children)

        if (match) {
          return match
        }
      }
    }
  }

  for (const series of seriesConfigs) {
    const match = walk(series.sidebarItems)

    if (match) {
      return match
    }
  }
}
