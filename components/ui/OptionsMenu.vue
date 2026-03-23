<template>
   <Teleport v-if="isMobile" to="body">
      <div
         ref="overlayRef"
         class="options-menu-overlay options-menu-overlay--mobile"
         tabindex="-1"
         @click="$emit('close')"
         @keydown.esc.prevent="$emit('close')"
      >
         <div
            ref="panelRef"
            class="options-menu options-menu--mobile"
            @click.stop
         >
            <div
               v-for="(item, index) in items"
               :key="index"
               class="options-menu__item"
               @click="handleAction(item)"
            >
               <img :src="item.icon" :alt="item.text" class="options-menu__icon">
               <span class="options-menu__text">{{ item.text }}</span>
            </div>
         </div>
      </div>
   </Teleport>

   <div
      v-else
      ref="overlayRef"
      class="options-menu-overlay options-menu-overlay--desktop"
      tabindex="-1"
      @keydown.esc.prevent="$emit('close')"
   >
      <div
         ref="panelRef"
         class="options-menu options-menu--desktop"
         @click.stop
      >
         <div
            v-for="(item, index) in items"
            :key="index"
            class="options-menu__item"
            @click="handleAction(item)"
         >
            <img :src="item.icon" :alt="item.text" class="options-menu__icon">
            <span class="options-menu__text">{{ item.text }}</span>
         </div>
      </div>
   </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const DESKTOP_BREAKPOINT = 768

const props = defineProps({
   items: {
      type: Array,
      required: true
   },
   isMobileSheet: {
      type: Boolean,
      default: null
   },
   anchorSelector: {
      type: String,
      default: '.chat-header__options-anchor'
   },
   anchorElement: {
      type: Object,
      default: null
   }
})

const emit = defineEmits(['close'])

const overlayRef = ref(null)
const panelRef = ref(null)
const isMobile = ref(false)

const updateViewportMode = () => {
   if (!import.meta.client) return

   if (typeof props.isMobileSheet === 'boolean') {
      isMobile.value = props.isMobileSheet
      return
   }

   isMobile.value = window.innerWidth <= DESKTOP_BREAKPOINT
}

const handleAction = (item) => {
   item.action?.()
   emit('close')
}

const resolveAnchorElement = () => {
   if (props.anchorElement instanceof Element) return props.anchorElement

   const anchorRefValue = props.anchorElement?.value
   if (anchorRefValue instanceof Element) return anchorRefValue

   if (props.anchorSelector && import.meta.client) {
      return document.querySelector(props.anchorSelector)
   }

   return null
}

const handleDocumentPointerDown = (event) => {
   if (!import.meta.client || isMobile.value) return

   const anchorEl = resolveAnchorElement()
   const panelEl = panelRef.value

   if (anchorEl instanceof Element && anchorEl.contains(event.target)) return
   if (panelEl instanceof Element && panelEl.contains(event.target)) return

   emit('close')
}

onMounted(() => {
   updateViewportMode()
   if (!import.meta.client) return

   window.addEventListener('resize', updateViewportMode, { passive: true })
   document.addEventListener('pointerdown', handleDocumentPointerDown)
   overlayRef.value?.focus?.()
})

onBeforeUnmount(() => {
   if (!import.meta.client) return

   window.removeEventListener('resize', updateViewportMode)
   document.removeEventListener('pointerdown', handleDocumentPointerDown)
})
</script>

<style scoped lang="scss">
.options-menu-overlay {
   position: fixed;
   inset: 0;
   width: 100vw;
   height: 100vh;
   z-index: 119;
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 16px;
   outline: none;

   &--desktop {
      position: absolute;
      top: 0;
      left: auto;
      width: max-content;
      height: auto;
      display: block;
      padding: 0;
      overflow: visible;
      pointer-events: none;
      z-index: 119;
   }

   &--mobile {
      align-items: flex-end;
      justify-content: stretch;
      padding: 0;
      padding-top: env(safe-area-inset-top, 0px);
      padding-right: max(0px, env(safe-area-inset-right, 0px));
      padding-left: max(0px, env(safe-area-inset-left, 0px));
      padding-bottom: env(safe-area-inset-bottom, 0px);
   }
}

.options-menu {
   width: 220px;
   max-height: min(420px, calc(100vh - 32px));
   display: flex;
   flex-direction: column;
   gap: 4px;
   padding: 6px;
   border-radius: 10px;
   border: 1px solid #d6d6d6;
   background: #fff;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.12);
   overflow: hidden;

   &--desktop {
      position: relative;
      top: auto;
      right: auto;
      pointer-events: auto;
   }

   @media (max-width: 768px) {
      width: 100%;
      border-radius: 14px 14px 0 0;
   }

   &__item {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 34px;
      padding: 8px 10px;
      border-radius: 8px;
      cursor: pointer;
      color: #323232;
      transition: background-color 0.2s ease;

      @media (max-width: 768px) {
         min-height: 44px;
         padding: 12px;
      }

      &:hover {
         background: #f8fbff;
      }

      &:active {
         background: #d6efff;
      }
   }

   &__icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
   }

   &__text {
      font-size: 14px;
      line-height: 18px;
      font-weight: 400;
      color: #323232;
   }
}
</style>
