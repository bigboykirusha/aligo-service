<template>
  <div class="optimization-option">
    <div class="optimization-option__text-box">
      <h3 class="optimization-option__title">Общая статистика</h3>
      <ul class="optimization-option__colun-box">
        <li
          v-for="(value, name) in optimizationOptions"
          :key="name"
          class="optimization-option__colun-item"
        >
          <span class="optimization-option__name">{{ name }} : </span>
          <span class="optimization-option__value">{{ value }}</span>
          <a
            v-if="name === 'Количество ошибок'"
            @click="checkError"
            class="optimization-option__link"
            >Смотреть отчет</a
          >
        </li>
      </ul>
    </div>
    <div class="optimization-option__btn-box">
      <ButtonUI
        svg="card-generation"
        text="Сгенерировать карту"
        @action="generateCard"
      />
      <ButtonUI
        svg="card-testing"
        :buttonClass="'btn--second'"
        text="Тестировать карты"
        @action="testCard"
      />
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, computed } from 'vue';
import ButtonUI from '@/components/UI/ButtonUI.vue';

const emit = defineEmits(['checkError', 'generateCard', 'testCard']);

const props = defineProps({
  information: Object,
});

const checkError = () => {
  emit('checkError');
};
const generateCard = () => {
  emit('generateCard');
};
const testCard = () => {
  emit('testCard');
};

const optimizationOptions = computed(() => ({
  'Количество карт (файлов)': props.information?.total_count_files || 0,
  'Общий вес, Мб': props.information?.total_weight_KB || 0,
  'Всего ссылок, шт': props.information?.total_count_links || 0,
  'Количество ошибок': props.information?.total_errors_count || 0,
  Сгенерирована: props.information?.created_at || '',
  Обновлена: props.information?.updated_at || '',
}));
</script>
<style scoped lang="scss">
.optimization {
  &-option {
    display: flex;
    justify-content: space-around;
    border-radius: 4px;
    background-color: #eef9ff;
    margin: 16px 0;
    padding: 12px 24px;
    &__btn-box {
      display: flex;
      align-items: end;
      flex-direction: column;
      gap: 16px;
    }
    &__text-box {
      width: 70%;
    }
    &__title {
      color: #323232;
      font-size: 14px;
      font-weight: 700;
      line-height: 18px;
    }
    &__colun-box {
      width: 90%;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    &__colun-item {
      flex: 1 1 calc(50% - 20px);
    }
    &__name {
      color: #a8a8a8;
      font-weight: 400;
      line-height: 18px;
      font-size: 14px;
    }
    &__value {
      color: #323232;
      font-weight: 400;
      line-height: 18px;
      font-size: 14px;
    }
    &__link {
      margin-left: 6px;
      color: #3366ff;
      font-weight: 400;
      line-height: 18px;
      font-size: 14px;
      cursor: pointer;
    }
    @media (max-width: 800px) {
      flex-direction: column;
      gap: 20px;
      &__colun-box {
        width: 100%;
      }
      &__btn-box {
        flex-direction: row;
      }
    }
    @media (max-width: 480px) {
      &__btn-box {
        flex-direction: column;
      }
    }
  }
}
</style>
