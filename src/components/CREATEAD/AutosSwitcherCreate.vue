<template>
   <div class="switcher">
      <div class="switcher__label">{{ label }}</div>
      <div class="switcher__items" :style="{ maxWidth: itemsMaxWidth }">
         <div v-for="(option, index) in options" :key="option.id"
            :class="['switcher__item', { 'switcher__item--active': selectedIndex === (index + 1) }]"
            @click="selectOption(index)" :style="{ width: itemWidth }">
            {{ capitalizeFirstWord(option.title) }}
            <div v-if="shouldShowDivider(index)" class="switcher__divider"></div>
         </div>
         <div v-if="selectedIndex !== null" class="switcher__indicator" :style="indicatorStyle"></div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits, defineProps } from "vue";

const emit = defineEmits(["updateSelected"]);
const props = defineProps({
   options: {
      type: Array,
      required: true,
   },
   label: {
      type: String,
      default: "",
   },
   activeIndex: {
      type: Number,
      default: null,
   },
});

const selectedIndex = ref(props.activeIndex);

watch(
   () => props.activeIndex,
   (newIndex) => {
      selectedIndex.value = newIndex;
   }
);

const selectOption = (index) => {
   const actualIndex = index + 1;
   if (selectedIndex.value !== actualIndex) {
      selectedIndex.value = actualIndex;
      emit("updateSelected", selectedIndex.value);
   }
};

const shouldShowDivider = (index) => {
   const actualIndex = index + 1;
   if (selectedIndex.value === null) {
      return actualIndex < props.options.length;
   }
   if (actualIndex === selectedIndex.value - 1 || actualIndex === selectedIndex.value) {
      return false;
   }
   return actualIndex < props.options.length;
};

const capitalizeFirstWord = (text) => {
   if (!text) return "";
   const words = text.split(" ");
   words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
   return words.join(" ");
};

const indicatorStyle = computed(() => {
   if (selectedIndex.value === null) return {};

   const translateX = (selectedIndex.value - 1) * 100;
   const width = 100 / props.options.length;
   const isFirst = selectedIndex.value === 1;
   const isLast = selectedIndex.value === props.options.length;

   const marginLeft = isFirst
      ? "4px" 
      : selectedIndex.value === 2
         ? "0px" 
         : `${(selectedIndex.value - 1) * 1}px`; 

   return {
      transform: `translateX(${translateX}%)`,
      width: isLast ? `calc(${width}% - 2px)` : `${width}%`, 
      marginLeft, 
   };
});

const itemWidth = computed(() => {
   return `calc(100% / ${props.options.length})`;
});

const itemsMaxWidth = computed(() => {
   return props.label === "Коробка передач" && props.options.length === 4 ? "410px" : "310px";
});
</script>

<style scoped lang="scss">
.switcher {
   display: flex;
   align-items: flex-start;

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      min-width: 270px;
   }

   &__items {
      display: flex;
      position: relative;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      overflow: hidden;
      height: 36px;
      width: 100%;
      max-width: 310px;

      @media (max-width: 768px) {
         max-width: 100% !important;
      }
   }

   &__item {
      flex: 1 1 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 9px 0;
      z-index: 3;
      font-size: 14px;
      line-height: 18px;
      cursor: pointer;
      position: relative;
      transition: color 0.3s;
      white-space: nowrap;

      &--active {
         color: #fff;
      }
   }

   &__divider {
      position: absolute;
      right: 0;
      top: 15%;
      bottom: 15%;
      width: 1px;
      background-color: #d6d6d6;
   }

   &__indicator {
      position: absolute;
      top: 4px;
      bottom: 4px;
      border-radius: 4px;
      background-color: #3366ff;
      transition: transform 0.3s, width 0.3s;
   }
}
</style>