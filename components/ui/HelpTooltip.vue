<template>
   <div class="help-tooltip" v-bind="$attrs" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <button type="button" :class="['help-tooltip__trigger', triggerClass]" :aria-label="resolvedAriaLabel"
         @click.stop="handleTriggerClick" @focus="handleMouseEnter" @blur="handleMouseLeave">
         <img v-if="resolvedIcon" :src="resolvedIcon" alt="" class="help-tooltip__trigger-icon">
         <span v-if="showTriggerText" class="help-tooltip__trigger-text">{{ text }}</span>
      </button>

      <Transition name="help-tooltip-fade">
         <div v-if="isTooltipVisible && !isMobileViewport" class="help-tooltip__desktop" :class="desktopPlacementClass"
            :style="desktopStyle" @click.stop>
            <div class="help-tooltip__title">{{ title }}</div>
            <div class="help-tooltip__divider" />

            <div v-if="hasItemsLayout" class="help-tooltip__content help-tooltip__content--items">
               <div v-for="(item, index) in items" :key="`${index}-${item.title}`" class="help-tooltip__item">
                  <div class="help-tooltip__item-media">
                     <img :src="item.image" :alt="item.imageAlt || item.title" class="help-tooltip__item-image">
                  </div>
                  <div class="help-tooltip__item-text">
                     <div class="help-tooltip__item-title">{{ item.title }}</div>
                     <div class="help-tooltip__item-subtitle">{{ item.description }}</div>
                  </div>
               </div>
            </div>

            <div v-else class="help-tooltip__content help-tooltip__content--scheme">
               <img v-if="schemeImage" :src="schemeImage" :alt="schemeImageAlt || title"
                  class="help-tooltip__scheme-image">
               <div class="help-tooltip__points">
                  <div v-for="(point, index) in points" :key="`${index}-${point.code}`" class="help-tooltip__point">
                     <span class="help-tooltip__point-dot" :style="{ backgroundColor: point.color }" />
                     <span class="help-tooltip__point-code">{{ point.code }}</span>
                     <span class="help-tooltip__point-text">{{ point.text }}</span>
                  </div>
               </div>
            </div>
         </div>
      </Transition>
   </div>

   <Teleport to="body">
      <Transition name="help-modal-fade">
         <div v-if="isModalVisible" class="help-tooltip-modal" @click.self="closeModal">
            <div class="help-tooltip-modal__dialog" role="dialog" aria-modal="true" :aria-label="resolvedAriaLabel">
               <div class="help-tooltip-modal__header">
                  <div class="help-tooltip-modal__title">{{ title }}</div>
                  <button type="button" class="help-tooltip-modal__close" aria-label="Close" @click="closeModal">
                     <img src="/assets/icons/new/close-icon.svg" alt="" width="16" height="16">
                  </button>
               </div>
               <div class="help-tooltip-modal__divider" />

               <div v-if="hasItemsLayout" class="help-tooltip-modal__content help-tooltip-modal__content--items">
                  <div v-for="(item, index) in items" :key="`${index}-${item.title}`" class="help-tooltip-modal__item">
                     <div class="help-tooltip-modal__item-media">
                        <img :src="item.image" :alt="item.imageAlt || item.title"
                           class="help-tooltip-modal__item-image">
                     </div>
                     <div class="help-tooltip-modal__item-text">
                        <div class="help-tooltip-modal__item-title">{{ item.title }}</div>
                        <div class="help-tooltip-modal__item-subtitle">{{ item.description }}</div>
                     </div>
                  </div>
               </div>

               <div v-else class="help-tooltip-modal__content help-tooltip-modal__content--scheme">
                  <img v-if="schemeImage" :src="schemeImage" :alt="schemeImageAlt || title"
                     class="help-tooltip-modal__scheme-image">
                  <div class="help-tooltip-modal__points">
                     <div v-for="(point, index) in points" :key="`${index}-${point.code}`"
                        class="help-tooltip-modal__point">
                        <span class="help-tooltip-modal__point-dot" :style="{ backgroundColor: point.color }" />
                        <span class="help-tooltip-modal__point-code">{{ point.code }}</span>
                        <span class="help-tooltip-modal__point-code">–</span>
                        <span class="help-tooltip-modal__point-text">{{ point.text }}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Transition>
   </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useUiStore } from '@/store/ui'
import tooltipIcon from '@/assets/icons/tooltip.svg'

defineOptions({
   inheritAttrs: false
})

const props = defineProps({
   title: {
      type: String,
      required: true
   },
   text: {
      type: String,
      default: ''
   },
   icon: {
      type: String,
      default: ''
   },
   iconOnly: {
      type: Boolean,
      default: true
   },
   triggerClass: {
      type: String,
      default: ''
   },
   ariaLabel: {
      type: String,
      default: ''
   },
   items: {
      type: Array,
      default: () => []
   },
   schemeImage: {
      type: String,
      default: ''
   },
   schemeImageAlt: {
      type: String,
      default: ''
   },
   points: {
      type: Array,
      default: () => []
   },
   desktopPlacement: {
      type: String,
      default: 'right-start'
   },
   desktopWidth: {
      type: [Number, String],
      default: 460
   }
})

const uiStore = useUiStore()
const dropdownId = Math.random().toString(36).slice(2, 11)
const mobileScrollLockReason = `help-tooltip:${dropdownId}`

const isTooltipVisible = ref(false)
const isModalVisible = ref(false)
const isMobileViewport = ref(false)

const resolvedIcon = computed(() => props.icon || tooltipIcon)
const showTriggerText = computed(() => !props.iconOnly && Boolean(props.text))
const resolvedAriaLabel = computed(() => props.ariaLabel || props.title)
const hasItemsLayout = computed(() => Array.isArray(props.items) && props.items.length > 0)

const desktopPlacementClass = computed(() =>
   props.desktopPlacement === 'bottom-center'
      ? 'help-tooltip__desktop--bottom-center'
      : 'help-tooltip__desktop--right-start'
)

const desktopStyle = computed(() => {
   const width =
      typeof props.desktopWidth === 'number'
         ? `${props.desktopWidth}px`
         : String(props.desktopWidth || '')

   return width ? { width, maxWidth: width } : null
})

const updateIsMobileViewport = () => {
   if (!import.meta.client) return
   isMobileViewport.value = window.innerWidth <= 768
}

const openModal = () => {
   uiStore.setFloatingDropdownState(true, dropdownId)
}

const closeModal = () => {
   uiStore.clearFloatingDropdown(dropdownId)
}

const showTooltip = () => {
   if (isMobileViewport.value) return
   isTooltipVisible.value = true
}

const hideTooltip = () => {
   isTooltipVisible.value = false
}

const handleMouseEnter = () => {
   showTooltip()
}

const handleMouseLeave = () => {
   hideTooltip()
}

const handleTriggerClick = () => {
   if (isMobileViewport.value) {
      openModal()
      return
   }

   isTooltipVisible.value = !isTooltipVisible.value
}

const handleEscape = (event) => {
   if (event.key === 'Escape') {
      closeModal()
      hideTooltip()
   }
}

const openIfMobile = () => {
   if (isMobileViewport.value) {
      openModal()
   }
}

defineExpose({
   open: openModal,
   openIfMobile
})

onMounted(() => {
   updateIsMobileViewport()
   if (!import.meta.client) return

   window.addEventListener('resize', updateIsMobileViewport, { passive: true })
   document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
   uiStore.clearFloatingDropdown(dropdownId)
   uiStore.unlockScroll(mobileScrollLockReason)
   if (!import.meta.client) return

   window.removeEventListener('resize', updateIsMobileViewport)
   document.removeEventListener('keydown', handleEscape)
})

watch(
   () => uiStore.activeDropdownId,
   (newId) => {
      const wasVisible = isModalVisible.value
      isModalVisible.value = newId === dropdownId

      if (wasVisible && !isModalVisible.value) {
         isTooltipVisible.value = false
      }

      if (isModalVisible.value) {
         hideTooltip()
      }
   }
)

watch(
   isModalVisible,
   (visible) => {
      if (!isMobileViewport.value) return
      if (visible) {
         uiStore.lockScroll(mobileScrollLockReason)
         return
      }
      uiStore.unlockScroll(mobileScrollLockReason)
   }
)
</script>

<style scoped lang="scss">
.help-tooltip {
   position: relative;
   display: inline-flex;
   align-items: center;

   &__trigger {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: none;
      background: transparent;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
   }

   &__trigger-icon {
      width: 12px;
      height: 12px;
      display: block;
      flex-shrink: 0;
   }

   &__trigger-text {
      font-size: 12px;
      line-height: 16px;
      color: inherit;
   }

   &__desktop {
      position: absolute;
      z-index: 10001;
      border-radius: 10px;
      border: 1px solid #e6eaf2;
      background: #fff;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
      padding: 16px;
      color: #323232;
      pointer-events: auto;

      &--right-start {
         top: 0;
         left: calc(100% + 12px);
      }

      &--bottom-center {
         top: calc(100% + 12px);
         left: 50%;
         transform: translateX(-50%);
      }
   }

   &__title {
      font-size: 18px;
      line-height: 22px;
      font-weight: 700;
      color: #3366ff;
   }

   &__divider {
      height: 1px;
      background: #eeeeee;
      margin: 14px 0 16px;
   }

   &__content {
      display: flex;
      gap: 14px;

      &--items {
         flex-direction: column;
         gap: 20px;
      }

      &--scheme {
         align-items: flex-start;
      }
   }

   &__item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
   }

   &__item-media {
      width: 180px;
      min-width: 180px;
      border-radius: 8px;
      background: #f5f8ff;
      overflow: hidden;
   }

   &__item-image {
      width: 100%;
      display: block;
   }

   &__item-text {
      display: flex;
      flex-direction: column;
      gap: 8px;
   }

   &__item-title {
      font-size: 14px;
      line-height: 18px;
      font-weight: 700;
      color: #323232;
   }

   &__item-subtitle {
      font-size: 14px;
      line-height: 18px;
      color: #323232;
   }

   &__scheme-image {
      width: 180px;
      min-width: 180px;
      border-radius: 8px;
      display: block;
   }

   &__points {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
   }

   &__point {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 12px;
      line-height: 16px;
      color: #323232;
   }

   &__point-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      margin-top: 4px;
      flex-shrink: 0;
   }

   &__point-code {
      font-weight: 700;
      flex-shrink: 0;
   }
}

.help-tooltip-modal {
   position: fixed;
   inset: 0;
   z-index: 100100;
   background: rgba(0, 0, 0, 0.42);
   display: flex;
   align-items: center;
   justify-content: center;

   &__dialog {
      width: 100%;
      min-height: 100vh;
      max-height: 100vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      background: #fff;
      padding: 16px;
      padding-top: 0;
      padding-bottom: calc(16px + env(safe-area-inset-bottom));
      padding-left: max(16px, env(safe-area-inset-left));
      padding-right: max(16px, env(safe-area-inset-right));
   }

   &__header {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 24px 0;
      background: #fff;
      border-bottom: 1px solid #EEE;
   }

   &__title {
      font-size: 16px;
      line-height: 20px;
      font-weight: 700;
      color: #3366ff;
   }

   &__close {
      border: none;
      background: transparent;
      padding: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #323232;
      flex-shrink: 0;
   }

   &__content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 16px;
   }

   &__item {
      display: flex;
      flex-direction: column;
      gap: 12px;
   }

   &__item-media {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      background: #f5f8ff;
   }

   &__item-image,
   &__scheme-image {
      width: 100%;
      display: block;
      border-radius: 8px;
   }

   &__item-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
   }

   &__item-title {
      font-size: 14px;
      line-height: 18px;
      font-weight: 700;
      color: #323232;
   }

   &__item-subtitle {
      font-size: 12px;
      line-height: 18px;
      color: #5a5a5a;
   }

   &__points {
      display: flex;
      flex-direction: column;
      gap: 10px;
   }

   &__point {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 14px;
      line-height: 18px;
      color: #323232;
   }

   &__point-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      margin-top: 5px;
      flex-shrink: 0;
   }

   &__point-code {
      font-weight: 700;
      flex-shrink: 0;
   }
}

.help-tooltip-fade-enter-active,
.help-tooltip-fade-leave-active {
   transition: opacity 0.18s ease, transform 0.18s ease;
}

.help-tooltip-fade-enter-from,
.help-tooltip-fade-leave-to {
   opacity: 0;
}

.help-tooltip-fade-enter-from .help-tooltip__desktop--right-start,
.help-tooltip-fade-leave-to .help-tooltip__desktop--right-start {
   transform: translateX(-6px);
}

.help-tooltip-fade-enter-from .help-tooltip__desktop--bottom-center,
.help-tooltip-fade-leave-to .help-tooltip__desktop--bottom-center {
   transform: translateX(-50%) translateY(-4px);
}

.help-modal-fade-enter-active,
.help-modal-fade-leave-active {
   transition: opacity 0.2s ease;
}

.help-modal-fade-enter-from,
.help-modal-fade-leave-to {
   opacity: 0;
}

@media (max-width: 768px) {
   .help-tooltip__desktop {
      display: none;
   }

   .help-tooltip-modal {
      &__header {
         gap: 16px;
         min-height: 62px;
         padding: 14px 0 16px;
         align-items: center;
         border-bottom: 1px solid #d6d6d6;
      }

      &__close {
         display: inline-flex;
         align-items: center;
         justify-content: center;
         width: 32px;
         height: 32px;
         margin-left: auto;
         padding: 0;
         flex-shrink: 0;
      }

      &__divider {
         display: none;
      }
   }
}
</style>
