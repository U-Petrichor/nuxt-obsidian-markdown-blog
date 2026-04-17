---
kind: series
series: blog-settings
slug: series-article
title: 系列文章
description: 完整讲解如何在数据驱动架构中新建系列、配置 Frontmatter，以及首页卡片 "Series" 徽章的触发机制。
category: 发布文章
navOrder: 2
---

## 架构概览

一个"系列"由两类文件组成：

| 文件类型 | `kind` 值 | 数量 | 作用 |
|---|---|---|---|
| 系列根文档 | `series-root` | 每个系列 1 个 | 定义系列元信息，生成首页卡片 |
| 系列文章 | `series` | 每个系列 N 个 | 具体文章内容，按 `navOrder` 排列在左侧导航栏 |

---

## 第一步：创建系列根文档（`index.md`）

在 `content/` 下新建一个目录，在该目录中创建 `index.md`（**文件名固定为 index.md**）<br>
同时要在`index.md`顶部添加以下 Frontmatter 字段（可直接复制）

```yaml
---
# ✅ 必填 - 控制内容类型，触发系列首页卡片逻辑
kind: series-root

# ✅ 必填 - 系列唯一标识符，URL 中的路径段
# 访问地址: /series/series-name
series: series-name

# ✅ 必填 - 页面 <title> 和左侧导航栏的系列名称
title: 我的系列名称

# 推荐填写 - 首页卡片上显示的简介文字
description: 这个系列介绍了……

# ✅ 必填（控制首页展示） - 设为 true 才会出现在首页卡片区
isFeatured: true

# 可选 - 首页卡片右上角的 emoji 图标
icon: "🚀"

# 推荐填写 - 控制首页卡片的背景渐变色
# 可选值: theme-blue | theme-purple | theme-emerald | theme-amber | theme-default
theme: theme-blue

# 可选 - 自定义首页卡片封面图（优先级高于 theme 渐变）
# 文件须放在 public/images/ 目录下，填写以 / 开头的绝对路径
# coverImage: /images/my-cover.jpg
---
```

## 第二步：创建系列文章

在同一目录下，每篇文章对应一个 `.md` 文件（文件名可自由命名）。

```yaml
---
# ✅ 必填 - 控制内容类型
kind: series

# ✅ 必填 - 必须与根文档的 series 字段完全一致
series: series-name

# ✅ 必填 - 文章路由标识符（在该系列内唯一）
# 访问地址: 
# 例1：/series/series-name/my-first-chapter
# 例2：/series/series-name/my-second-chapter
slug: my-first-chapter

# ✅ 必填 - 文章顶部的标题
title: 第一章：开始

# 推荐填写 - 文章简介，紧跟文章标题
description: 本章介绍……

# 推荐填写 - 在左侧导航栏中的排序（数字越小越靠前）
navOrder: 1

# 可选 - 左侧导航栏中的分组名称，相同 category 的文章归为一组
category: 分类1

# 以下字段无需填写（系列文章不显示在首页卡片区）
# isFeatured: false（默认值）
---
```

---

## 完整目录结构示例

```
content/
└── series-name/
    ├── index.md                   ← kind: series-root（系列根文档）
    ├── my-first-chapter.md        ← kind: series, navOrder: 1
    ├── my-second-chapter.md       ← kind: series, navOrder: 2
    └── my-third-chapter.md        ← kind: series, navOrder: 3
```

对应的 URL：

| 文件 | 访问地址 |
|---|---|
| `index.md` | `/series/series-name` |
| `my-first-chapter.md` | `/series/series-name/my-first-chapter` |
| `my-second-chapter.md` | `/series/series-name/my-second-chapter` |
| `my-third-chapter.md` | `/series/series-name/my-third-chapter` |

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

### Q: 如何为卡片设置自定义封面图？

1. 将图片放入 `public/images/` 目录（例如 `public/images/my-cover.jpg`）
2. 在根文档 `index.md` 的 Frontmatter 中添加：
   ```yaml
   coverImage: /images/my-cover.jpg
   ```
3. 有 `coverImage` 时，卡片封面会显示该图片，忽略 `theme` 渐变色。
