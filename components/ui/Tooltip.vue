<template>
  <div class="tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <transition name="fade">
      <div
        v-if="show"
        class="tooltip"
        :class="[`tooltip--${position}`, `tooltip--variant-${variant}`]"
      >
        {{ text }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  text: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'top',
    validator: (value) =>
      [
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
      ].includes(value)
  },
  variant: {
    type: String,
    default: 'default'
  }
})

const show = ref(false)
</script>

<style scoped lang="scss">
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10001;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e6eaf2;

  &--variant-default {
    background: #ffffff;
    color: #323232;
  }

  &--variant-color {
    background: #3366ff;
    color: #ffffff;
    border-color: #3366ff;
  }

  &--top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
  }

  &--bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(8px);
  }

  &--left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(-8px);
  }

  &--right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(8px);
  }

  &--top-left {
    bottom: 100%;
    right: 0;
    transform: translateY(-8px);
  }

  &--top-right {
    bottom: 100%;
    left: 0;
    transform: translateY(-8px);
  }

  &--bottom-left {
    top: 100%;
    right: 0;
    transform: translateY(8px);
  }

  &--bottom-right {
    top: 100%;
    left: 0;
    transform: translateY(8px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

