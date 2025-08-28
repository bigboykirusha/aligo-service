<template>
  <div class="optimization__header">
    <h2 class="optimization__header-h2">{{ title }}</h2>
    <div class="optimization__header-box">
      <div class="optimization__header-user-box">
        <img src="@/assets/images/temporary/avatar.png" alt="avatar" class="optimization__header-img" />
        <p class="optimization__header-text-box">
          <span class="optimization__header-status">{{ status }}</span>
          <span class="optimization__header-name">{{ name }}</span>
        </p>
      </div>
      <div class="optimization__header-time-box">
        <span class="optimization__header-time">{{ time }}</span>
        <span class="optimization__header-date">{{ date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps } from 'vue';
defineProps({
  title: String,
  name: String,
  status: String,
});
const time = ref('');
const date = ref('');
let intervalId;

const updateDateTime = () => {
  const now = new Date();

  time.value = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // DD.MM.YYYY необходимо будет позже выделить эту логику в форматер
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  date.value = `${day}.${month}.${year}`;
};

onMounted(() => {
  updateDateTime();
  // обновляю время каждые 15 секунд
  intervalId = setInterval(updateDateTime, 15000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style scoped lang="scss">
.optimization {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    padding: 12px 24px;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
    }

    @media (max-width: 1024px) {
      margin: 0;
    }

    &-box {
      display: flex;
      gap: 40px;
    }

    &-user-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &-text-box {
      display: flex;
      flex-direction: column;
    }

    &-status {
      font-size: 12px;
      line-height: 16px;
      color: #787878;
    }

    &-time-box {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    &-time {
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;
      color: #787878;
    }

    &-date {
      font-size: 12px;
      line-height: 16px;
      color: #787878;
    }

    &-img {
      width: 34px;
      height: 34px;
      border-radius: 50%;
    }

    h2 {
      font-size: 32px;
      color: #3366ff;
      line-height: 110%;
      margin: 0 0 10px 0;
    }
  }
}
</style>
