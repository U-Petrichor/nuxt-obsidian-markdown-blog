---
kind: series
series: blog-settings
slug: series-article
title: 系列文章
description: 完整讲解如何在数据驱动架构中新建系列、配置 Frontmatter，以及首页卡片 "Series" 徽章的触发机制。
category: 发布文章
navOrder: 1
---

# 如何发布系列文章

本站采用**数据驱动路由**架构。文章的 URL、导航关系和首页卡片，**完全由 Markdown 文件头部的 Frontmatter 字段决定**，与文件在 `content/` 目录中的物理路径无关。

## 架构概览

一个"系列"由两类文件组成：

| 文件类型 | `kind` 值 | 数量 | 作用 |
|---|---|---|---|
| 系列根文档 | `series-root` | 每个系列 1 个 | 定义系列元信息，生成首页卡片 |
| 系列文章 | `series` | 每个系列 N 个 | 具体文章内容，按 `navOrder` 排列在左侧导航栏 |

---

## 第一步：创建系列根文档（`index.md`）

在 `content/` 下新建一个目录，在该目录中创建 `index.md`（**文件名固定为 index.md**）。

```yaml
---
# ✅ 必填 - 控制内容类型，触发系列首页卡片逻辑
kind: series-root

# ✅ 必填 - 系列唯一标识符，URL 中的路径段
# 访问地址: /series/{series}
series: my-series

# ✅ 必填 - 页面 <title> 和左侧导航栏的系列名称
title: 我的系列名称

# 推荐填写 - 首页卡片上显示的简介文字
description: 这个系列介绍了……

# ✅ 必填（控制首页展示） - 设为 true 才会出现在首页卡片区
isFeatured: true

# 推荐填写 - 首页卡片右上角的 emoji 图标
icon: "🚀"

# 推荐填写 - 控制首页卡片的背景渐变色
# 可选值: theme-blue | theme-purple | theme-emerald | theme-amber | theme-default
theme: theme-blue

# 可选 - 自定义首页卡片封面图（优先级高于 theme 渐变）
# 文件须放在 public/images/ 目录下，填写以 / 开头的绝对路径
# coverImage: /images/my-cover.jpg
---
```

### 首页卡片 "Series" 徽章是如何触发的？

首页卡片左上角的 `Series` 徽章由以下条件**同时满足**时显示：

1. Frontmatter 中 `kind: series-root`
2. Frontmatter 中 `isFeatured: true`

具体调用链路：

```
content/query → utils/series.ts#getHomePageArticles()
  → 筛选 kind === 'series-root' && isFeatured === true
  → mapSeriesRootToCard() → HomeArticleCard { kind: 'series', ... }
  → AppHomeLanding.vue → getBadge(card.kind)
    → kind === 'series' → 渲染 <span class="card-badge">Series</span>
```

**关键点**：徽章文字 `'Series'` 来自 `kind: 'series-root'` 映射到 `HomeArticleCard.kind = 'series'`，再由 `getBadge()` 派生。Frontmatter 本身没有 `badge` 字段，**不要手动添加**。

---

## 第二步：创建系列文章

在同一目录下，每篇文章对应一个 `.md` 文件（文件名可自由命名）。

```yaml
---
# ✅ 必填 - 控制内容类型
kind: series

# ✅ 必填 - 必须与根文档的 series 字段完全一致
series: my-series

# ✅ 必填 - 文章路由标识符（在该系列内唯一）
# 访问地址: /series/{series}/{slug}
slug: my-first-chapter

# ✅ 必填 - 文章标题
title: 第一章：开始

# 推荐填写 - 文章简介
description: 本章介绍……

# 推荐填写 - 在左侧导航栏中的排序（数字越小越靠前）
navOrder: 1

# 可选 - 左侧导航栏中的分组名称，相同 category 的文章归为一组
category: 基础

# 以下字段无需填写（系列文章不显示在首页卡片区）
# isFeatured: false（默认值）
---
```

---

## 完整目录结构示例

```
content/
└── my-series/
    ├── index.md                  ← kind: series-root（系列根文档）
    ├── getting-started.md        ← kind: series, navOrder: 1
    ├── advanced-usage.md         ← kind: series, navOrder: 2
    └── faq.md                    ← kind: series, navOrder: 3
```

对应的 URL：

| 文件 | 访问地址 |
|---|---|
| `index.md` | `/series/my-series` |
| `getting-started.md` | `/series/my-series/getting-started` |
| `advanced-usage.md` | `/series/my-series/advanced-usage` |

---

## 字段速查表

### 系列根文档（`kind: series-root`）

| 字段 | 类型 | 是否必填 | 说明 |
|---|---|---|---|
| `kind` | `'series-root'` | ✅ 必填 | 固定值 |
| `series` | `string` | ✅ 必填 | 系列唯一 key，决定 URL 路径 |
| `title` | `string` | ✅ 必填 | 系列名称 |
| `isFeatured` | `boolean` | ✅ 必填（设为 `true`） | 控制是否显示首页卡片 |
| `description` | `string` | 推荐 | 首页卡片简介 |
| `icon` | `string` | 推荐 | 首页卡片 emoji 图标 |
| `theme` | `string` | 推荐 | 首页卡片渐变色主题 |
| `coverImage` | `string` | 可选 | 自定义封面图路径（`/images/xxx.jpg`） |

### 系列文章（`kind: series`）

| 字段 | 类型 | 是否必填 | 说明 |
|---|---|---|---|
| `kind` | `'series'` | ✅ 必填 | 固定值 |
| `series` | `string` | ✅ 必填 | 必须与根文档的 `series` 完全一致 |
| `slug` | `string` | ✅ 必填 | 文章路由标识符，系列内唯一 |
| `title` | `string` | ✅ 必填 | 文章标题 |
| `navOrder` | `number` | 推荐 | 左侧导航排序，数字越小越靠前 |
| `category` | `string` | 可选 | 左侧导航分组名称 |
| `description` | `string` | 可选 | 文章简介 |

---

## 常见问题

### Q: 文章写完了，但首页没有出现系列卡片？

检查根文档 `index.md` 是否同时满足：
- `kind: series-root`
- `isFeatured: true`

### Q: 左侧导航栏顺序乱了？

确认每篇系列文章都填写了 `navOrder`，且数值不重复。未填写的文章默认 `navOrder: 0`，会排到最前面。

### Q: 新文章导航没有出现对应分组？

`category` 字段值需要与其他文章保持一致（大小写敏感）。未填写 `category` 的文章默认归入"未分类"组。

### Q: 如何为卡片设置自定义封面图？

1. 将图片放入 `public/images/` 目录（例如 `public/images/my-cover.jpg`）
2. 在根文档 `index.md` 的 Frontmatter 中添加：
   ```yaml
   coverImage: /images/my-cover.jpg
   ```
3. 有 `coverImage` 时，卡片封面会显示该图片，忽略 `theme` 渐变色。
