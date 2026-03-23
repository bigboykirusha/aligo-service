import { ref, computed } from 'vue'

export function useResendTimer(options = {}) {
  const keyPrefix = options.keyPrefix ?? ''
  const firstDuration = options.firstDuration ?? 60
  const repeatDuration = options.repeatDuration ?? 180
  const firstTimeKey = keyPrefix ? `${keyPrefix}_firstTimeTimestamp` : 'firstTimeTimestamp'
  const endTimeKey = keyPrefix ? `${keyPrefix}_timerEndTime` : 'timerEndTime'

  const timeLeft = ref(0)
  let intervalId = null

  const getStorageItem = (key) => {
    if (!import.meta.client) return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  const setStorageItem = (key, value) => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(key, String(value))
    } catch {
      // Ignore storage write errors in private mode / quota limits.
    }
  }

  const removeStorageItem = (key) => {
    if (!import.meta.client) return
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore storage remove errors.
    }
  }

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const update = (endTime) => {
    const remaining = Math.max(Math.floor((endTime - Date.now()) / 1000), 0)
    timeLeft.value = remaining
    if (remaining === 0) {
      stop()
      removeStorageItem(endTimeKey)
    }
  }

  const start = () => {
    const firstTime = getStorageItem(firstTimeKey)
    const isFirst = !firstTime || Date.now() - firstTime > 24 * 60 * 60 * 1000
    if (isFirst) {
      setStorageItem(firstTimeKey, Date.now())
    }
    stop()
    const duration = isFirst ? firstDuration : repeatDuration
    const endTime = Date.now() + duration * 1000
    setStorageItem(endTimeKey, endTime)
    update(endTime)
    intervalId = setInterval(() => update(endTime), 1000)
  }

  const restore = () => {
    const endTime = parseInt(getStorageItem(endTimeKey), 10)
    if (!endTime || endTime <= Date.now()) return
    update(endTime)
    intervalId = setInterval(() => update(endTime), 1000)
  }

  const formattedTime = computed(() => {
    const m = Math.floor(timeLeft.value / 60)
    const s = timeLeft.value % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  })

  return { timeLeft, formattedTime, start, restore, stop }
}
