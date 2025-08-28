<template>
  <div class="popup__content">
    <h2 class="popup__title small-title">
      Изменение позиции фильтра “Марка” в URL
    </h2>
    <ul class="popup__form">
      <li class="popup__item medium-text">
        <span>Старый URL</span>
        <!-- eslint-disable-next-line vue/no-mutating-props -->
        <CutomTextArea v-model="data.newUrl" :placeholder="'Старый URL'" />
      </li>
      <li class="popup__item medium-text">
        <span>Новый URL</span>
        <!-- eslint-disable-next-line vue/no-mutating-props -->
        <CutomTextArea v-model="data.oldUrl" :placeholder="'Новый URL'" />
      </li>
    </ul>
    <div class="popup__main-content">
      <p class="popup__paragraph medium-text">
        Позиция “{{ data.postion }}” уже используется, внесение изменений
        затронет другие фильтры, выберите новые позиции для изменяемых фильтров
      </p>
      <div class="popup__table-box">
        <CustomTable
          :ItemRows="data.data"
          :headerRows="headerRows"
          :tablePagination="false"
          @slot-clicked="handleButtonClick"
        />
      </div>
    </div>
    <p class="popup__error small-text" v-if="errorText">
      В таблице есть дубликаты
    </p>
    <div class="popup__button-box">
      <ButtonUI text="Сохранить" @action="submitForm" />
      <ButtonUI
        text="отменить"
        buttonClass="btn--second"
        @action="$emit('closing')"
      />
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, defineEmits } from 'vue';
import CutomTextArea from '@/components/UI/CutomTextArea';
import ButtonUI from '@/components/UI/ButtonUI';
import CustomTable from '@/components/UI/CustomTable';

const props = defineProps({
  id: String,
  data: Object,
});

const emit = defineEmits(['update:data', 'closing', 'submit-action']);

const localData = ref({ ...props.data });
const errorText = ref(false);
const headerRows = [
  {
    name: 'Фильтр',
    width: '100px',
    helper: false,
  },
  {
    name: 'Позиции в URl',
    helper: false,
    width: '100px',
  },
  {
    name: 'новые позиции',
    helper: false,
    width: '100px',
  },
];

const submitForm = () => {
  const codeSet = new Set();
  for (const element of localData.value.data) {
    const code = element.newPosition.value.code;
    if (codeSet.has(code)) {
      errorText.value = true;
      setTimeout(() => {
        errorText.value = false;
      }, 7000);
      return false;
    }
    emit('submit-action', props.data);
  }

  return true;
};
</script>
<style scoped lang="scss">
.popup {
  &__content {
    justify-content: space-between;
  }
  &__table-box {
    width: 70%;
    max-height: calc(80vh - 220px);
    @media (max-width: 1024px) {
      width: 100%;
      max-height: calc(80vh - 350px);
    }
  }

  &__title {
    color: #144df8;
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  &__item {
    display: flex;
    color: var(--color-text-select);
    font-size: 14px;
  }
  &__main-content {
    padding-top: 16px;
    border-top: 1px solid var(--color-stroke);
    max-height: calc(80vh - 155px);
    @media (max-width: 1024px) {
      max-height: calc(80vh - 250px);
    }
  }

  &__paragraph {
    font-size: 14px;
    font-weight: bold;
    color: var(--text-main);
  }
  &__paragraph {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 16px;
  }
  .ui-select {
    margin: 0;
  }
  &__button-box {
    width: auto;
    display: flex;
    gap: 12px;
    margin-top: 12px;
  }
  &__error {
    margin-top: 16px;
    line-height: 16px;
    font-size: 14px;
    color: #ff5959;
    align-items: center;
  }
}
</style>
