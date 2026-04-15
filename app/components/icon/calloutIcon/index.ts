import Info from './info.vue'
import Note from './note.vue'
import Tip from './tip.vue'
import Success from './success.vue'
import Warning from './warning.vue'
import Important from './important.vue'
import Danger from './danger.vue'
import Error from './error.vue'

export const calloutIconMap = {
  info: Info,
  note: Note,
  tip: Tip,
  success: Success,
  warning: Warning,
  caution: Warning,
  important: Important,
  danger: Danger,
  error: Error,
}

export type CalloutType = keyof typeof calloutIconMap
