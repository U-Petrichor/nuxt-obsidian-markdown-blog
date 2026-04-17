export type MarkdownTheme = 'light' | 'dark' | 'nord' | 'custom'

export interface ThemeOption {
  label: string
  value: MarkdownTheme
}

export const themeOptions: ThemeOption[] = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '北欧', value: 'nord' },
  { label: '自定义', value: 'custom' },
]
