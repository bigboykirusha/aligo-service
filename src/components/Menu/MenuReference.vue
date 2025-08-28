<template>
  <div class="menu__content">
    <h2 class="menu__title"><InfoSvg /> Справочные материалы</h2>
    <div class="menu__description">
      SEO-переменные, доступные для использования:
    </div>
    <CustomTable
      :ItemRows="itemRow"
      :headerRows="headerRows"
      :lineClamp="10"
      :tablePagination="false"
      @slot-clicked="handleButtonClick"
    >
      <template #slot-end="{ item, emitEvent }">
        <ButtonUI
          svg="copy-svg"
          :buttonClass="'btn--third'"
          @click="emitEvent(item, 'serch')"
        />
      </template>
    </CustomTable>
  </div>
</template>
<script setup>
import { ref, defineProps, onMounted, defineEmits } from 'vue';
import InfoSvg from '@/assets/icons/info-svg';
import ButtonUI from '@/components/UI/ButtonUI';
import CustomTable from '@/components/UI/CustomTable';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['menu-action']);
const itemRow = ref([
  {
    id: {
      value: '01',
      type: 'text',
      contenteditable: false,
    },
    name: { value: '[CITY]', type: 'text', contenteditable: false },
    text: {
      value: 'Выбранный город пользователя',
      type: 'text',
      contenteditable: false,
    },
    slot: { slot: 'end', contenteditable: false, id: 1 },
  },
  {
    id: {
      value: '02',
      type: 'text',
      contenteditable: false,
    },
    name: { value: '[CITY-PRED]', type: 'text', contenteditable: false },
    text: {
      value: 'Выбранный город пользователя в предложном падеже',
      type: 'text',
      contenteditable: false,
    },
    slot: { slot: 'end', contenteditable: false, id: 1 },
  },
  // {
  //   id: {
  //     value: '03',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   name: { value: '[CTG]', type: 'text', contenteditable: false },
  //   text: {
  //     value: 'Основная категория',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   slot: { slot: 'end', contenteditable: false, id: 1 },
  // },
  // {
  //   id: {
  //     value: '04',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   name: { value: '[CTG-PRED]', type: 'text', contenteditable: false },
  //   text: {
  //     value: 'Основная категория в предложном падеже',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   slot: { slot: 'end', contenteditable: false, id: 1 },
  // },
  // {
  //   id: {
  //     value: '05',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   name: { value: '[FILTER-NAME]', type: 'text', contenteditable: false },
  //   text: {
  //     value:
  //       'Название фильтра,где NAME - название конкретного фильтра. В публичной части подставляется само название.',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   slot: { slot: 'end', contenteditable: false, id: 1 },
  // },
  // {
  //   id: {
  //     value: '06',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   name: { value: '[FILTERS-CHPU]', type: 'text', contenteditable: false },
  //   text: {
  //     value:
  //       'Список всех фильтров через запятую по индексу ЧПУ , в публичной части подставляются только выбранные пользователем',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   slot: { slot: 'end', contenteditable: false, id: 1 },
  // },
  // {
  //   id: {
  //     value: '07',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   name: {
  //     value: '[FILTERS-NAME-PARAMS]',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   text: {
  //     value:
  //       'NAME - имя конкретного фильтра, PARAMS список всех значений параметров фильтра, в публичной части подставляются только выбранные пользователем ',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   slot: { slot: 'end', contenteditable: false, id: 1 },
  // },
  // {
  //   id: {
  //     value: '08',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   name: {
  //     value: '[FILTERS-NAME-PARAM]',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   text: {
  //     value:
  //       'NAME - имя конкретного фильтра, PARAM значение конкретного параметра , в публичной части подставляется выбранные значения',
  //     type: 'text',
  //     contenteditable: false,
  //   },
  //   slot: { slot: 'end', contenteditable: false, id: 1 },
  // },
]);

function transformData(incomingData) {
  return incomingData.map((item) => ({
    id: {
      value: item.id.toString().padStart(2, '0'), // Convert to string and pad with leading zero if necessary
      type: 'text',
      contenteditable: false,
    },
    name: {
      value: item.title,
      type: 'text',
      contenteditable: false,
    },
    text: {
      value: item.description,
      type: 'text',
      contenteditable: false,
    },
    slot: {
      slot: 'end',
      contenteditable: false,
      id: 1,
    },
  }));
}
const headerRows = [
  {
    name: '#',
    width: '30px',
    helper: false,
  },
  {
    name: 'Название',
    helper: false,
    width: '130px',
  },
  {
    name: 'Значение',
    helper: false,
    width: '180px',
  },
  {
    name: '',
    helper: false,
    width: '30px',
  },
];
const handleButtonClick = async (item) => {
  const valueToCopy = item.name.value;
  const name = 'copy';
  try {
    await navigator.clipboard.writeText(valueToCopy);
    emit('menu-action', name, item.name.value);
  } catch (err) {
    console.error('Ошибка при копировании текста: ', err);
    emit('menu-action', name, err);
  }
};
onMounted(() => {
  itemRow.value = transformData(props.data);
});
</script>
