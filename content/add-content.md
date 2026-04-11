---
title: 如何添加内容
description: 说明当前项目里如何添加系列文章、独立文章，以及为什么新建 Markdown 后有时不会自动出现在侧边栏。
---

# 如何添加内容

当前这个项目的内容分成两类：

- 系列文章
- 独立文章

它们都使用 Markdown 存放在 `content/` 目录中，但接入方式不完全一样。

## 先理解当前项目规则

### 系列文章

系列文章放在这些目录中：

- `content/series-a/`
- `content/series-b/`

这类文章的特点是：

- 会进入系列阅读布局
- 页面左侧会显示系列侧边栏
- 页面右侧会显示文章目录进度

### 独立文章

独立文章一般放在不属于 `series-a`、`series-b` 的路径里，例如：

- `content/about.md`
- `content/guide/getting-started.md`
- `content/add-content.md`

这类文章的特点是：

- 不显示左侧系列侧边栏
- 直接以单篇文章方式阅读
- 右侧仍然会显示文章目录进度

## 如何添加系列文章

这里以系列 A 为例。

### 第一步：在系列目录中新建 Markdown

例如你添加：

```txt
content/series-a/分析样本编写追踪器.md
```

如果你不额外指定路径，它通常会按文件路径生成访问地址。

但当前项目里更推荐你主动写一个 `path`，尤其是当文件名包含中文、空格或你希望网址更稳定时。

例如：

```md
---
title: 分析样本编写追踪器
description: 这里写这篇文章的简介
path: /series-a/analysis-tracker
---
```

这样它对应的访问路径就是：

```txt
/series-a/analysis-tracker
```

### 第二步：写 frontmatter

建议每篇文章顶部都写：

```md
---
title: 分析样本编写追踪器
description: 这里写这篇文章的简介
path: /series-a/analysis-tracker
---
```

### 第三步：把它加入系列侧边栏

这是当前项目最重要的一点：

**系列侧边栏不是自动扫描生成的，而是手动写在 `app/utils/series.ts` 里的。**

也就是说，你只是把 Markdown 文件放进 `content/series-a/`，页面虽然已经可以通过路径访问，但它**不会自动出现在左侧侧边栏里**。

你还需要去修改：

[series.ts](file:///e:/MyBlog/u-petrichor/app/utils/series.ts)

在 `series-a` 的 `sidebarItems` 里新增一项，例如：

```ts
{
  title: '分析样本编写追踪器',
  path: '/series-a/analysis-tracker',
}
```

### 第四步：如果你想让它出现在首页卡片

首页“系列文章”卡片不是自动生成的，而是手动配置在：

[series.ts](file:///e:/MyBlog/u-petrichor/app/utils/series.ts)

对应的是 `featuredSeriesArticles`。

如果你希望某篇系列文章出现在首页，就再添加一项，例如：

```ts
{
  kind: 'series',
  badge: 'Series A',
  title: '系列 A · 分析样本编写追踪器',
  description: '这里写首页卡片简介',
  to: '/series-a/analysis-tracker',
  icon: '🧩',
  theme: 'theme-blue',
}
```

## 如何添加独立文章

### 第一步：在 `content/` 里新建 Markdown

例如：

```txt
content/my-note.md
```

对应访问路径：

```txt
/my-note
```

或者：

```txt
content/guide/my-note.md
```

对应访问路径：

```txt
/guide/my-note
```

### 第二步：写 frontmatter

```md
---
title: 我的独立文章
description: 这里写简介
---
```

### 第三步：如果你想让它出现在首页卡片

独立文章首页卡片配置在：

[series.ts](file:///e:/MyBlog/u-petrichor/app/utils/series.ts)

对应的是 `standaloneArticles`。

你需要手动加一项：

```ts
{
  kind: 'standalone',
  badge: 'Single',
  title: '我的独立文章',
  description: '这里写首页简介',
  to: '/my-note',
  icon: '🪄',
  theme: 'theme-amber',
}
```

## 为什么我新建了 Markdown，却没有出现在页面里

通常有两种情况：

### 情况一：页面能打开，但左侧没有出现

这是因为：

- Markdown 文件已经存在
- 路由已经生效
- 但是左侧系列导航是手动配置的

所以你需要改 `app/utils/series.ts`。

### 情况二：首页没有出现卡片

这是因为首页卡片也是手动配置的，不会自动读取全部 Markdown。

所以你需要：

- 系列文章改 `featuredSeriesArticles`
- 独立文章改 `standaloneArticles`

## 当前最推荐的添加流程

### 添加系列文章

1. 在 `content/series-a/` 或 `content/series-b/` 下新建 Markdown
2. 写 `title` 和 `description`
3. 去 `app/utils/series.ts` 把它加入 `sidebarItems`
4. 如果想上首页，再加入 `featuredSeriesArticles`

### 添加独立文章

1. 在 `content/` 下新建 Markdown
2. 写 `title` 和 `description`
3. 如果想上首页，再加入 `standaloneArticles`

## 你刚才那个文件为什么没出现

你新增了：

```txt
content/series-a/分析样本编写追踪器.md
```

它没自动出现在左侧，是因为当前项目的系列导航不是自动生成的，而是手动维护的。

另外，为了让这篇文章的访问地址更稳定，我已经给它补了一个显式路径：

```txt
/series-a/analysis-tracker
```

现在我已经把它补进系列 A 的侧边栏配置中了。

## 继续阅读

- [系列 A 总览](/series-a/overview)
- [分析样本编写追踪器](/series-a/analysis-tracker)
- [关于这个站点](/about)
