<template>
  <ul class="optimization-option__form">
    <li
      v-for="(field, index) in formFields"
      :key="index"
      class="optimization-option__item"
    >
      <span class="optimization-option__text">{{ field.label }}</span>
      <component
        :is="getComponent(field.type)"
        v-bind="getProps(field)"
        v-model="formValues[field.name]"
      />
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';
import CheckboxUI from '@/components/UI/CheckboxUI.vue';
import AdsDropdown from '@/components/UI/AdsDropdown.vue';
import AutosTextTemplate from '@/components/UI/AutosTextTemplate.vue';
import CutomTextArea from '@/components/UI/CutomTextArea.vue';

const formFields = ref([
  { type: 'checkbox', name: 'exactMatch', label: 'Точное значение' },
  { type: 'checkbox', name: 'noindex', label: 'Noindex' },
  {
    type: 'select',
    name: 'city',
    label: 'Город',
    options: ['Москва', 'СПб', 'Казань'],
  },
  {
    type: 'input',
    name: 'urlPosition',
    label: 'Позиция URL',
    placeholder: 'URL',
  },
  {
    type: 'input',
    name: 'description',
    label: 'Description',
    placeholder: 'H1',
  },
  {
    type: 'textarea',
    name: 'keywords',
    label: 'keywords',
    placeholder: 'keywords',
  },
  {
    type: 'textarea',
    name: 'seoText',
    label: 'SEO text',
    placeholder: 'SEO text',
  },
]);

const formValues = ref({
  exactMatch: false,
  noindex: false,
  city: '',
  urlPosition: '',
  description: '',
  keywords: '',
  seoText: '',
});

const getComponent = (type) => {
  const map = {
    checkbox: CheckboxUI,
    select: AdsDropdown,
    input: AutosTextTemplate,
    textarea: CutomTextArea,
  };
  return map[type] || 'input';
};

const getProps = (field) => {
  const props = {};
  if (field.type === 'input' || field.type === 'textarea') {
    props.placeholder = field.placeholder || '';
  }
  if (field.type === 'select') {
    props.options = field.options || [];
  }
  return props;
};
</script>
