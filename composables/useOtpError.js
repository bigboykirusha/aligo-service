import { onBeforeUnmount, ref } from 'vue'

export function useOtpError(options = {}) {
  const duration = options.duration ?? 800
  const hasError = ref(false)
  let timerId = null

  const flash = () => {
    hasError.value = false
    if (timerId) {
      clearTimeout(timerId)
      timerId = null
    }
    requestAnimationFrame(() => {
      hasError.value = true
      timerId = setTimeout(() => {
        hasError.value = false
        timerId = null
      }, duration)
    })
  }

  onBeforeUnmount(() => {
    if (timerId) {
      clearTimeout(timerId)
      timerId = null
    }
  })

  return { hasError, flash }
}
