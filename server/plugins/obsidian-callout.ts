/**
 * Nitro plugin: Obsidian Callout → MDC preprocessor
 *
 * Converts Obsidian-style callout syntax into Nuxt Content's native MDC format
 * using a line-by-line state machine. NO single global regex.
 *
 * Input:
 *   > [!info] My Title
 *   > Some **bold** content
 *   > with a [link](url)
 *
 * Output:
 *   ::callout{type="info" title="My Title"}
 *   Some **bold** content
 *   with a [link](url)
 *   ::
 *
 * Break condition: a non-empty line that does NOT start with '>' immediately
 * terminates the callout state, preventing accidental paragraph swallowing.
 */

const CALLOUT_TRIGGER = /^>\s*\[!(\w+)\]\s*(.*)/

export default defineNitroPlugin((nitroApp) => {
  // @ts-expect-error: Nuxt Content v3 hook type not in Nitro's built-in types
  nitroApp.hooks.hook('content:file:beforeParse', (file: { _id: string; body: string }) => {
    if (!file._id.endsWith('.md')) return

    const lines = file.body.split('\n')
    const output: string[] = []

    let inCallout = false
    let calloutType = ''
    let calloutTitle = ''
    let calloutBody: string[] = []

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
      if (!inCallout) {
        const match = line.match(CALLOUT_TRIGGER)
        if (match) {
          inCallout = true
          calloutType = (match[1] ?? '').toLowerCase()
          calloutTitle = (match[2] ?? '').trim()
        }
        else {
          output.push(line)
        }
      }
      else {
        // Inside callout state
        const isEmptyLine = line.trim() === ''
        const isBlockquoteLine = line.startsWith('>')

        if (isEmptyLine) {
          // Empty lines are allowed inside a callout — preserve them
          calloutBody.push('')
        }
        else if (isBlockquoteLine) {
          // Strip the leading '> ' (or just '>') and collect inner content
          const stripped = line.replace(/^>\s?/, '')
          calloutBody.push(stripped)
        }
        else {
          // Non-empty line not starting with '>' — terminate callout immediately
          flushCallout()
          output.push(line)
        }
      }
    }

    // Flush any open callout at end of file
    flushCallout()

    file.body = output.join('\n')
  })
})
