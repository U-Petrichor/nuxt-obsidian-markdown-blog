export type ArticleTocLink = {
  id?: string
  text?: string
  children?: ArticleTocLink[]
}

export type ArticleProgressState = {
  path?: string
  title?: string
  links?: ArticleTocLink[]
}

export type ContentPage = {
  title?: string
  body?: {
    toc?: {
      links?: ArticleTocLink[]
    }
  }
}
