<template>
  <button
    :type="type"
    class="ui-button"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="ui-button__spinner" aria-hidden="true" />
    <span v-else class="ui-button__content">
      <slot />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary' // 'primary' | 'secondary' | 'ghost' | 'danger'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'button'
  }
})

defineEmits(['click'])

const buttonClasses = computed(() => [
  `ui-button--${props.variant}`,
  { 'ui-button--block': props.block }
])
</script>

<style lang="scss">
.ui-button {
  height: 34px;
  border-radius: 6px;
  font-size: var(--font-size-14);
  line-height: var(--line-height-14);
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  user-select: none;
}

.ui-button--block {
  width: 100%;
  display: flex;
}

.ui-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}options-menu

/* Состояние disabled */
.ui-button:disabled {
  background: #EEEEEE;
  color: var(--color-text-muted);
  cursor: not-allowed;
}

/* Primary: белый текст, синий фон */
.ui-button--primary {
  background: var(--color-text-accent);
  color: var(--color-text-inverse);
}
.ui-button--primary:not(:disabled):hover {
  background: #144DF8;
}

/* Secondary: синий текст, светло-синий фон */
.ui-button--secondary {
  background: #D6EFFF;
  color: var(--color-text-accent);
}
.ui-button--secondary:not(:disabled):hover {
  background: #A4DCFF;
}

/* Ghost: белый фон, синий текст и бордер */
.ui-button--ghost {
  background: var(--color-surface);
  color: var(--color-text-accent);
}
.ui-button--ghost:not(:disabled):hover {
  background: #F8FBFF;
}

/* Danger (для подтверждений удаления) */
.ui-button--danger {
  background: #EF4444;
  color: #FFFFFF;
}
.ui-button--danger:not(:disabled):hover {
  background: #DC2626;
}

/* Спиннер 16x16, цвет наследуется от текста (currentColor) */
.ui-button__spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ui-btn-spin 0.8s linear infinite;
}

@keyframes ui-btn-spin {
  to { transform: rotate(360deg); }
}
</style>
