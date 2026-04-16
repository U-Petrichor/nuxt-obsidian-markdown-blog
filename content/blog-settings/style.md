---
kind: series
series: blog-settings
slug: style
title: 样式自定义指南
description: 如何通过 CSS 变量修改 Callout 提示框的颜色、圆角等外观样式。
category: 自定义样式
navOrder: 4
---

# 样式自定义指南

本博客的 Callout 提示框通过 **CSS 变量**来控制外观，你可以在不修改组件源码的情况下，直接覆盖这些变量来自定义样式。

---

## CSS 变量说明

所有变量定义在 `app/assets/styles/markdown.css` 的 `.app-markdown-reader` 选择器下。

### 圆角变量

| 变量名 | 默认值 | 说明 |
| --- | --- | --- |
| `--callout-radius` | `8px` | Callout 外框的圆角大小 |

### 颜色变量

每种 Callout 类型有两个变量：`-bg`（背景色）和 `-border`（左侧边框色及标题色）。

| 变量名 | 默认值 | 适用类型 |
| --- | --- | --- |
| `--md-callout-info-bg` | `rgba(59, 130, 246, 0.08)` | `info`、`note` |
| `--md-callout-info-border` | `#3b82f6` | `info`、`note` |
| `--md-callout-warning-bg` | `rgba(245, 158, 11, 0.08)` | `warning`、`caution`、`important` |
| `--md-callout-warning-border` | `#f59e0b` | `warning`、`caution`、`important` |
| `--md-callout-danger-bg` | `rgba(239, 68, 68, 0.08)` | `danger`、`error` |
| `--md-callout-danger-border` | `#ef4444` | `danger`、`error` |
| `--md-callout-success-bg` | `rgba(34, 197, 94, 0.08)` | `tip`、`success` |
| `--md-callout-success-border` | `#22c55e` | `tip`、`success` |

---

## 如何覆盖变量

在 `app/assets/styles/markdown.css` 中找到 `.app-markdown-reader` 块，直接修改对应的变量值即可。

### 示例：改为方角（去掉圆角）

```css
.app-markdown-reader {
  --callout-radius: 0px;
}
```

### 示例：自定义 info 类型的颜色

```css
.app-markdown-reader {
  /* 将 info 类型改为紫色主题 */
  --md-callout-info-bg: rgba(139, 92, 246, 0.08);
  --md-callout-info-border: #8b5cf6;
}
```

### 示例：同时修改多个变量

```css
.app-markdown-reader {
  /* 方形风格 */
  --callout-radius: 0px;

  /* 自定义配色 */
  --md-callout-info-bg: rgba(99, 102, 241, 0.1);
  --md-callout-info-border: #6366f1;

  --md-callout-warning-bg: rgba(249, 115, 22, 0.1);
  --md-callout-warning-border: #f97316;
}
```

---

## 变量生效原理

CSS 变量（自定义属性）通过**继承**向下传递。`.app-markdown-reader` 是所有文章内容的父容器，定义在它上面的变量会自动被所有子元素（包括 Callout 组件）继承和使用。

修改变量后保存文件，刷新页面即可看到效果，**无需重启开发服务器**。
