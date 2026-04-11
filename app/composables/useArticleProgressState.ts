import type { ArticleProgressState } from '~/types/content'

/**
 * 统一管理当前 Markdown 页面对应的右侧目录进度状态。
 */
export function useArticleProgressState() {
  const articleProgress = useState<ArticleProgressState>('article-progress', () => ({
    path: '',
    title: '',
    links: [],
  }))

  /**
   * 使用当前文章的数据刷新右侧目录状态。
   */
  const setArticleProgress = (payload: ArticleProgressState) => {
    articleProgress.value = {
      path: payload.path || '',
      title: payload.title || '',
      links: payload.links || [],
    }
  }

  /**
   * 在路由切换或组件卸载时重置目录状态，避免沿用上一页数据。
   */
  const resetArticleProgress = () => {
    articleProgress.value = {
      path: '',
      title: '',
      links: [],
    }
  }

  return {
    articleProgress,
    setArticleProgress,
    resetArticleProgress,
  }
}
