<template>
   <div class="button-selector">
      <div v-if="label" class="button-selector__label">{{ label }}</div>
      <div class="button-selector__items">
         <button
v-if="showBackButton" class="button-selector__back filters__mobile-back" type="button"
            :aria-label="backAriaLabel" @click="$emit('back')">
            <img :src="backArrowIcon" alt="">
         </button>
         <button
v-if="showAllButton" type="button" :class="[
            'button-selector__button',
            { 'button-selector__button--active': selectedIndex === null }
         ]" @click="selectOption(null)">
            {{ allLabel }}
         </button>
         <button
v-for="option in options" :key="option.id" type="button" :class="[
            'button-selector__button',
            {
               'button-selector__button--active': isSelected(option.id)
            }
         ]" @click="selectOption(option.id)">
            {{ capitalizeFirstWord(option.title) }}
         </button>
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import backArrowIcon from '@/assets/icons/back-icon-2px.svg'

const emit = defineEmits(['updateSelected', 'back'])
const props = defineProps({
   options: {
      type: Array,
      required: true
   },
   label: {
      type: String,
      default: ''
   },
   activeIndex: {
      type: [Number, String, null],
      default: null
   },
   showAllButton: {
      type: Boolean,
      default: true
   },
   allLabel: {
      type: String,
      default: 'Все'
   },
   showBackButton: {
      type: Boolean,
      default: false
   },
   backAriaLabel: {
      type: String,
      default: 'Назад'
   }
})

const selectedIndex = ref(props.activeIndex)

watch(
   () => props.activeIndex,
   (nextValue) => {
      selectedIndex.value = nextValue
   }
)

const capitalizeFirstWord = (text) => {
   if (!text) return ''
   const words = text.split(' ')
   words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase()
   return words.join(' ')
}

const selectOption = (id) => {
   if (selectedIndex.value !== id) {
      selectedIndex.value = id
      emit('updateSelected', selectedIndex.value)
   }
}

const isSelected = (optionId) => {
   // Loose comparison for numbers vs strings (e.g. "1" vs 1)
   // or exact match if both are same type or null
   if (selectedIndex.value === null) return optionId === null
   return String(selectedIndex.value) === String(optionId)
}
</script>

<style scoped lang="scss">
.button-selector {
   display: flex;
   flex-direction: column;
   gap: 5px;

   &__label {
      font-size: 12px;
      font-weight: 400;
      color: #323232;
   }

   &__items {
      display: flex;
      justify-content: flex-start;
      gap: 8px;
      flex-wrap: wrap;

      @media (max-width: 991px) {
         justify-content: flex-start;
      }
   }

   &__back {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border: none;
      border-radius: 6px;
      background: #eef9ff;
      cursor: pointer;

      &:hover {
         background: #A4DCFF;
      }

      img {
         width: 14px;
         height: 14px;
      }
   }

   &__button {
      padding: 0 12px;
      height: 34px;
      font-size: 14px;
      line-height: 18px;
      color: #3366ff;
      background-color: #eef9ff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
      white-space: nowrap;

      &:hover {
         background-color: #a4dcff;
      }

      &--active {
         background-color: #3366ff;
         color: #ffffff;

         &:hover {
            background-color: #3366ff;
            color: #ffffff;
         }
      }
   }
}
</style>
