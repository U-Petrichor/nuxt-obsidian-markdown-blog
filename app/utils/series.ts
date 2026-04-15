import { queryCollection } from '#imports'
import type {
  SeriesRoot,
  SeriesArticle,
  StandaloneArticle,
} from '../types/content'

// =====================
// 路由定义
// =====================
const ROUTES = {
  SERIES: '/series',
  POST: '/post',
}

export function buildSeriesRoute(series: string, slug?: string) {
  return slug
    ? `${ROUTES.SERIES}/${series}/${slug}`
    : `${ROUTES.SERIES}/${series}`
}

export function buildPostRoute(slug: string) {
  return `${ROUTES.POST}/${slug}`
}

// =====================
// 首页卡片类型
// =====================
export type HomeArticleCard = {
  kind: 'series' | 'standalone'
  title: string
  description?: string
  to: string
  icon: string
  theme: string
  // Optional: when set, the card cover uses this image instead of the theme gradient.
  coverImage?: string
}

// =====================
// Sidebar 类型
// =====================
export type SeriesNavItem =
  | { title: string; path: string }
  | { title: string; children: { title: string; path: string }[] }

// =====================
// 映射函数
// =====================
const mapSeriesRootToCard = (root: SeriesRoot): HomeArticleCard => ({
  kind: 'series',
  title: root.title,
  description: root.description,
  to: buildSeriesRoute(root.series),
  icon: root.icon ?? '📚',
  theme: root.theme ?? 'theme-default',
  coverImage: root.coverImage,
})

const mapStandaloneToCard = (
  article: StandaloneArticle,
): HomeArticleCard => ({
  kind: 'standalone',
  title: article.title,
  description: article.description,
  to: buildPostRoute(article.slug),
  icon: article.icon ?? '📝',
  theme: article.theme ?? 'theme-default',
  coverImage: article.coverImage,
})

// =====================
// Sidebar 构建
// =====================
const buildSidebar = (
  root: SeriesRoot,
  articles: SeriesArticle[],
): SeriesNavItem[] => {
  const grouped = new Map<string, SeriesArticle[]>()

  for (const article of articles) {
    const group = article.category || '未分类'
    const list = grouped.get(group) || []
    list.push(article)
    grouped.set(group, list)
  }

  return [
    {
      title: root.title,
      path: buildSeriesRoute(root.series),
    },
    ...Array.from(grouped.entries()).map(([group, list]) => ({
      title: group,
      children: list
        .sort((a, b) => (a.navOrder ?? 0) - (b.navOrder ?? 0))
        .map((a) => ({
          title: a.title,
          path: buildSeriesRoute(a.series, a.slug),
        })),
    })),
  ]
}

// =====================
// 数据查询
// =====================
async function getAllContent() {
  return await queryCollection('content').all()
}

// =====================
// 首页数据
// =====================
export async function getHomePageArticles() {
  const data = await getAllContent()

  const seriesRoots = data
    .filter((d) => d.kind === 'series-root' && d.isFeatured)
    .map((d) => d as SeriesRoot)

  const standalone = data
    .filter((d) => d.kind === 'standalone' && d.isFeatured)
    .map((d) => d as StandaloneArticle)

  return {
    featuredSeries: seriesRoots.map(mapSeriesRootToCard),
    featuredStandalone: standalone.map(mapStandaloneToCard),
  }
}

export async function getHomeArticleCards() {
  const { featuredSeries } = await getHomePageArticles()
  return featuredSeries
}

export async function getStandaloneArticleCards() {
  const { featuredStandalone } = await getHomePageArticles()
  return featuredStandalone
}

// =====================
// 系列相关
// =====================
export type SeriesConfig = {
  key: string
  title: string
  description?: string
  icon: string
  theme: string
  sidebar: SeriesNavItem[]
}

export async function getSeries(seriesKey: string): Promise<SeriesConfig | null> {
  const data = await getAllContent()

  const root = data.find(
    (d) => d.kind === 'series-root' && d.series === seriesKey,
  ) as SeriesRoot | undefined

  if (!root) return null

  const articles = data
    .filter((d) => d.kind === 'series' && d.series === seriesKey)
    .map((d) => d as SeriesArticle)
    .sort((a, b) => (a.navOrder ?? 0) - (b.navOrder ?? 0))

  return {
    key: seriesKey,
    title: root.title,
    description: root.description,
    icon: root.icon ?? '📚',
    theme: root.theme ?? 'theme-default',
    sidebar: buildSidebar(root, articles),
  }
}

// =====================
// Sidebar 单独获取
// =====================
export async function getSeriesSidebarItems(seriesKey: string) {
  const series = await getSeries(seriesKey)
  return series?.sidebar || []
}