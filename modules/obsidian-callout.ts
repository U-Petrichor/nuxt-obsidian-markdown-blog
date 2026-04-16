/**
 * Nuxt 模块：Obsidian 呼号 (Callout) → MDC 预处理器
 *
 * 挂载到 Nuxt Content 的 `content:file:beforeParse` 钩子，
 * 将 Obsidian 风格的呼号语法转换为 MDC 的 `::callout{}` 代码块。
 *
 * 输入示例：
 * > [!info] 我的标题
 * > 一些 **加粗** 内容
 * > 带有 [链接](url)
 *
 * 输出示例：
 * ::callout{type="info" title="我的标题"}
 * 一些 **加粗** 内容
 * 带有 [链接](url)
 * ::
 *
 * 中断条件：如果出现一个不以 '>' 开头的非空行，
 * 将立即终止呼号状态，防止意外吞噬后续段落。
 */

import { defineNuxtModule } from '@nuxt/kit'

// 正则表达式：匹配呼号触发行，例如 "> [!info] 标题"
const CALLOUT_TRIGGER = /^>\s*\[!(\w+)\]\s*(.*)/
// 正则表达式：匹配代码块围栏 (``` 或 ~~~)
const FENCE_TRIGGER = /^(`{3,}|~{3,})/

export default defineNuxtModule({
  meta: {
    name: 'obsidian-callout',
  },
  setup(_options, nuxt) {
    // 在 Nuxt Content 解析 Markdown 之前进行拦截处理
    nuxt.hook('content:file:beforeParse', (ctx: { file: { id: string; body: string; path: string } }) => {
      const { file } = ctx
      // 仅处理 .md 文件
      if (!file.path.endsWith('.md')) return

      const lines = file.body.split('\n')
      const output: string[] = []

      // 状态追踪变量
      let inCallout = false
      let inFence = false
      let fenceMarker = ''
      let calloutType = ''
      let calloutTitle = ''
      let calloutBody: string[] = []

      // 将收集到的呼号内容推送到输出数组并重置状态
      const flushCallout = () => {
        if (!inCallout) return
        output.push(`::callout{type="${calloutType}" title="${calloutTitle}"}`)
        for (const line of calloutBody) {
          output.push(line)
        }
        output.push('::')
        inCallout = false
        calloutType = ''
        calloutTitle = ''
        calloutBody = []
      }

      for (const line of lines) {
        // 追踪代码块围栏 —— 处于代码块内时直接跳过呼号匹配，防止误伤
        const fenceMatch = line.match(FENCE_TRIGGER)
        if (fenceMatch) {
          if (!inFence) {
            inFence = true
            fenceMarker = fenceMatch[1]![0]! // 获取 '`' 或 '~'
          }
          else if (line.trimEnd().startsWith(fenceMarker.repeat(3)) && line.trim() === fenceMarker.repeat(line.trim().length)) {
            inFence = false
            fenceMarker = ''
          }
        }

        if (inFence) {
          // 如果在代码块内部发现了呼号触发（异常情况），先清理掉之前的呼号
          if (inCallout) flushCallout()
          output.push(line)
          continue
        }

        if (!inCallout) {
          // 尝试匹配呼号的起始行
          const match = line.match(CALLOUT_TRIGGER)
          if (match) {
            inCallout = true
            calloutType = (match[1] ?? '').toLowerCase()
            calloutTitle = (match[2] ?? '').trim()
          }
          else {
            // 普通行，直接放入输出
            output.push(line)
          }
        }
        else {
          // 处理已进入呼号状态后的后续行
          const isEmptyLine = line.trim() === ''
          const isBlockquoteLine = line.startsWith('>')

          if (isEmptyLine) {
            // 空行允许存在于呼号内部
            calloutBody.push('')
          }
          else if (isBlockquoteLine) {
            // 移除行首的 '>' 符号并收集内容
            const stripped = line.replace(/^>\s?/, '')
            calloutBody.push(stripped)
          }
          else {
            // 遇到既非空行也非 '>' 开头的行，说明呼号结束
            flushCallout()
            output.push(line)
          }
        }
      }

      // 处理文件末尾未关闭的呼号
      flushCallout()

      // 将处理后的行重新合并为字符串
      file.body = output.join('\n')
    })
  },
})