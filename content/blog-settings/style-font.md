---
kind: series
series: blog-settings
slug: style-font
title: 字体
description: 如何修改 Markdown 内容的字体大小、字体样式等与字体相关的设置
category: 自定义样式
navOrder: 5
---


## Markdown 字体样式

Markdown文章中的所有字体样式都在`app\assets\styles\markdown-core.css` 当中。<br>
推荐在 `app\assets\styles\markdown.css` 中覆盖对应的样式规则，同时在主页切换为**自定义**主题

### 正文样式

| CSS 选择器 | 样式属性 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `.app-markdown-reader` | `line-height` | `1.75` | 正文行高，控制段落内行与行之间的间距 |

### 标题字体样式

| CSS 选择器 | 样式属性 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `.app-markdown-reader h1` | `font-size` | `2.25rem` | H1 字体大小 |
| `.app-markdown-reader h1` | `text-align` | `center` | H1 文本对齐方式 |
| `.app-markdown-reader h2` | `font-size` | `1.5rem` | H2 字体大小 |
| `.app-markdown-reader h3` | `font-size` | `1.25rem` | H3 字体大小 |
| `.app-markdown-reader h4` | `font-size` | `1.1rem` | H4 字体大小 |
| `.app-markdown-reader h5` | `font-size` | `1rem` | H5 字体大小 |
| `.app-markdown-reader h6` | `font-size` | `0.9rem` | H6 字体大小 |
| `.app-markdown-reader h1, h2, h3, h4, h5, h6` | `font-weight` | `700` | 所有标题的字重（粗细） |
| `.app-markdown-reader h1, h2, h3, h4, h5, h6` | `line-height` | `1.3` | 所有标题的行高 |

### 代码字体样式

| CSS 选择器 | 样式属性 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `.app-markdown-reader code:not(pre code)` | `font-size` | `0.875em` | 行内代码字体大小 |
| `.app-markdown-reader code:not(pre code)` | `font-family` | `"Cascadia Code", "Fira Code", monospace` | 行内代码字体族 |
| `.app-markdown-reader pre code` | `font-size` | `0.875rem` | 代码块字体大小 |
| `.app-markdown-reader pre code` | `font-family` | `"Cascadia Code", "Fira Code", monospace` | 代码块字体族 |

### 表格字体样式

| CSS 选择器 | 样式属性 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `.app-markdown-reader table` | `font-size` | `0.9rem` | 表格整体字体大小 |
| `.app-markdown-reader th` | `font-weight` | `600` | 表头字重（粗细） |

### 文本强调样式

| CSS 选择器 | 样式属性 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `.app-markdown-reader strong` | `font-weight` | `700` | 粗体字重 |
| `.app-markdown-reader em` | `font-style` | `italic` | 斜体样式 |

---

## 如何修改字体样式

### 示例：修改所有标题的字体大小

```css
.app-markdown-reader h1 { font-size: 2.5rem; }
.app-markdown-reader h2 { font-size: 1.75rem; }
.app-markdown-reader h3 { font-size: 1.5rem; }
.app-markdown-reader h4 { font-size: 1.25rem; }
.app-markdown-reader h5 { font-size: 1.125rem; }
.app-markdown-reader h6 { font-size: 1rem; }
```

### 示例：修改代码字体

```css
/* 修改行内代码字体 */
.app-markdown-reader code:not(pre code) {
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.9em;
}

/* 修改代码块字体 */
.app-markdown-reader pre code {
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.95rem;
}
```

### 示例：修改正文行高

```css
.app-markdown-reader {
  line-height: 1.8; /* 更宽松的行高 */
}
```

### 示例：修改标题字重

```css
.app-markdown-reader h1,
.app-markdown-reader h2,
.app-markdown-reader h3,
.app-markdown-reader h4,
.app-markdown-reader h5,
.app-markdown-reader h6 {
  font-weight: 600; /* 更细的标题 */
}
```

### 示例：修改 H1 标题对齐方式

```css
.app-markdown-reader h1 {
  text-align: left; /* 改为左对齐 */
  margin-bottom: 1.5rem; /* 调整底部间距 */
}
```

### 示例：修改粗体字重

```css
.app-markdown-reader strong {
  font-weight: 600; /* 更细的粗体 */
}
```

---

## 常用字体族推荐

### 中文字体
```css
/* 更现代的中文字体 */
.app-markdown-reader {
  font-family: "PingFang SC", "Microsoft YaHei", "微软雅黑", sans-serif;
}
```

### 英文字体
```css
/* 更现代的英文字体 */
.app-markdown-reader {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### 代码字体
```css
/* 使用 JetBrains Mono */
.app-markdown-reader code:not(pre code),
.app-markdown-reader pre code {
  font-family: "JetBrains Mono", "Fira Code", monospace;
}
```

---

## 完整主题示例

### 轻盈风格主题

```css
.app-markdown-reader {
  line-height: 1.85;
  font-family: "Inter", "PingFang SC", sans-serif;
}

.app-markdown-reader h1 { font-size: 2.125rem; }
.app-markdown-reader h2 { font-size: 1.5rem; }
.app-markdown-reader h3 { font-size: 1.25rem; }
.app-markdown-reader h4 { font-size: 1.125rem; }
.app-markdown-reader h5 { font-size: 1rem; }
.app-markdown-reader h6 { font-size: 0.875rem; }

.app-markdown-reader h1,
.app-markdown-reader h2,
.app-markdown-reader h3,
.app-markdown-reader h4,
.app-markdown-reader h5,
.app-markdown-reader h6 {
  font-weight: 600;
  line-height: 1.4;
}

.app-markdown-reader code:not(pre code) {
  font-size: 0.85em;
}

.app-markdown-reader pre code {
  font-size: 0.875rem;
}

.app-markdown-reader strong {
  font-weight: 600;
}
```

### 紧凑风格主题

```css
.app-markdown-reader {
  line-height: 1.6;
}

.app-markdown-reader h1 { font-size: 2rem; }
.app-markdown-reader h2 { font-size: 1.375rem; }
.app-markdown-reader h3 { font-size: 1.125rem; }
.app-markdown-reader h4 { font-size: 1rem; }
.app-markdown-reader h5 { font-size: 0.875rem; }
.app-markdown-reader h6 { font-size: 0.8rem; }

.app-markdown-reader h1,
.app-markdown-reader h2,
.app-markdown-reader h3,
.app-markdown-reader h4,
.app-markdown-reader h5,
.app-markdown-reader h6 {
  line-height: 1.25;
}
```

---

## 注意事项

1. **修改位置**：字体样式建议在 `app/assets/styles/markdown.css` 中覆盖，不要直接修改 `markdown-core.css`
2. **字体族顺序**：字体族按优先级从左到右排列，系统会使用第一个可用的字体
3. **rem 单位**：使用 `rem` 单素可以实现响应式缩放，基于根元素字体大小
4. **em 单位**：使用 `em` 单位会相对于父元素字体大小缩放
5. **字体加载**：使用自定义字体时，确保字体文件已正确加载
6. **选择器说明**：CSS 选择器是用来定位要修改样式的元素，所有选择器都以 `.app-markdown-reader` 开头，确保样式只应用到文章内容区域

修改样式后保存文件，刷新页面即可看到效果，**无需重启开发服务器**。
