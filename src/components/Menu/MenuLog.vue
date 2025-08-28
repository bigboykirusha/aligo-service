<template>
  <div class="menu__content">
    <h2 class="menu__title"><HistorySvg /> История изменений</h2>
    <div class="menu__description">
      Выберите настройки SEO, к которым хотите вернуться:
    </div>
    <div class="menu__content-box">
      <ul class="menu__list">
        <li
          v-for="item in dataList"
          :key="item?.id"
          class="menu__list-item"
          :class="{ 'menu__list-item--active': item?.checked }"
        >
          <div class="menu__list-box">
            <h3 class="menu__list-title">
              <CheckboxUI
                v-if="item?.checked"
                :value="item?.checked"
                @update:model-value="updateCheckbox"
              />
              {{ item?.time }} ({{ item?.author }})
            </h3>
            <p
              v-if="!isAnyChecked && item?.id !== selectedItem?.id"
              class="menu__list-more"
              @click="$emit('submit-action', item)"
            >
              показать
            </p>
          </div>
          <p class="menu__list-info">
            <span class="menu__list-acent-text">Изменено:</span>
            {{ item?.changes }}
          </p>
        </li>
      </ul>
      <div class="menu__btn-box">
        <ButtonUI text="Восстановить версию" @action="menuAction('refresh')" />
        <ButtonUI
          text="отменить"
          buttonClass="btn--second"
          @action="$emit('closing')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';

import { FORMATER } from '@/composables/formater.js';
import HistorySvg from '@/assets/icons/history-svg';
import CheckboxUI from '@/components/UI/CheckboxUI';
import ButtonUI from '@/components/UI/ButtonUI';

const emit = defineEmits(['closing', 'submit-action', 'menu-action']);

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const selectedItem = ref({ id: '2' }); // ID выбранного элемента

const dataList = ref([]);

const isAnyChecked = computed(() =>
  dataList.value.some((item) => item.checked)
);
const menuAction = (name) => {
  emit('menu-action', name);
};
const getLog = () => {
  dataList.value = props.data.map((el) => {
    return {
      author: el?.user?.username,
      time: FORMATER('date', el.updated_at, '|'),
      changes: el.change,
      checked: false,
      data: el,
    };
  });
};
onMounted(() => {
  getLog();
});
// FORMATER('date', seoItem.value.data.updated_at, '||');
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
    cursor: pointer;
  }
  &-info {
    font-size: 14px;
    line-height: 18px;
    word-break: break-all;
  }
}
</style>
