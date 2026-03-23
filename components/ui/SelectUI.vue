<template>
   <div
      ref="dropdown"
      class="select-field"
      :class="{
         'select-field--active': isActive,
         'select-field--active-with-list': hasVisibleDesktopList,
         'select-field--disabled': disabled,
         'select-field--row': layout === 'row',
         'select-field--compact': size === 'compact',
         'select-field--no-label': !label
      }"
      v-bind="$attrs"
      :style="rootStyle"
   >
      <div v-if="label" class="select-field__label">{{ label }}</div>
      <div
         class="select-field__control"
         :class="{
            'select-field__control--active': isActive,
            'select-field__control--disabled': disabled,
            'select-field__control--compact': isMobile && mobileCompact
         }"
         @click="toggleDropdown"
      >
         <button
            v-if="isMobile && mobileCompact"
            class="select-field__mobile-trigger"
            type="button"
            :disabled="disabled"
            @click.stop="activateDropdown"
         >
            <img v-if="mobileCompactIcon" :src="mobileCompactIcon" alt="" >
            <span>{{ mobileCompactLabel }}</span>
         </button>
         <div
            v-else
            class="input-text-2 input-text-2--with-clear input-wrapper --check-fill"
         >
            <span
               v-if="showSwatch"
               class="select-field__swatch"
               :style="getColorStyle(selectedColorOption)"
            />
            <input
               class="input-text-2__input select-field__input"
               type="text"
               :value="inputValue"
               :placeholder="placeholder"
               :readonly="inputReadonly"
               :disabled="disabled"
               :class="{ 'select-field__input--with-color': showSwatch }"
               @input="handleInput"
               @focus="handleInputFocus"
               @click.stop
            >
         </div>
         <Transition name="select-list">
            <ul
               v-if="hasVisibleDesktopList"
               class="select-field__list"
               @click.stop
            >
               <li v-if="loading" class="select-field__state">
                  {{ loadingText }}
               </li>
               <li
                  v-for="option in loading ? [] : filteredOptions"
                  :key="option.id"
                  class="select-field__option"
                  :class="{
                     'select-field__option--selected': areOptionIdsEqual(
                        selectedOption,
                        option.id
                     ),
                     'select-field__option--active':
                        isMulti &&
                        hasOptionId(temporarySelectedOptions, option.id)
                  }"
                  @click="handleOptionClick(option.id)"
               >
                  <template v-if="isMulti">
                     <CheckboxUI
                        :model-value="
                           hasOptionId(temporarySelectedOptions, option.id)
                        "
                        size="16"
                        tabindex="0"
                        @update:model-value="
                           (val) => toggleOption(option.id, val)
                        "
                        @click.stop
                     />
                     <span class="select-field__option-text">{{
                        formatTitle(option.title)
                     }}</span>
                  </template>
                  <template v-else>
                     <span
                        v-if="showOptionSwatch"
                        class="select-field__option-swatch"
                        :style="getColorStyle(option.raw)"
                     />
                     <span class="select-field__option-title">{{
                        formatTitle(option.title)
                     }}</span>
                  </template>
               </li>
               <li v-if="isMulti && showActions" class="select-field__actions">
                  <button
                     class="select-field__button"
                     type="button"
                     :disabled="isSaveDisabled"
                     @click.stop="applySelection"
                  >
                     Сохранить
                  </button>
                  <button
                     class="select-field__button select-field__button--cancel"
                     type="button"
                     @click.stop="cancelSelection"
                  >
                     Сбросить
                  </button>
               </li>
            </ul>
         </Transition>
      </div>
   </div>

   <Teleport to="body">
      <Transition name="ios-sheet-mobile" appear>
         <div
            v-if="showMobileSheet"
            class="ios-select"
            :class="{ 'ios-select--fullscreen': searchable }"
         >
            <div class="ios-select__backdrop" @click="closeMobile" />
            <div
               class="ios-select__panel"
               :style="mobileSheetPanelStyle"
               @touchstart="handleMobileSheetTouchStart"
               @touchmove="handleMobileSheetTouchMove"
               @touchend="handleMobileSheetTouchEnd"
               @touchcancel="handleMobileSheetTouchEnd"
            >
               <div class="ios-select__grabber" />
               <div class="ios-select__header">
                  <div class="ios-select__spacer" />
                  <div class="ios-select__title">
                     {{
                        mobileSheetTitle ||
                           label ||
                           (isMulti ? 'Выберите варианты' : 'Выберите значение')
                     }}
                  </div>
                  <button
                     class="ios-select__close"
                     type="button"
                     aria-label="Закрыть"
                     @click="closeMobile"
                  >
                     <img :src="closeIcon" alt="" >
                  </button>
               </div>
               <div v-if="searchable" class="ios-select__search">
                  <input
                     v-model="searchQuery"
                     class="ios-select__input"
                     type="text"
                     placeholder="Начните ввод"
                     @input="handleSearchInput"
                  >
               </div>
               <div class="ios-select__list">
                  <div v-if="loading" class="ios-select__state">
                     {{ loadingText }}
                  </div>
                  <button
                     v-for="option in loading ? [] : filteredOptions"
                     :key="option.id"
                     type="button"
                     class="ios-select__item"
                     :class="{
                        'ios-select__item--active': isMulti
                           ? hasOptionId(temporarySelectedOptions, option.id)
                           : areOptionIdsEqual(selectedOption, option.id)
                     }"
                     @click="handleOptionClick(option.id)"
                  >
                     <template v-if="isMulti">
                        <CheckboxUI
                           :model-value="
                              hasOptionId(temporarySelectedOptions, option.id)
                           "
                           size="16"
                           tabindex="0"
                        />
                        <span class="ios-select__item-text">{{
                           formatTitle(option.title)
                        }}</span>
                     </template>
                     <template v-else>
                        <span
                           v-if="showOptionSwatch"
                           class="ios-select__swatch"
                           :style="getColorStyle(option.raw)"
                        />
                        <span class="ios-select__title-text">{{
                           formatTitle(option.title)
                        }}</span>
                     </template>
                  </button>
               </div>
               <div v-if="isMulti && showActions" class="ios-select__actions">
                  <button
                     class="ios-select__action"
                     type="button"
                     :disabled="isSaveDisabled"
                     @click="applySelection"
                  >
                     Сохранить
                  </button>
                  <button
                     class="ios-select__action ios-select__action--cancel"
                     type="button"
                     @click="cancelSelection"
                  >
                     Сбросить
                  </button>
               </div>
            </div>
         </div>
      </Transition>
   </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useUiStore } from '@/store/ui'
import CheckboxUI from '../CheckboxUI.vue'
import closeIcon from '@/assets/icons/new/close-icon.svg'

const props = defineProps({
   options: {
      type: Array,
      required: true
   },
   label: {
      type: String,
      default: null
   },
   disabled: {
      type: Boolean,
      default: false
   },
   initialSelectedOption: {
      type: [String, Number, Array, null],
      default: null
   },
   initialSelectedOptions: {
      type: Array,
      default: null
   },
   defaultValue: {
      type: [String, Number, null],
      default: null
   },
   placeholder: {
      type: String,
      default: 'Нажмите'
   },
   isRevers: {
      type: Boolean,
      default: false
   },
   selectionMode: {
      type: String,
      default: ''
   },
   searchable: {
      type: Boolean,
      default: false
   },
   searchMode: {
      type: String,
      default: 'startsWith'
   },
   optionLabelKey: {
      type: String,
      default: ''
   },
   optionValueKey: {
      type: String,
      default: ''
   },
   colorMode: {
      type: Boolean,
      default: false
   },
   emitValueAsArray: {
      type: Boolean,
      default: false
   },
   mobileCompact: {
      type: Boolean,
      default: false
   },
   mobileCompactIcon: {
      type: String,
      default: ''
   },
   mobileCompactPrefix: {
      type: String,
      default: ''
   },
   showActions: {
      type: Boolean,
      default: true
   },
   autoSelectFirst: {
      type: Boolean,
      default: false
   },
   capitalizeOptions: {
      type: Boolean,
      default: false
   },
   layout: {
      type: String,
      default: 'column'
   },
   size: {
      type: String,
      default: 'default'
   },
   labelWidth: {
      type: String,
      default: ''
   },
   inputWidth: {
      type: String,
      default: ''
   },
   mobileSheetTitle: {
      type: String,
      default: ''
   },
   preserveSearchValueOnClose: {
      type: Boolean,
      default: false
   },
   loading: {
      type: Boolean,
      default: false
   },
   loadingText: {
      type: String,
      default: 'Загрузка...'
   }
})

const emit = defineEmits(['updateSort', 'search-input', 'open', 'close'])
const uiStore = useUiStore()
const dropdownId = Math.random().toString(36).substr(2, 9)

const isActive = ref(false)
const isMobile = ref(false)
const searchQuery = ref('')
const hasUserTyped = ref(false)
const mobileSheetTouchStartY = ref(0)
const mobileSheetDragOffset = ref(0)
const isDraggingMobileSheet = ref(false)

const rootStyle = computed(() => {
   const style = {}
   if (props.labelWidth) {
      style['--select-label-width'] = props.labelWidth
   }
   if (props.inputWidth) {
      style['--select-input-width'] = props.inputWidth
   }
   return Object.keys(style).length ? style : undefined
})

const isMulti = computed(() => {
   if (props.selectionMode === 'multi') return true
   return Array.isArray(props.initialSelectedOptions)
})

const resolvedOptionValueKey = computed(() => {
   if (props.optionValueKey) return props.optionValueKey
   return props.options?.[0]?.value !== undefined ? 'value' : 'id'
})

const resolvedOptionLabelKey = computed(() => {
   if (props.optionLabelKey) return props.optionLabelKey
   return props.options?.[0]?.label !== undefined ? 'label' : 'title'
})

const normalizedOptions = computed(() => {
   return (props.options || [])
      .map((option) => {
         if (option === null || option === undefined) return null
         if (typeof option === 'string' || typeof option === 'number') {
            return { id: option, title: String(option), raw: option }
         }
         const id = option?.[resolvedOptionValueKey.value]
         const title = option?.[resolvedOptionLabelKey.value]
         if (id === null || id === undefined) return null
         return { id, title: title ?? String(id), raw: option }
      })
      .filter(Boolean)
})

const sortedOptions = computed(() => {
   const base = normalizedOptions.value
   return props.isRevers ? [...base].reverse() : base
})

const filteredOptions = computed(() => {
   if (!props.searchable || !hasUserTyped.value) return sortedOptions.value
   const query = searchQuery.value.toLowerCase().trim()
   if (!query) return sortedOptions.value
   const matcher =
      props.searchMode === 'includes'
         ? (value) => value.includes(query)
         : (value) => value.startsWith(query)
   return sortedOptions.value.filter((option) =>
      matcher(String(option.title || '').toLowerCase())
   )
})

const selectedOption = ref(null)
const selectedOptions = ref([])
const temporarySelectedOptions = ref([])

const normalizeOptionId = (value) =>
   value === null || value === undefined ? null : String(value)

const areOptionIdsEqual = (left, right) =>
   normalizeOptionId(left) !== null &&
   normalizeOptionId(left) === normalizeOptionId(right)

const findOptionIdIndex = (list, id) =>
   Array.isArray(list)
      ? list.findIndex((item) => areOptionIdsEqual(item, id))
      : -1

const hasOptionId = (list, id) => findOptionIdIndex(list, id) !== -1

const isSaveDisabled = computed(
   () => isMulti.value && temporarySelectedOptions.value.length === 0
)

const resolveSingleValue = () => {
   if (Array.isArray(props.initialSelectedOption)) {
      return props.initialSelectedOption.length
         ? props.initialSelectedOption[0]
         : null
   }
   if (
      props.initialSelectedOption !== null &&
      props.initialSelectedOption !== undefined
   ) {
      return props.initialSelectedOption
   }
   if (props.defaultValue !== null && props.defaultValue !== undefined) {
      return props.defaultValue
   }
   return null
}

const displayedSelectedOptionTitle = computed(() => {
   const option = normalizedOptions.value.find(
      (o) => String(o.id) === String(selectedOption.value)
   )
   return option ? String(option.title ?? '') : ''
})

const updateSingleSelection = (value, { syncSearch = false } = {}) => {
   selectedOption.value = value
   const label = displayedSelectedOptionTitle.value
   if (syncSearch || !props.searchable || !hasUserTyped.value) {
      searchQuery.value = label
   }
}

watch(
   () => props.initialSelectedOptions,
   (newValue) => {
      if (Array.isArray(newValue)) {
         selectedOptions.value = [...newValue]
         temporarySelectedOptions.value = [...newValue]
      }
   },
   { immediate: true }
)

watch(
   [() => props.initialSelectedOption, () => props.defaultValue],
   () => {
      if (!isMulti.value) {
         hasUserTyped.value = false
         updateSingleSelection(resolveSingleValue(), { syncSearch: true })
      }
   },
   { immediate: true }
)

watch(
   displayedSelectedOptionTitle,
   (nextTitle) => {
      if (isMulti.value || !props.searchable || hasUserTyped.value) return
      searchQuery.value = nextTitle
   },
   { immediate: true }
)

const selectedOptionsTitles = computed(() => {
   return normalizedOptions.value
      .filter((option) => hasOptionId(selectedOptions.value, option.id))
      .map((option) => String(option.title ?? ''))
})

const inputValue = computed(() => {
   if (isMulti.value) {
      return selectedOptionsTitles.value.join(', ')
   }
   return props.searchable
      ? searchQuery.value
      : displayedSelectedOptionTitle.value
})

const inputReadonly = computed(
   () => isMulti.value || !props.searchable || isMobile.value
)

const showSwatch = computed(
   () => props.colorMode && !isMulti.value && selectedColorOption.value
)
const showOptionSwatch = computed(() => props.colorMode && !isMulti.value)

const selectedColorOption = computed(() => {
   if (!props.colorMode) return null
   const match = normalizedOptions.value.find(
      (option) => String(option.id) === String(selectedOption.value)
   )
   return match?.raw || null
})

const hasVisibleDesktopList = computed(
   () =>
      isActive.value &&
      !isMobile.value &&
      (props.loading ||
         filteredOptions.value.length > 0 ||
         (isMulti.value && props.showActions))
)

const formatTitle = (text) => {
   if (!props.capitalizeOptions) return text
   if (!text) return ''
   return text.charAt(0).toUpperCase() + text.slice(1)
}

const updateIsMobile = () => {
   if (!import.meta.client) return
   isMobile.value = window.innerWidth <= 768
}

const activateDropdown = () => {
   if (props.disabled) return
   uiStore.setFloatingDropdownState(true, dropdownId)
   hasUserTyped.value = false
   if (!props.searchable && !isMulti.value) {
      searchQuery.value = displayedSelectedOptionTitle.value
   }
   emit('open')
}

const toggleDropdown = () => {
   if (props.disabled) return
   if (isMobile.value) {
      if (!isActive.value) {
         activateDropdown()
      }
      return
   }
   if (isActive.value) {
      closeDropdown()
   } else {
      activateDropdown()
   }
}

const openDropdown = () => {
   activateDropdown()
}

const handleInput = (event) => {
   if (inputReadonly.value) return
   searchQuery.value = event.target.value
   hasUserTyped.value = true
   emit('search-input', searchQuery.value)
}

const handleSearchInput = () => {
   hasUserTyped.value = true
   emit('search-input', searchQuery.value)
}

const handleInputFocus = () => {
   activateDropdown()
}

const restoreSearchQueryOnClose = () => {
   if (
      props.searchable &&
      !isMulti.value &&
      !props.preserveSearchValueOnClose &&
      !normalizedOptions.value.some(
         (option) => String(option.title) === searchQuery.value
      )
   ) {
      searchQuery.value = displayedSelectedOptionTitle.value
   }
}

const closeDropdown = () => {
   restoreSearchQueryOnClose()
   emit('close', {
      query: searchQuery.value,
      selectedOption: selectedOption.value
   })
   uiStore.clearFloatingDropdown(dropdownId)
}

const applySelection = () => {
   selectedOptions.value = [...temporarySelectedOptions.value]
   emit('updateSort', selectedOptions.value)
   closeDropdown()
}

const cancelSelection = () => {
   selectedOptions.value = []
   temporarySelectedOptions.value = []
   emit('updateSort', [])
   closeDropdown()
}

const selectOption = (id) => {
   selectedOption.value = id
   const option = normalizedOptions.value.find(
      (item) => String(item.id) === String(id)
   )
   searchQuery.value = option?.title ? String(option.title) : ''
   hasUserTyped.value = false
   emit(
      'updateSort',
      props.emitValueAsArray ? [selectedOption.value] : selectedOption.value
   )
   closeDropdown()
}

const toggleOption = (id, isSelected) => {
   const index = findOptionIdIndex(temporarySelectedOptions.value, id)
   if (isSelected && index === -1) {
      temporarySelectedOptions.value.push(id)
   } else if (!isSelected && index !== -1) {
      temporarySelectedOptions.value.splice(index, 1)
   }
}

const handleOptionClick = (id) => {
   if (isMulti.value) {
      const isSelected = hasOptionId(temporarySelectedOptions.value, id)
      toggleOption(id, !isSelected)
      if (!props.showActions) {
         selectedOptions.value = [...temporarySelectedOptions.value]
         emit('updateSort', [...selectedOptions.value])
      }
      return
   }
   selectOption(id)
}

const handleClickOutside = (event) => {
   if (isMobile.value) return
   if (isActive.value && !props.disabled && !event.target.closest('.select-field')) {
      closeDropdown()
   }
}

const showMobileSheet = computed(() => isActive.value && isMobile.value)

const mobileSheetPanelStyle = computed(() => {
   if (!showMobileSheet.value) return undefined
   return {
      transform: `translateY(${mobileSheetDragOffset.value}px)`,
      transition: isDraggingMobileSheet.value ? 'none' : undefined
   }
})

const closeMobile = () => {
   mobileSheetDragOffset.value = 0
   isDraggingMobileSheet.value = false
   closeDropdown()
}

defineExpose({
   openDropdown,
   closeDropdown
})

const resetMobileSheetDrag = () => {
   mobileSheetDragOffset.value = 0
   isDraggingMobileSheet.value = false
}

const handleMobileSheetTouchStart = (event) => {
   if (!isMobile.value) return
   const target = event.target
   if (!(target instanceof HTMLElement)) return
   if (!target.closest('.ios-select__header, .ios-select__grabber')) return
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
   const shouldClose = mobileSheetDragOffset.value > 72
   resetMobileSheetDrag()
   if (shouldClose) {
      closeMobile()
   }
}

const mobileCompactLabel = computed(() => {
   if (!props.mobileCompact) return ''
   if (props.mobileCompactPrefix) {
      const label = displayedSelectedOptionTitle.value
      return label
         ? `${props.mobileCompactPrefix} (${label})`
         : props.mobileCompactPrefix
   }
   return displayedSelectedOptionTitle.value || props.placeholder || ''
})

const gradientById = {
   5: 'linear-gradient(149.74deg, #D9D9D9 13.83%, #F5F5F5 48.22%, #CECECE 64.1%)',
   13: 'linear-gradient(149.74deg, #E3D2B8 13.83%, #FCF4E9 48.22%, #D6BB93 64.1%)',
   17: 'linear-gradient(149.74deg, #C8A381 13.83%, #F2DED2 48.22%, #B08C6E 64.1%)'
}

const getColorStyle = (color) => {
   if (!color) return {}
   if (color.is_gradient) {
      return {
         background: gradientById[color.id] || color.code || '#ffffff'
      }
   }
   return { backgroundColor: color.code || '#ffffff' }
}

watch(
   () => uiStore.activeDropdownId,
   (newId) => {
      isActive.value = newId === dropdownId
      if (!isActive.value) {
         resetMobileSheetDrag()
      }
      if (isActive.value && isMulti.value) {
         temporarySelectedOptions.value = [...selectedOptions.value]
      }
   }
)

onMounted(() => {
   document.addEventListener('click', handleClickOutside)
   updateIsMobile()
   if (import.meta.client) {
      window.addEventListener('resize', updateIsMobile, { passive: true })
   }
   if (!isMulti.value) {
      updateSingleSelection(resolveSingleValue())
      if (
         props.autoSelectFirst &&
         selectedOption.value === null &&
         !props.placeholder
      ) {
         const firstOption = normalizedOptions.value[0]
         if (firstOption) {
            selectedOption.value = firstOption.id
            searchQuery.value = String(firstOption.title ?? '')
         }
      }
   } else {
      selectedOptions.value = Array.isArray(props.initialSelectedOptions)
         ? [...props.initialSelectedOptions]
         : []
      temporarySelectedOptions.value = [...selectedOptions.value]
   }
})

onUnmounted(() => {
   uiStore.clearFloatingDropdown(dropdownId)
   document.removeEventListener('click', handleClickOutside)
   if (import.meta.client) {
      window.removeEventListener('resize', updateIsMobile)
   }
})
</script>

<style scoped lang="scss" src="./SelectUI.scss"></style>
