<template>
  <div
    v-for="(field, key, index) in item"
    :key="key"
    class="table-box__item medium-text"
    :class="[
      {
        'table-box__item-text--sub': subItemMod,
        'table-box__item-text--disabled': field?.disabled,
        'table-box__item-text--active': field?.Active,
      },
      // Добавляем поддержку массива классов myclass
      ...(field?.myclass && Array.isArray(field.myclass) ? field.myclass : [])
    ]"
  >
    <div class="table-box__item--mob-tex">{{ getMobHeader(index) }}:</div>

    <div
      class="table-box__item-box"
      :class="[
        {
          'table-box__item-text':
            field?.type === 'link' || field?.type === 'text',
          'table-box__item--select': field?.type === 'select',
        },
        // Добавляем поддержку массива классов myclass для внутреннего блока
        ...(field?.myclass && Array.isArray(field.myclass) ? field.myclass : [])
      ]"
      :style="`-webkit-line-clamp:${lineClamp}; white-space: pre-line;`"
      :v-model="field?.value"
      @mouseover="startEditing(key, 'onFocus')"
      @mouseleave="startEditing(key, 'outFocus')"
      @input="updateItem($event, key)"
      @blur="saveEdit(key)"
      :ref="(el) => (editableFields[index] = el)"
    >
      <!-- Слот в начале -->
      <template v-if="field?.slot === 'start'">
        <slot name="slot-start" :item="item" :emitEvent="handleSlotClick" />
      </template>

      <!-- Контент по типу -->
      <template v-if="field?.type === 'link'">
        <a :href="field?.link" class="table-box__item-link medium-text">
          {{ field?.value }}
        </a>
      </template>

      <template v-else-if="field?.type === 'checkbox'">
        <CustomCheckbox :label="field?.label" :showLabel="field?.label" :name="field?.name"
          :disabled="field?.disabled" v-model="field.value"
          @update:model-value="updateEvent($event, key)" />
      </template>

      <template v-else-if="field?.type === 'radio'">
        <CustomRadio :modelValue="!!field?.value" :disabled="field?.disabled" :name="String(field?.name)"
          :small="true" @update:model-value="updateEvent($event, key)">
          {{ field?.label }}
        </CustomRadio>
      </template>

      <template v-else-if="
        field?.type === 'input' ||
        (field?.type === 'text' && isEditing(key))
      ">
        <CustomInput v-model="field.value" :disabled="field?.disabled"
          @update:model-value="updateEvent($event, key)" @blur="saveEdit(key)" />
      </template>

      <template v-else-if="field?.type === 'select'">
        <CustomSelect v-model="field.value" :disabled="field?.disabled" :option="field.value"
          :positioncalc="true" :options="field.options" @updateSort="upadeteSelect" />
      </template>

      <template v-else-if="field.type === 'status'">
        <p v-if="field?.isActiv" class="table-box__item-status" @click="!readOnly && actionItem('статус')">
          <SuccessSvg />
          <span class="table-box__status-text">{{ field?.text }}</span>
        </p>
        <p v-else class="table-box__item-status">
          <ErrorsSvg />
          <span class="table-box__status-error">Не уточнено</span>
        </p>
      </template>

      <template v-else-if="key === 'errors'">
        <p v-if="Number(field?.value) > 0" class="table-box__item-error" @click="!readOnly && actionItem('ошибки')">
          <ErrorsSvg />
          <span class="table-box__item-link">{{ field?.value }}</span>
        </p>
        <p v-else>
          <SuccessSvg />
        </p>
      </template>

      <template v-else>
        <CustomTableAlert :text="'ошибка'" :box="editableFields[index]" v-if="editableFields[index] && field.alert" />
        <div class="medium-text" @click="!readOnly && actionItem('статус')">
          {{ safeValue(field?.value) }}
        </div>
      </template>

      <!-- Слот в конце -->
      <template v-if="field?.slot === 'end'">
        <slot name="slot-end" :item="item" :emitEvent="handleSlotClick" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import DOMPurify from 'dompurify';
import ErrorsSvg from '@/assets/icons/error-svg';
import SuccessSvg from '@/assets/icons/success-svg';
import CustomCheckbox from '@/components/UI/CheckboxUINEW';
import CustomRadio from '@/components/UI/CustomRadio';
import CustomInput from '@/components/UI/CustomInput';
import CustomTableAlert from '@/components/UI/CustomTableAlert';
import CustomSelect from '@/components/UI/CustomSelect';

const emits = defineEmits([
  'slot-clicked',
  'item-action',
  'item-focus',
  'select-update',
]);

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  lineClamp: {
    type: Number,
    default: 1,
    validator: (value) => Number.isInteger(value) && value > 0,
  },
  headerRow: {
    type: Array,
    default: () => [],
  },
  slotPosition: {
    type: String,
  },
  subItemMod: {
    type: Boolean,
    default: false,
  },
  akcent: {
    type: Boolean,
  },
  akcentClass: {
    type: Object,
  },
});

const editableFields = ref([]);
const editingKey = ref(null);
const editingValue = ref('');

const getMobHeader = computed(
  () => (index) => props.headerRow[index]?.name || ''
);

const handleSlotClick = (name) => {
  if (props.readOnly && name !== 'option') {
    return false;
  }
  console.log('Emit slot-clicked:', name, props.item);
  emits('slot-clicked', name, props.item);
};

const actionItem = (name) => {
  console.log('Emit item-action:', name, props.item);
  emits('item-action', name, props.item);
};

const isEditing = (key) => editingKey.value === key;

const startEditing = (key, event) => {
  if (
    props.readOnly
  ) return;

  if (
    event === 'onFocus' &&
    props.item[key]?.type === 'text' &&
    props.item[key]?.contenteditable
  ) {
    editingKey.value = key;
    editingValue.value = props.item[key]?.value || '';
    console.log('Emit item-focus:', key);
    emits('item-focus', key);
  } else if (event === 'outFocus') {
    editingKey.value = null;
  }
};

const updateItem = (event, key) => {
  if (props.readOnly) return;

  const field = props.item[key];
  if (field.type === 'checkbox' || field.type === 'radio') return;

  emits('item-action', {
    ...props.item,
    [key]: {
      ...field,
      value: DOMPurify.sanitize(event.target.innerText),
    },
  });
};

const saveEdit = (key) => {
  if (editingKey.value === key) {
    editingKey.value = null;
  }
};

const safeValue = (value) => DOMPurify.sanitize(value || '');

const upadeteSelect = (value, oldValue) => {
  if (props.readOnly) return;
  console.log('Emit select-update:', value, oldValue, props.item);
  emits('select-update', value, oldValue, props.item);
};

const updateEvent = (checked, key) => {
  if (props.readOnly) return;

  const updatedItem = {
    ...props.item,
    [key]: {
      ...props.item[key],
      value: checked,
    },
  };

  console.log('Изменился ключ:', key, 'новое значение:', checked);
  emits('item-action', updatedItem, key);
};
</script>

<style lang="scss">
</style>
