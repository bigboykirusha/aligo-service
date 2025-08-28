<template>
  <div class="menu__content">
    <h2 class="menu__title"><TemplatesSvg /> Шаблоны</h2>
    <div class="menu__content-box">
      <ul class="menu__list">
        <li
          v-for="item in data.itemRow"
          :key="item.id"
          class="menu__list-item"
          :class="{ 'menu__list-item--active': item.checked }"
        >
          <div class="menu__list-box">
            <h3 class="menu__list-title">
              <CheckboxUI
                v-model="item.isActive"
                @update:model-value="updateCheckbox"
              />
              {{ item.name }}
            </h3>
            <p class="menu__list-more">
              <DeletSvg />
            </p>
          </div>
          <p class="menu__list-info">
            {{ item.changes }}
          </p>
          <p class="menu__list-info">
            <span class="menu__list-acent-text">Созданно:</span>
            {{ item.updatedDate }} ({{ item.author }})
          </p>
        </li>
      </ul>
      <div class="menu__btn-box">
        <ButtonUI text="применить" />
        <ButtonUI text="отменить" buttonClass="btn--second" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import TemplatesSvg from '@/assets/icons/templates-svg';
import DeletSvg from '@/assets/icons/delet-svg';

import CheckboxUI from '@/components/UI/CheckboxUI';
import ButtonUI from '@/components/UI/ButtonUI';

defineProps({
  data: { type: Object, default: () => ({}) },
});
// мока менющки
// ref,
// const dataList = ref(
//   itemRow:[
//   {
//     id: '1',
//     date: '14.12.2024',
//     time: '23:03',
//     name: 'Шаблон для страниц объявления 8382',
//     changes: 'Марка в Ростове-на-Дону',
//     checked: false,
//   },
//   {
//     id: '2',
//     date: '15.12.2024',
//     time: '12:45',
//     name: 'Шаблон для страниц объявления 8382',
//     author: 'Иван Петров',
//     changes: 'Title, Description',
//     checked: true,
//   },
//   {
//     id: '3',
//     date: '16.12.2024',
//     time: '08:30',
//     name: 'Шаблон для страниц объявления 8382',
//     author: 'Анна Сидорова',
//     changes: 'откат к 11.12.2024  | 15:23',
//     checked: false,
//   },
// ]);

const updateCheckbox = () => {
  console.log(212);
};
</script>

<style scoped lang="scss">
.menu__list {
  height: 100%;

  overflow-y: auto;

  &-item {
    padding: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--color-stroke);

    &--active {
      border-bottom: none;
      background-color: #eef9ff;
    }
  }

  &-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &-title {
    display: flex;
    align-items: center;
    margin: 0;
    gap: 6px;
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
  }

  &-acent-text {
    color: var(--color-text-select);
  }

  &-more {
    width: 400;
    color: var(--primary);
  }

  &-info {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 12px;
  }
}
</style>
