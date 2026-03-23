<template>
  <button
    type="button"
    class="popup-outline-action"
    :class="{ 'popup-outline-action--full': fullWidth }"
    @click="emit('click', $event)"
  >
    <span v-if="$slots.icon" class="popup-outline-action__icon">
      <slot name="icon" />
    </span>
    <span class="popup-outline-action__label">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  fullWidth: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])
</script>

<style scoped lang="scss">
.popup-outline-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: auto;
  padding: 0 16px;
  height: 34px;
  background: var(--popup-color-surface, #fff);
  border: 1px solid var(--popup-color-primary, #3366ff);
  border-radius: var(--popup-radius, 6px);
  color: var(--popup-color-primary, #3366ff);
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &--full {
    width: 100%;
  }

  &:hover {
    background: #d6efff;
  }

  &:active {
    transform: translateY(1px);
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__label {
    min-width: 0;
  }
}
</style>
