<template>
   <div
      class="ui-switcher"
      :class="{
         'ui-switcher--compact': isCompact,
         'ui-switcher--disabled': disabled
      }"
   >
      <div v-if="label" class="ui-switcher__label">
         {{ label }}
      </div>

      <div
         class="ui-switcher__items"
         :class="{ 'ui-switcher__items--disabled': disabled }"
         :style="[itemsStyle, itemsMaxWidth ? { maxWidth: itemsMaxWidth } : null]"
         role="radiogroup"
         :aria-label="label || uiSwitcherLabels.defaultAriaLabel"
      >
         <div v-if="activePosition >= 0" class="ui-switcher__indicator" />

         <button
            v-for="(option, index) in safeOptions"
            :key="option.id"
            type="button"
            class="ui-switcher__item"
            :class="{
               'ui-switcher__item--active': isOptionActive(option.id),
               'ui-switcher__item--disabled': disabled
            }"
            role="radio"
            :aria-checked="isOptionActive(option.id)"
            :tabindex="disabled ? -1 : 0"
            @click="selectOption(option.id)"
            @keydown.enter.prevent="selectOption(option.id)"
            @keydown.space.prevent="selectOption(option.id)"
         >
            {{ formatOptionTitle(option.title) }}
            <div v-if="shouldShowDivider(index)" class="ui-switcher__divider" />
         </button>
      </div>
   </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const uiSwitcherLabels = Object.freeze({
   defaultAriaLabel: '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0430\u0442\u0435\u043b\u044c'
})

const emit = defineEmits(['updateSelected'])

const props = defineProps({
   options: {
      type: Array,
      default: () => []
   },
   label: {
      type: String,
      default: ''
   },
   activeIndex: {
      type: [Number, String, Boolean],
      default: null
   },
   disabled: {
      type: Boolean,
      default: false
   },
   formatMode: {
      type: String,
      default: ''
   },
   maxWidth: {
      type: String,
      default: ''
   },
   variant: {
      type: String,
      default: 'form'
   }
})

const normalizeId = (value) => {
   if (value === null || value === undefined || value === '') return null
   return String(value)
}

const safeOptions = computed(() =>
   Array.isArray(props.options) ? props.options : []
)
const isCompact = computed(() => props.variant === 'compact')
const effectiveFormatMode = computed(() =>
   props.formatMode || (isCompact.value ? 'firstWord' : 'firstChar')
)

const selectedOptionId = ref(normalizeId(props.activeIndex))

const isSameId = (left, right) => normalizeId(left) === normalizeId(right)

watch(
   () => props.activeIndex,
   (newIndex) => {
      selectedOptionId.value = normalizeId(newIndex)
   }
)

watch(
   () => props.options,
   (newOptions) => {
      const nextOptions = Array.isArray(newOptions) ? newOptions : []
      const hasSelected = nextOptions.some((option) =>
         isSameId(option.id, selectedOptionId.value)
      )

      if (!hasSelected) {
         selectedOptionId.value = null
      }
   },
   { deep: true }
)

const activePosition = computed(() => {
   if (selectedOptionId.value === null) return -1

   return safeOptions.value.findIndex((option) =>
      isSameId(option.id, selectedOptionId.value)
   )
})

const optionCount = computed(() => Math.max(safeOptions.value.length, 1))

const itemsStyle = computed(() => ({
   '--ui-switcher-count': optionCount.value,
   '--ui-switcher-index': Math.max(activePosition.value, 0)
}))

const itemsMaxWidth = computed(() => {
   if (props.maxWidth) return props.maxWidth
   if (isCompact.value) return ''
   return safeOptions.value.length >= 4 ? '410px' : '310px'
})

const isOptionActive = (optionId) => isSameId(optionId, selectedOptionId.value)

const selectOption = (optionId) => {
   if (props.disabled) return
   if (isSameId(optionId, selectedOptionId.value)) return

   selectedOptionId.value = normalizeId(optionId)
   emit('updateSelected', optionId)
}

const shouldShowDivider = (index) => {
   if (safeOptions.value.length < 2) return false
   if (activePosition.value < 0) return index < safeOptions.value.length - 1
   if (index === activePosition.value || index === activePosition.value - 1) {
      return false
   }
   return index < safeOptions.value.length - 1
}

const formatOptionTitle = (text) => {
   if (!text) return ''

   if (effectiveFormatMode.value === 'firstWord') {
      const words = String(text).split(' ')
      words[0] =
         words[0].charAt(0).toUpperCase() +
         words[0].slice(1).toLowerCase()
      return words.join(' ')
   }

   return String(text).charAt(0).toUpperCase() + String(text).slice(1)
}
</script>

<style scoped lang="scss">
.ui-switcher {
   display: flex;
   align-items: flex-start;
   gap: 8px;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
   }

   &--compact {
      flex-direction: column;
      gap: 0;
   }

   &__label {
      min-width: 270px;
      color: #323232;
      font-size: 14px;
      line-height: 18px;

      @media (max-width: 768px) {
         font-size: 12px;
         line-height: 16px;
      }
   }

   &--compact &__label {
      min-width: 0;
      margin-bottom: 5px;
      font-size: 12px;
      line-height: 16px;
   }

   &__items {
      --ui-switcher-count: 1;
      --ui-switcher-index: 0;
      position: relative;
      display: flex;
      align-items: stretch;
      width: 100%;
      height: 34px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      overflow: hidden;
      padding: 0;
      background: #fff;
      isolation: isolate;
      -webkit-tap-highlight-color: transparent;

      @media (max-width: 768px) {
         max-width: 100% !important;
      }
   }
   &__item {
      appearance: none;
      position: relative;
      z-index: 2;
      display: flex;
      flex: 1 1 0;
      align-items: center;
      justify-content: center;
      min-width: 0;
      padding: 6px;
      border: 0;
      background: transparent;
      color: #323232;
      font-size: 14px;
      font-weight: 400;
      line-height: 18px;
      white-space: nowrap;
      cursor: pointer;
      transition:
         color 0.2s ease,
         transform 0.15s ease;
      touch-action: manipulation;
      user-select: none;

      &:focus-visible {
         outline: 2px solid #144df8;
         outline-offset: -2px;
         border-radius: 6px;
      }

      &:active {
         transform: scale(0.985);
      }
   }

   &--compact &__item {
      padding: 7.5px 0;
      transition: color 0.3s ease;
   }

   &__item--active {
      color: #fff;
   }

   &__item--disabled {
      color: #a8a8a8;
      cursor: not-allowed;

      &:active {
         transform: none;
      }
   }

   &__item--disabled.ui-switcher__item--active {
      color: #fff;
   }

   &__divider {
      position: absolute;
      right: 0;
      top: 18%;
      bottom: 18%;
      width: 1px;
      background-color: #d6d6d6;
      transition: opacity 0.2s ease;
   }

   &--compact &__divider {
      top: 10%;
      bottom: 10%;
   }

   &__indicator {
      position: absolute;
      top: 2px;
      left: 2px;
      z-index: 1;
      height: calc(100% - 4px);
      width: calc((100% - 4px) / var(--ui-switcher-count));
      border-radius: 4px;
      background: linear-gradient(180deg, #4b7aff 0%, #3366ff 100%);
      transform: translate3d(calc(var(--ui-switcher-index) * 100%), 0, 0);
      transition:
         transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
         opacity 0.2s ease;
      pointer-events: none;
      will-change: transform;
      backface-visibility: hidden;
      box-sizing: border-box;
   }
   &__items--disabled {
      background: #f5f5f5;
      border-color: #ececec;
   }
}

@media (prefers-reduced-motion: reduce) {
   .ui-switcher__indicator,
   .ui-switcher__item {
      transition: none;
   }
}
</style>
