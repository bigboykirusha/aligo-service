<template>
  <div class="otp-container" :class="{ 'otp-container--full': fullWidth }">
    <div
      v-for="(_, idx) in length"
      :key="idx"
      class="otp-input"
      :class="{
        'otp-input--filled': digits[idx],
        'otp-input--error': error,
        'otp-input--active': activeIndex === idx
      }"
      @click="setCaret(idx)"
    >
      {{ digits[idx] || '' }}
    </div>
    <input
      ref="native"
      class="otp-native"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      :value="value"
      @input="onNativeInput"
      @keydown="onNativeKeydown"
      @paste="onNativePaste"
    >
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
const props = defineProps({ modelValue: { type: String, default: '' }, length: { type: Number, default: 4 }, error: { type: Boolean, default: false }, fullWidth: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'complete'])
const native = ref(null)
const value = ref(sanitize(props.modelValue))
const activeIndex = ref(0)
watch(
  () => props.modelValue,
  (nv, ov) => {
    const v = sanitize(nv)
    const prev = sanitize(ov)
    if (v !== value.value) {
      value.value = v
      if (v.length === 0) {
        nextTick(() => setCaret(0))
      } else if (v.length < prev.length) {
        nextTick(() => setCaret(v.length))
      } else {
        updateActiveFromNative()
      }
    }
  }
)
function sanitize(val) { return (val || '').replace(/\D/g, '').slice(0, props.length) }
const digits = computed(() => { const v = sanitize(value.value); return Array.from({ length: props.length }, (_, i) => v[i] || '') })
function emitValue(v) { emit('update:modelValue', v); if (v.length === props.length) emit('complete', v) }
function focusNative() { native.value?.focus({ preventScroll: true }) }
function setCaret(pos) { focusNative(); const p = Math.max(0, Math.min(pos, props.length)); try { native.value?.setSelectionRange(p, p) } catch { void 0 } activeIndex.value = Math.min(p, props.length - 1) }
function updateActiveFromNative() { const el = native.value; let p = el?.selectionStart ?? value.value.length; p = Math.max(0, Math.min(p, props.length)); activeIndex.value = Math.min(p, props.length - 1) }
function onNativeInput(e) { const raw = e.target.value; const v = sanitize(raw); if (v !== value.value) { value.value = v; emitValue(v) } const p = e.target.selectionStart ?? v.length; setCaret(p) }
function onNativeKeydown(e) { const el = native.value; const start = el?.selectionStart ?? 0; const end = el?.selectionEnd ?? 0; if (e.key === 'Backspace' && start === end) { if (start > 0) { const arr = value.value.split(''); arr.splice(start - 1, 1); const v = sanitize(arr.join('')); value.value = v; emitValue(v); nextTick(() => setCaret(start - 1)); e.preventDefault(); return } } if (!/^\d$/.test(e.key) && e.key.length === 1) { e.preventDefault() } }
function onNativePaste(e) { const txt = sanitize(e.clipboardData?.getData('text') || ''); if (!txt) return; value.value = txt; emitValue(txt); nextTick(() => setCaret(txt.length)); e.preventDefault() }
async function focusFirst() { await nextTick(); focusNative(); setCaret(0) }
defineExpose({ focusFirst })
</script>

<style scoped lang="scss">
.otp-container {
  display: flex;
  gap: 26px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 0 2px;
}

.otp-container--full {
  width: 100%;
  justify-content: center;
}

.otp-input {
  width: 56px;
  height: 62px;
  color: #323232;
  font-weight: 700;
  font-size: 32px;
  border: 1px solid #d6d6d6;
  border-radius: 6px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  position: relative;
  cursor: text;
  user-select: none;
  caret-color: transparent;
  /* убрать мигающую полоску ввода */
  will-change: box-shadow, border-color;
}

.otp-input:hover {
  border-color: #787878;
}

.otp-input:focus {
  outline: none;
  border-color: #3366ff;
  box-shadow: none;
}

.otp-input--filled {
  border-color: #d6d6d6;
  box-shadow: none;
}

.otp-native {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
  border: 0;
  padding: 0;
}

.otp-input--active {
  border-color: #3366ff;
  box-shadow: 0 0 0 3px rgba(51, 102, 255, 0.12);
}

.otp-input--error {
  border-color: #ff5959;
  animation: otp-shake 0.22s ease;
}

@keyframes otp-shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-3px);
  }

  50% {
    transform: translateX(3px);
  }

  75% {
    transform: translateX(-2px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
