export type BaseContent = {
  title: string
  description?: string
  theme: string
  isFeatured: boolean
}

export type SeriesRoot = BaseContent & {
  kind: 'series-root'
  series: string
  icon?: string
  coverImage?: string
}

export type SeriesArticle = BaseContent & {
  kind: 'series'
  series: string
  slug: string
  category?: string
  navOrder?: number
}

export type StandaloneArticle = BaseContent & {
  kind: 'standalone'
  slug: string
  icon?: string
  coverImage?: string
}

export type ContentDocument =
  | SeriesRoot
  | SeriesArticle
  | StandaloneArticle

export type TocLink = {
  id?: string
  text?: string
  children?: TocLink[]
}

export type ArticleProgressState = {
  path: string
  title: string
  links: TocLink[]
}