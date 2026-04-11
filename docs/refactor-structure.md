# 重构说明文档

## 目标

本次重构围绕以下目标展开：

- 统一静态资源与样式资源到 `app/assets/`
- 将首页展示逻辑与 Markdown 阅读器逻辑从页面文件中拆分
- 保持现有业务逻辑不变，同时补充类型、测试与说明文档

## 变更文件清单

### 新增

- `app/assets/fonts/ZLabsRoundPix.woff2`
- `app/assets/icons/favicon.ico`
- `app/assets/styles/app.css`
- `app/assets/styles/components/app-article-progress.css`
- `app/assets/styles/components/app-footer.css`
- `app/assets/styles/components/app-home-landing.css`
- `app/assets/styles/components/app-right-sidebar.css`
- `app/assets/styles/components/alert.css`
- `app/assets/styles/components/docs-nav.css`
- `app/assets/styles/pages/temp-page.css`
- `app/components/AppHomeLanding.vue`
- `app/components/AppMarkdownReader.vue`
- `app/composables/useArticleProgressState.ts`
- `app/types/content.ts`
- `docs/refactor-structure.md`
- `tests/components/AppHomeLanding.spec.ts`
- `tests/components/AppMarkdownReader.spec.ts`
- `vitest.config.ts`

### 调整

- `app/app.vue`
- `app/pages/index.vue`
- `app/pages/[...slug].vue`
- `app/components/AppArticleProgress.vue`
- `app/components/AppFooter.vue`
- `app/components/AppRightSidebar.vue`
- `app/components/DocsNav.vue`
- `app/components/Alert.vue`
- `app/pages/temp-a.vue`
- `app/pages/temp-b.vue`
- `app/pages/temp-c.vue`
- `package.json`
- `package-lock.json`

### 删除或迁移

- `public/fonts/ZLabsRoundPix.woff2` → `app/assets/fonts/ZLabsRoundPix.woff2`
- `public/favicon.ico` → `app/assets/icons/favicon.ico`

## 新目录结构

```txt
app/
  assets/
    fonts/
      ZLabsRoundPix.woff2
    icons/
      favicon.ico
    styles/
      app.css
      components/
        app-article-progress.css
        app-footer.css
        app-home-landing.css
        app-right-sidebar.css
        alert.css
        docs-nav.css
      pages/
        temp-page.css
  components/
    AppArticleProgress.vue
    AppFooter.vue
    AppHeader.vue
    AppHomeLanding.vue
    AppMarkdownReader.vue
    AppRightSidebar.vue
    DocsNav.vue
    Alert.vue
  composables/
    useArticleProgressState.ts
  pages/
    index.vue
    [...slug].vue
    temp-a.vue
    temp-b.vue
    temp-c.vue
  types/
    content.ts
  utils/
    series.ts
docs/
  refactor-structure.md
tests/
  components/
    AppHomeLanding.spec.ts
    AppMarkdownReader.spec.ts
```

## 组件依赖关系图

```txt
app.vue
├─ AppHeader
├─ DocsNav
├─ AppRightSidebar
│  └─ AppArticleProgress
├─ NuxtPage
│  ├─ index.vue
│  │  └─ AppHomeLanding
│  └─ [...slug].vue
│     └─ AppMarkdownReader
└─ AppFooter
```

## 数据流说明

### 首页展示

- `index.vue` 只负责 SEO 和首页数据接入
- `AppHomeLanding.vue` 接收：
  - `featuredSeriesArticles`
  - `standaloneArticles`
- 首页所有卡片跳转逻辑仍由 `series.ts` 配置驱动

### Markdown 阅读器

- `[...slug].vue` 负责：
  - 根据路由读取 Markdown
  - 处理导航项回退逻辑
  - 更新文章进度状态
- `AppMarkdownReader.vue` 只负责正文渲染
- `useArticleProgressState.ts` 统一管理右侧目录进度状态
- `app.vue` 负责把该状态投射到右侧可复用侧边栏

## 迁移验证检查清单

- [x] 全局字体资源迁移到 `app/assets/fonts`
- [x] 站点图标迁移到 `app/assets/icons`
- [x] 页面与组件样式改为从 `app/assets/styles` 引用
- [x] 首页展示逻辑拆分到独立组件
- [x] Markdown 阅读器拆分到独立组件
- [x] 右侧目录状态抽离到 composable
- [x] TypeScript 类型集中到 `app/types`
- [x] 为新增组件补充测试用例
- [x] 构建通过
- [x] 类型检查通过
- [x] 新增说明文档保留原有页面可用性

## 验证命令

```bash
npm run build
npm run typecheck
npm run test:run
```

## 备注

- 当前项目原本没有现成的单元测试体系，因此本次补充了 `Vitest + Vue Test Utils`
- 当前系列导航与首页卡片仍然由 `app/utils/series.ts` 手动配置
- 如果下一步继续演进，最值得推进的是把首页卡片与系列导航改成由 Markdown frontmatter 自动生成
