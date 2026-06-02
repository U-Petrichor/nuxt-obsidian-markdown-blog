/**
 * Nuxt 模块：代码围栏语言别名映射
 *
 * 挂载到 Nuxt Content 的 `content:file:beforeParse` 钩子，
 * 在 Markdown 解析之前将代码围栏中的非标准语言标识符替换为 Shiki 标准 ID。
 *
 * 例如：```C# → ```csharp，```c++ → ```cpp，```F# → ```fsharp
 */

import { defineNuxtModule } from '@nuxt/kit'

// 语言别名映射：常见非标准写法 → Shiki 标准 ID
const LANG_ALIASES: Record<string, string> = {
  'c#': 'csharp',
  'f#': 'fsharp',
  'c++': 'cpp',
  'obj-c': 'objc',
  'objective-c': 'objc',
  'objective-c++': 'objc',
}

// 匹配代码围栏起始行：```lang 或 ~~~lang（可能后跟空格和 meta）
const FENCE_OPEN = /^(`{3,}|~{3,})(\S*)(.*)/

export default defineNuxtModule({
  meta: {
    name: 'lang-alias',
  },
  setup(_options, nuxt) {
    nuxt.hook('content:file:beforeParse', (ctx: { file: { id: string; body: string; path: string } }) => {
      const { file } = ctx
      if (!file.path.endsWith('.md')) return

      const lines = file.body.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(FENCE_OPEN)
        if (match) {
          const langRaw = match[2]!
          if (langRaw) {
            const lower = langRaw.toLowerCase()
            const mapped = LANG_ALIASES[lower] || lower
            if (mapped !== langRaw) {
              lines[i] = match[1] + mapped + match[3]
            }
          }
        }
      }

      file.body = lines.join('\n')
    })
  },
})