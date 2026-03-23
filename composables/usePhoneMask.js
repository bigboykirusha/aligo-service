import { ref, computed } from 'vue'

export function usePhoneMask(initial = '') {
  const phoneRaw = ref(initial)

  const formattedPhone = computed(() => {
    const numbers = phoneRaw.value.replace(/\D/g, '').slice(0, 10)
    const parts = []
    if (numbers.length > 0) parts.push('(' + numbers.slice(0, 3))
    if (numbers.length >= 3) parts[0] += ')'
    if (numbers.length > 3) parts.push(' ' + numbers.slice(3, 6))
    if (numbers.length > 6) parts.push('-' + numbers.slice(6, 8))
    if (numbers.length > 8) parts.push('-' + numbers.slice(8, 10))
    return '+7 ' + parts.join('')
  })

  const onInput = (e) => {
    let raw = e.target.value.replace(/\D/g, '')
    if (raw.startsWith('8') || raw.startsWith('7')) raw = raw.slice(1)
    else if (raw.startsWith('007')) raw = raw.slice(3)
    if (raw.length > 10) raw = raw.slice(0, 10)
    phoneRaw.value = raw
  }

  const onPaste = (e) => {
    e.preventDefault()
    const clipboard = e.clipboardData.getData('text')
    let raw = clipboard.replace(/\D/g, '')
    if (raw.startsWith('8')) raw = raw.slice(1)
    else if (raw.startsWith('7')) raw = raw.slice(1)
    else if (raw.startsWith('007')) raw = raw.slice(3)
    phoneRaw.value = raw.slice(0, 10)
  }

  const onKeydown = (e) => {
    const target = e.target
    const selectionStart = target.selectionStart
    if ((e.key === 'Backspace' || e.key === 'Delete') && selectionStart <= 3) {
      e.preventDefault()
      return
    }
    const isDigit = /^[0-9]$/.test(e.key)
    if (isDigit && phoneRaw.value.length >= 10 && target.selectionStart === target.selectionEnd) {
      e.preventDefault()
    }
  }

  const onFocus = (e) => {
    if (!phoneRaw.value) {
      const len = e.target.value.length
      e.target.setSelectionRange(len, len)
    }
  }

  const removeFormatting = (phone) => phone.replace(/[^\d+]/g, '')
  const validatePhone = (phone) => /^\+79\d{9}$/.test(removeFormatting(phone))

  return {
    phoneRaw,
    formattedPhone,
    onInput,
    onPaste,
    onKeydown,
    onFocus,
    removeFormatting,
    validatePhone
  }
}
