<template>
   <div class="checkbox-list">
      <div v-if="label" class="checkbox-list__label">{{ label }}</div>
      <div class="checkbox-list__items">
         <div
v-for="option in options" :key="option.id" class="checkbox-list__item"
            :class="{ 'checkbox-list__item--single': isSingle }" @click="handleRowClick(option.id)">
            <CheckboxUI
:model-value="selectedIds.includes(option.id)" size="16" tabindex="0"
               @click.stop="toggleCheckbox(option.id)" />
            <label class="checkbox-list__title">{{ option.title }}</label>
         </div>
      </div>
   </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const emit = defineEmits(['updateSelected'])
const props = defineProps({
   options: {
      type: Array,
      required: true
   },
   label: {
      type: String,
      default: ''
   },
   activeIndexes: {
      type: Array,
      default: () => []
   },
   oneColumn: {
      type: Boolean,
      default: false
   }
})

const selectedIds = ref([...props.activeIndexes])
const isSingle = computed(() => props.options.length === 1 || props.oneColumn)

watch(
   () => props.activeIndexes,
   (nextValue) => {
      selectedIds.value = Array.isArray(nextValue) ? [...nextValue] : []
   },
   { deep: true }
)

const handleRowClick = (id) => {
   toggleCheckbox(id)
}

const toggleCheckbox = (id) => {
   const isSelected = selectedIds.value.includes(id)
   updateCheckbox(id, !isSelected)
}

const updateCheckbox = (id, isChecked) => {
   if (isChecked && !selectedIds.value.includes(id)) {
      selectedIds.value.push(id)
   } else if (!isChecked && selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter((i) => i !== id)
   }
   emit('updateSelected', selectedIds.value)
}
</script>

<style scoped lang="scss">
.checkbox-list {
   display: flex;
   flex-direction: column;
   gap: 5px;

   &__label {
      font-size: 12px;
      color: #323232;
      margin-bottom: 5px;
   }

   &__items {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
   }

   &__item {
      flex: 0 0 48%;
      display: flex;
      gap: 8px;
      align-items: center;

      &--single {
         flex: 0 0 100%;
      }

      label {
         font-size: 14px;
         color: #323232;
      }
   }
}
</style>
