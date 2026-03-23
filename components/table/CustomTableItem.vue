<template>
   <tr class="table-row" @click="$emit('rowClick', row)">
      <td v-for="column in columns" :key="column.key" class="table-row__cell" :class="resolveCellClasses(column)"
         :data-label="column.label">
         <span class="table-row__label">{{ column.label }}</span>

         <div v-if="column.type === 'actions'" class="table-row__actions">
            <UIButton v-for="action in resolveActions(column)" :key="action.key" :block="false" :type="'button'"
               :variant="action.variant === 'primary' ? 'primary' : 'secondary'" class="table-row__action"
               :disabled="Boolean(action.isDisabled?.(row))" @click.stop="$emit('rowAction', action.key, row)">
               {{ action.label }}
            </UIButton>
         </div>

         <div v-else-if="column.type === 'menu'" class="table-row__actions">
            <div ref="menuAnchorRef" class="table-row__menu-anchor">
               <button type="button" class="table-row__menu-button" aria-label="Открыть действия" @click.stop="
                  openMenuKey = openMenuKey === column.key ? '' : column.key
                  ">
                  <img :src="optionsIcon" alt="" class="table-row__menu-icon">
               </button>

               <OptionsMenu v-if="openMenuKey === column.key" :items="resolveMenuItems(column)"
                  :anchor-element="menuAnchorRef" @close="openMenuKey = ''" />
            </div>
         </div>

         <CustomTableOption v-else-if="column.type === 'status'" :label="renderText(column)"
            :tone="resolveTone(column)" />

         <div v-else class="table-row__content">
            <template v-if="isMetaValue(column)">
               <strong class="table-row__title">{{ getMetaValue(column).title }}</strong>
               <span v-if="getMetaValue(column).subtitle" class="table-row__subtitle">
                  {{ getMetaValue(column).subtitle }}
               </span>
            </template>

            <template v-else-if="isListValue(column)">
               <span v-for="line in getListValue(column)" :key="line" class="table-row__line">
                  {{ line }}
               </span>
            </template>

            <span v-else>{{ renderText(column) }}</span>
         </div>
      </td>
   </tr>
</template>

<script setup>
import { ref } from 'vue'
import optionsIcon from '@/assets/icons/options.svg'
import OptionsMenu from '@/components/ui/OptionsMenu.vue'
import UIButton from '@/components/ui/UIButton.vue'
import CustomTableOption from './CustomTableOption.vue'

const props = defineProps({
   row: {
      type: Object,
      required: true
   },
   columns: {
      type: Array,
      default: () => []
   }
})

const emit = defineEmits(['rowAction', 'rowClick'])
const openMenuKey = ref('')
const menuAnchorRef = ref(null)

const getRawValue = (column) => {
   if (typeof column.format === 'function') {
      return column.format(props.row)
   }
   return props.row?.[column.key]
}

const renderText = (column) => {
   const value = getRawValue(column)
   if (value === null || value === undefined || value === '') return '-'
   if (typeof value === 'object') {
      if (Array.isArray(value)) return value.join(', ') || '-'
      if (typeof value.title === 'string') return value.title || '-'
      return '-'
   }
   return String(value)
}

const isMetaValue = (column) => {
   const value = getRawValue(column)
   return Boolean(
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      ('title' in value || 'subtitle' in value)
   )
}

const getMetaValue = (column) => {
   const value = getRawValue(column)
   return {
      title: value?.title || '-',
      subtitle: value?.subtitle || ''
   }
}

const isListValue = (column) => Array.isArray(getRawValue(column))

const getListValue = (column) => {
   const value = getRawValue(column)
   return Array.isArray(value) && value.length ? value.map(String) : ['-']
}

const resolveCellClasses = (column) => [
   (column.type === 'actions' || column.type === 'menu') &&
   'table-row__cell--actions',
   column.align === 'center' && 'table-row__cell--center',
   column.nowrap && 'table-row__cell--nowrap',
   column.type === 'menu' && 'table-row__cell--menu',
   column.type === 'status' && 'table-row__cell--status',
   column.columnClass && `table-row__cell--${column.columnClass}`
]

const resolveTone = (column) => {
   if (typeof column.getTone === 'function') {
      return column.getTone(props.row, getRawValue(column))
   }
   return column.tone || 'neutral'
}

const resolveActions = (column) => {
   const actions = Array.isArray(column.actions) ? column.actions : []
   return actions.filter((action) =>
      typeof action.isVisible === 'function' ? action.isVisible(props.row) : true
   )
}

const resolveMenuItems = (column) => {
   const items =
      typeof column.menuItems === 'function'
         ? column.menuItems(props.row)
         : Array.isArray(column.menuItems)
            ? column.menuItems
            : []

   return items.map((item) => ({
      ...item,
      action: () => {
         if (!item?.key) return
         openMenuKey.value = ''
         emit('rowAction', item.key, props.row)
      }
   }))
}
</script>

<style scoped lang="scss">
.table-row:nth-child(even) {
   background: #fcfcfc;
}

.table-row:hover {
   background: #f8fbff;
}

.table-row__cell {
   box-sizing: border-box;
   padding: 13px 16px;
   border-bottom: 1px solid #ececec;
   border-right: 1px solid #f1f1f1;
   vertical-align: middle;
}

.table-row__cell:last-child {
   border-right: 0;
}

.table-row__cell--center {
   text-align: center;
}

.table-row__cell--actions {
   text-align: right;
}

.table-row__cell--nowrap {
   white-space: nowrap;
}

.table-row__cell--menu {
   width: 1%;
   text-align: center;
}

.table-row__cell--status {
   min-width: 104px;
}

.table-row__label {
   display: none;
   margin-bottom: 6px;
   color: var(--color-text-secondary);
   font-size: var(--font-size-12);
   line-height: var(--line-height-12);
   font-weight: 700;
   letter-spacing: 0.08em;
   text-transform: uppercase;
}

.table-row__content {
   min-width: 0;
   display: flex;
   flex-direction: column;
   gap: 4px;
   color: var(--color-text-primary);
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
}

.table-row__title {
   color: var(--color-text-primary);
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
   font-weight: 700;
   overflow-wrap: anywhere;
}

.table-row__subtitle,
.table-row__line {
   color: var(--color-text-secondary);
   font-size: var(--font-size-12);
   line-height: var(--line-height-12);
   overflow-wrap: anywhere;
}

.table-row__actions {
   display: inline-flex;
   align-items: center;
   gap: 8px;
   flex-wrap: wrap;
   justify-content: flex-end;
}

.table-row__cell--menu .table-row__actions {
   width: 100%;
   justify-content: center;
}

.table-row__action {
   min-width: fit-content;
}

.table-row__menu-anchor {
   position: relative;
   display: inline-block;
}

.table-row__menu-button {
   display: inline-flex;
   align-items: center;
   justify-content: center;
   width: 34px;
   height: 34px;
   border: 1px solid var(--color-border);
   border-radius: 8px;
   background: var(--color-surface);
   cursor: pointer;
   transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
}

.table-row__menu-button:hover {
   border-color: #bfdcff;
   background: var(--color-surface-soft);
}

.table-row__menu-icon {
   width: 16px;
   height: 16px;
}

@media (max-width: 960px) {

   .table-row,
   .table-row__cell {
      display: block;
      width: 100%;
   }

   .table-row {
      position: relative;
      border: 1px solid #e8e8e8;
      border-radius: 10px;
      overflow: hidden;
      background: #fff;
      box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.04);
   }

   .table-row__cell {
      padding: 10px 12px;
      border-right: 0;
      border-bottom: 1px solid #eeeeee;
      text-align: left;
      white-space: normal;
   }

   .table-row__cell:last-child {
      border-bottom: 0;
   }

   .table-row__cell--actions {
      text-align: left;
   }

   .table-row__cell--menu {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 2;
      width: auto;
      padding: 0;
      border: 0;
      background: transparent;
      text-align: right;
   }

   .table-row__cell--menu .table-row__actions {
      width: auto;
      justify-content: flex-end;
   }

   .table-row__cell:first-child:not(.table-row__cell--menu) {
      padding-right: 52px;
   }

   .table-row__cell--status {
      white-space: normal !important;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
   }

   .table-row__cell--status :deep(.table-option) {
      margin-top: 2px;
   }

   .table-row__label {
      display: inline-block;
      margin-bottom: 8px;
   }

   .table-row__cell--menu .table-row__label {
      display: none;
   }

   .table-row__actions {
      justify-content: flex-start;
   }

   .table-row__content {
      gap: 4px;
   }
}
</style>
