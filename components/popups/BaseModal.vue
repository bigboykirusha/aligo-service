<template>
  <Teleport to="body" :disabled="!teleportToBody">
    <Transition name="ios-sheet-mobile" appear>
      <div
v-if="modelValue" class="popup-overlay" :class="{
      'popup-overlay--padded': overlayPadded,
      'popup-overlay--fullscreen': fullScreen,
      'popup-overlay--keyboard-gap-fill': keyboardGapFill
    }" :style="overlayStyle" @click="onOverlayClick">
        <div
ref="modalRef" class="popup-modal" :class="{
        'popup-modal--fullscreen': fullScreen,
        'popup-modal--fullscreen-app-layout': fullScreen && useFullScreenAppLayout
      }"
        :style="[modalStyle, mobileSheetDragStyle]" role="dialog" aria-modal="true"
        :aria-labelledby="title ? titleId : undefined" tabindex="-1" @click.stop
        @touchstart="handleMobileSheetTouchStart" @touchmove="handleMobileSheetTouchMove"
        @touchend="handleMobileSheetTouchEnd" @touchcancel="handleMobileSheetTouchEnd">

        <div v-if="showMobileGrabber && !fullScreen" class="popup-modal__grabber" />

        <div
          v-if="$slots.header || title || showClose"
          class="popup-modal__header"
          :class="{ 'popup-modal__header--no-border': !headerBorder }">
          <slot name="header">
            <span :id="titleId" class="popup-modal__title">{{ title }}</span>
          </slot>
          <button v-if="showClose" type="button" class="popup-modal__close" @click="close">
            <img src="/assets/icons/new/close-icon.svg" alt="" width="16" height="16">
          </button>
        </div>

        <div
v-if="showBody && $slots.default" class="popup-modal__body" :class="{
          'popup-modal__body--no-scroll': !bodyScrollable,
          'popup-modal__body--full-height': fullHeightBody
        }">
          <slot />
        </div>

        <div
v-if="$slots.footer" class="popup-modal__footer" :class="[
          `align-${footerAlign}`,
          `direction-${footerDirection}`,
          { 'popup-modal__footer--minimized': footerMinimized }
        ]" :style="{ gap: typeof footerGap === 'number' ? `${footerGap}px` : footerGap }">
          <slot name="footer" />
        </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useUiStore } from '@/store/ui'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  showClose: {
    type: Boolean,
    default: true
  },
  headerBorder: {
    type: Boolean,
    default: true
  },
  width: {
    type: [String, Number],
    default: null
  },
  size: {
    type: String,
    default: null // 'sm' | 'md' | 'lg' | 'xl' | 'auto'
  },
  id: {
    type: String,
    default: () => `modal-${Math.random().toString(36).slice(2, 11)}`
  },
  showBody: {
    type: Boolean,
    default: true
  },
  bodyScrollable: {
    type: Boolean,
    default: true
  },
  footerAlign: {
    type: String,
    default: 'end' // start | center | end
  },
  footerDirection: {
    type: String,
    default: 'row' // row | column
  },
  footerGap: {
    type: [String, Number],
    default: 24
  },
  footerMinimized: {
    type: Boolean,
    default: false
  },
  overlayPadded: {
    type: Boolean,
    default: false
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  showMobileGrabber: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  restoreFocusOnClose: {
    type: Boolean,
    default: true
  },
  focusContainerOnOpen: {
    type: Boolean,
    default: true
  },
  keyboardGapFill: {
    type: Boolean,
    default: false
  },
  fullHeightBody: {
    type: Boolean,
    default: false
  },
  useFullScreenAppLayout: {
    type: Boolean,
    default: true
  },
  teleportToBody: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close'])
const uiStore = useUiStore()
const modalRef = ref(null)
const focusedBeforeOpen = ref(null)
const keyboardInset = ref(0)
const isMobileViewport = ref(false)
const mobileSheetTouchStartY = ref(0)
const mobileSheetDragOffset = ref(0)
const isDraggingMobileSheet = ref(false)
const titleId = computed(() => `${props.id}-title`)
const overlayStyle = computed(() => {
  if (!props.keyboardGapFill) return undefined
  return { '--popup-keyboard-gap': `${keyboardInset.value}px` }
})

const updateKeyboardInset = () => {
  if (!import.meta.client || !props.keyboardGapFill) return
  const viewport = window.visualViewport
  if (!viewport) {
    keyboardInset.value = 0
    return
  }
  const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
  keyboardInset.value = Math.ceil(inset)
}

const attachKeyboardInsetListeners = () => {
  if (!import.meta.client || !props.keyboardGapFill) return
  const viewport = window.visualViewport
  if (!viewport) return
  viewport.addEventListener('resize', updateKeyboardInset)
  viewport.addEventListener('scroll', updateKeyboardInset)
  window.addEventListener('orientationchange', updateKeyboardInset)
  updateKeyboardInset()
}

const detachKeyboardInsetListeners = () => {
  if (!import.meta.client || !props.keyboardGapFill) return
  const viewport = window.visualViewport
  if (viewport) {
    viewport.removeEventListener('resize', updateKeyboardInset)
    viewport.removeEventListener('scroll', updateKeyboardInset)
  }
  window.removeEventListener('orientationchange', updateKeyboardInset)
  keyboardInset.value = 0
}

const modalStyle = computed(() => {
  const sizes = { sm: 360, md: 440, lg: 500, xl: 600 }

  if (props.size) {
    if (props.size === 'auto') return { width: 'max-content' }
    const widthBySize = sizes[props.size] || sizes.md
    return { width: `${widthBySize}px` }
  }

  if (props.width != null) {
    if (props.width === 'content' || props.width === 'auto') return { width: 'max-content' }
    if (typeof props.width === 'number') return { width: `${props.width}px` }
    return { width: String(props.width) }
  }

  return { width: `${sizes.md}px` }
})

const mobileSheetDragStyle = computed(() => {
  if (!isMobileViewport.value || props.fullScreen || !props.modelValue) return undefined
  return {
    transform: `translateY(${mobileSheetDragOffset.value}px)`,
    transition: isDraggingMobileSheet.value ? 'none' : undefined
  }
})

const updateIsMobileViewport = () => {
  if (!import.meta.client) return
  isMobileViewport.value = window.innerWidth <= 768
}

const resetMobileSheetDrag = () => {
  mobileSheetDragOffset.value = 0
  isDraggingMobileSheet.value = false
}

const close = () => {
  if (!props.modelValue) return
  resetMobileSheetDrag()
  emit('update:modelValue', false)
  emit('close')
}

const onOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

const handleEscape = (event) => {
  if (!props.modelValue || !props.closeOnEscape) return
  if (event.key !== 'Escape' && event.key !== 'Esc') return
  event.preventDefault()
  close()
}

const handleMobileSheetTouchStart = (event) => {
  if (!isMobileViewport.value || props.fullScreen || !props.modelValue) return
  const target = event.target
  if (!(target instanceof HTMLElement)) return
  if (!target.closest('.popup-modal__header, .popup-modal__grabber')) return
  const touch = event.touches?.[0]
  if (!touch) return
  mobileSheetTouchStartY.value = touch.clientY
  isDraggingMobileSheet.value = true
}

const handleMobileSheetTouchMove = (event) => {
  if (!isDraggingMobileSheet.value) return
  const touch = event.touches?.[0]
  if (!touch) return
  const deltaY = Math.max(0, touch.clientY - mobileSheetTouchStartY.value)
  mobileSheetDragOffset.value = deltaY
  if (deltaY > 0) {
    event.preventDefault()
  }
}

const handleMobileSheetTouchEnd = () => {
  if (!isDraggingMobileSheet.value) return
  const shouldClose = mobileSheetDragOffset.value > 88
  resetMobileSheetDrag()
  if (shouldClose) {
    close()
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      resetMobileSheetDrag()
    }
    if (isOpen) {
      if (props.restoreFocusOnClose && import.meta.client) {
        focusedBeforeOpen.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
      }

      if (props.lockScroll) {
        uiStore.lockScroll(`modal-${props.id}`)
      }
      attachKeyboardInsetListeners()

      nextTick(() => {
        if (props.focusContainerOnOpen) {
          modalRef.value?.focus()
        }
      })
      return
    }

    if (props.lockScroll) {
      uiStore.unlockScroll(`modal-${props.id}`)
    }
    detachKeyboardInsetListeners()

    if (props.restoreFocusOnClose && focusedBeforeOpen.value) {
      focusedBeforeOpen.value.focus()
      focusedBeforeOpen.value = null
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (import.meta.client) {
    updateIsMobileViewport()
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', updateIsMobileViewport, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', handleEscape)
    window.removeEventListener('resize', updateIsMobileViewport)
  }

  if (props.lockScroll && props.modelValue) {
    uiStore.unlockScroll(`modal-${props.id}`)
  }
  detachKeyboardInsetListeners()
  resetMobileSheetDrag()
})
</script>

<style scoped lang="scss">
.popup-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
}

.popup-overlay--padded {
  padding: 16px;
}

.popup-overlay--keyboard-gap-fill::after {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--popup-keyboard-gap, 0px);
  background: #fff;
  pointer-events: none;
  z-index: 0;
}

.popup-modal {
  --popup-color-primary: #3366FF;
  --popup-color-primary-hover: #144DF8;
  --popup-color-text: #323232;
  --popup-color-text-muted: #787878;
  --popup-color-border: #D6D6D6;
  --popup-color-surface: #FFFFFF;
  --popup-color-surface-soft: #F8FAFC;
  --popup-radius: 6px;
  --popup-space-xs: 8px;
  --popup-space-sm: 12px;
  --popup-space-md: 16px;
  --popup-space-lg: 24px;
  --popup-space-xl: 40px;

  background: var(--popup-color-surface);
  border-radius: var(--popup-radius);
  box-shadow: 0 16px 48px rgba(10, 20, 35, 0.28);
  max-width: 100%;
  padding: var(--popup-space-xl);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow: visible;
  color: var(--popup-color-text);
  outline: none;

  :deep(textarea),
  :deep(input[type='text']),
  :deep(input[type='tel']),
  :deep(input[type='email']) {
    border-radius: var(--popup-radius);
    border: 1px solid var(--popup-color-border);
    color: var(--popup-color-text);
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  }

  :deep(textarea:focus),
  :deep(input[type='text']:focus),
  :deep(input[type='tel']:focus),
  :deep(input[type='email']:focus) {
    outline: none;
    border-color: var(--popup-color-primary);
  }

  @media (max-width: 768px) {
    width: 100% !important;
    margin-top: auto;
    border-radius: 16px 16px 0 0;
    max-height: min(84dvh, 760px);
    padding: var(--popup-space-lg) var(--popup-space-md) calc(var(--popup-space-lg) + env(safe-area-inset-bottom));
    box-shadow: 0 -12px 36px rgba(10, 20, 35, 0.26);
  }

  &__grabber {
    display: none;

    @media (max-width: 768px) {
      display: block;
      display: none;
      width: 36px;
      height: 5px;
      border-radius: 999px;
      background: #d1d5db;
      margin: 0 auto var(--popup-space-lg);
      flex-shrink: 0;
      touch-action: pan-y;
    }
  }

  &__header {
    padding-bottom: var(--popup-space-lg);
    border-bottom: 1px solid var(--popup-color-border);
    display: flex;
    justify-content: space-between;
    gap: var(--popup-space-sm);
    touch-action: pan-y;

    &--no-border {
      border-bottom: none;
    }
  }

  &__title {
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
    color: var(--popup-color-primary);
    text-align: left;
  }

  &__close {
    position: absolute;
    top: var(--popup-space-xs);
    right: var(--popup-space-xs);
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--popup-color-primary);
    line-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    &:hover {
      color: var(--popup-color-primary-hover);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &__body {
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;

    &--full-height {
      flex: 1;
    }

    &--no-scroll {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
  }

  &__footer {
    border-top: 1px solid var(--popup-color-border);
    padding-top: var(--popup-space-lg);
    background: var(--popup-color-surface);
    display: flex;
    gap: var(--popup-space-lg);
    justify-content: flex-end;

    &--minimized {
      border-top: none;
    }

    @media (max-width: 768px) {
      flex-direction: column;

      :deep(button) {
        width: 100%;
      }
    }

    &.align-start {
      justify-content: flex-start;
    }

    &.align-center {
      justify-content: center;
    }

    &.align-end {
      justify-content: flex-end;
    }

    &.direction-column {
      flex-direction: column;
    }

    &.direction-row {
      flex-direction: row;
    }
  }
}

@media (max-width: 768px) {
  .popup-overlay {
    align-items: flex-end;
  }

  .popup-overlay--padded.popup-overlay--fullscreen {
    padding: 0;
  }

  .popup-modal--fullscreen {
    width: 100% !important;
    height: 100%;
    max-height: 100dvh;
    border-radius: 0 !important;
    box-shadow: none;
    margin: 0;
  }

  .popup-modal--fullscreen-app-layout {
    padding: var(--popup-space-lg) var(--popup-space-md) calc(var(--popup-space-lg) + env(safe-area-inset-bottom));
    overflow: hidden;
  }

  .popup-modal--fullscreen-app-layout .popup-modal__header,
  .popup-modal--fullscreen-app-layout .popup-modal__body,
  .popup-modal--fullscreen-app-layout .popup-modal__footer {
    width: 100%;
    box-sizing: border-box;
  }

  .popup-modal--fullscreen-app-layout .popup-modal__body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .popup-modal--fullscreen-app-layout .popup-modal__footer {
    flex-shrink: 0;
    margin-top: auto;
  }

  .popup-modal__header {
    justify-content: flex-start;
    align-items: flex-start;
  }

  .popup-modal__title {
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
  }

  .popup-modal__close {
    position: static;
    margin-left: auto;
  }

  .popup-modal__close svg {
    width: 16px;
    height: 16px;
  }
}
</style>
