<template>
   <div class="dropdown-2" :class="{ 'dropdown-2--active': isActive, 'dropdown-2--disabled': disabled }" ref="dropdown">
      <div v-if="label" class="dropdown-2__label">{{ label }}</div>
      <div class="dropdown-2__input" @click="toggleDropdown" :class="{ 'dropdown-2__input--disabled': disabled }">
         <div class="input-text-2 input-text-2--with-clear input-wrapper --check-fill">
            <input class="input-text-2__input" type="text" :value="selectedOptionsTitles.join(', ')"
               :placeholder="placeholder" readonly :disabled="disabled" />
         </div>
      </div>
      <ul class="dropdown-2__list">
         <li v-for="option in options" :key="option.id" class="dropdown-2__list-item"
            :class="{ 'dropdown-2__list-item--active': temporarySelectedOptions.includes(option.id) }"
            @click="handleItemClick(option.id)">
            <CheckboxUI :modelValue="temporarySelectedOptions.includes(option.id)"
               @update:modelValue="val => toggleOption(option.id, val)" size="16" tabindex="0" @click.stop />
            {{ option.title }}
         </li>
         <li class="dropdown-2__actions">
            <button class="dropdown-2__btn" @click.stop="applySelection">Сохранить</button>
            <button class="dropdown-2__btn dropdown-2__btn--cancel" @click.stop="cancelSelection">Сбросить</button>
         </li>
      </ul>
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
import { useDropdownStore } from '@/store/dropdownStore'

const props = defineProps({
   options: { type: Array, required: true },
   label: { type: String, default: '' },
   disabled: { type: Boolean, default: false },
   initialSelectedOptions: { type: Array, default: () => [] },
   placeholder: { type: String, default: 'Нажмите' }
})

const emit = defineEmits(['updateSort'])

const dropdownStore = useDropdownStore()
const dropdownId = Math.random().toString(36).substr(2, 9)

const selectedOptions = ref([...props.initialSelectedOptions])
const temporarySelectedOptions = ref([...props.initialSelectedOptions])
const isActive = ref(false)

const selectedOptionsTitles = computed(() => {
   return props.options
      .filter(option => selectedOptions.value.includes(option.id))
      .map(option => option.title)
})

const toggleDropdown = () => {
   if (props.disabled) return
   isActive.value ? dropdownStore.close() : dropdownStore.open(dropdownId)
}

const handleItemClick = (id) => {
   const isSelected = temporarySelectedOptions.value.includes(id)
   toggleOption(id, !isSelected)
}

watch(() => dropdownStore.activeDropdownId, (newId) => {
   isActive.value = newId === dropdownId
   if (isActive.value) {
      temporarySelectedOptions.value = [...selectedOptions.value]
   }
})

const toggleOption = (id, isSelected) => {
   const index = temporarySelectedOptions.value.indexOf(id)
   if (isSelected && index === -1) {
      temporarySelectedOptions.value.push(id)
   } else if (!isSelected && index !== -1) {
      temporarySelectedOptions.value.splice(index, 1)
   }
}

const applySelection = () => {
   selectedOptions.value = [...temporarySelectedOptions.value]
   emit('updateSort', selectedOptions.value)
   dropdownStore.close()
}

const cancelSelection = () => {
   selectedOptions.value = []
   temporarySelectedOptions.value = []
   emit('updateSort', [])
   dropdownStore.close()
}

const handleClickOutside = (event) => {
   if (!props.disabled && !event.target.closest('.dropdown-2')) {
      dropdownStore.close()
   }
}

onMounted(() => {
   document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
   document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.dropdown-2 {
   position: relative;
   width: 260px;

   @media (max-width: 1250px) {
      max-width: 100%;
      width: 100%;
   }

   &__label {
      font-size: 12px;
      color: #323232;
      margin-bottom: 5px;
   }

   &__input {
      position: relative;
      height: 34px;
      width: 100%;

      &:focus {
         outline: none;
      }

      &::before {
         pointer-events: none;
         position: absolute;
         right: 14px;
         top: 50%;
         z-index: 1;
         content: '';
         width: 11px;
         height: 11px;
         background: url('@/assets/images/svg/arrow.svg') center center / contain no-repeat;
         transform: translate(0, -50%) rotate(90deg);
         transition: 0.3s;
      }

      input {
         cursor: pointer;
         width: 100%;
         font-size: 14px;
         height: 34px;
         padding: 12px;
         border: 1px solid #d6d6d6;
         border-radius: 6px;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
         padding-right: 36px;

         &:focus {
            outline: none;
         }
      }
   }

   .selected-options {
      font-size: 14px;
      color: #323232;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   .selected-option {
      margin-right: 4px;
      font-size: 14px;
      color: #323232;
   }

   &__list {
      position: absolute;
      bottom: 0;
      border: 1px solid #3366FF;
      border-top: 1px solid #D6D6D6;
      left: 0;
      z-index: 5;
      flex-direction: column;
      list-style: none;
      width: 100%;
      background: #ffffff;
      border-radius: 6px;
      overflow-y: auto;
      max-height: 260px;
      transition: transform 0.2s ease;
      transform-origin: top;
      transform: translate(0, 100%) scaleY(0);
   }

   &__list-item {
      display: flex;
      align-items: center;
      padding: 12px;
      font-size: 14px;
      min-height: 43px;
      gap: 10px;
      color: #787878;
      background: white;
      transition: 0.3s;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: background-color 0.1s ease, color 0.1s ease;

      &:hover {
         background-color: #D6EFFF;
         color: #3366FF;
      }

      &--active {
         color: #3366FF;
         background-color: #eef9ff;
      }
   }

   &--active {
      .dropdown-2__input::before {
         transform: translate(0, -50%) rotate(-90deg);
      }

      .dropdown-2__list {
         display: flex;
         border-radius: 0 0 6px 6px;
         border: 1px solid #3366FF;
         border-top: none;
         transform: translate(0, 100%) scaleY(1);
      }

      .dropdown-2__input input {
         border-radius: 6px 6px 0 0;
         border: 1px solid #3366FF;
      }
   }

   &--disabled {
      .dropdown-2__input {
         background: #EEEEEE;
         border-radius: 6px;
      }

      input {
         background: #EEEEEE;
         pointer-events: none;
         border: 1px solid #EEEEEE;
         border-radius: 6px;
      }

      .dropdown-2__input::before {
         background: url('@/assets/icons/arrow-gray.svg') center center / contain no-repeat;
         transform: translate(0, -50%);
      }

      &::placeholder {
         color: #787878;
      }
   }
}

.dropdown-2__actions {
   display: flex;
   position: sticky;
   bottom: 0;
   width: 100%;
   justify-content: space-between;
   padding: 12px;
   gap: 16px;
   border-top: 1px solid #D6D6D6;
   background: #fff;
}

.dropdown-2__btn {
   flex: 1;
   display: flex;
   justify-content: center;
   align-items: center;
   height: 28px;
   background-color: #3366FF;
   color: white;
   font-size: 12px;
   line-height: 16px;
   border-radius: 6px;
   border: none;
   cursor: pointer;
   transition: background-color 0.2s;

   &:hover {
      background-color: #1e4dcc;
   }

   &--cancel {
      background-color: #D6EFFF;
      color: #3366FF;

      &:hover {
         background-color: #A4DCFF;
      }
   }
}
</style>