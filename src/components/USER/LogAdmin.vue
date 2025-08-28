<template>
   <div class="log-list">
      <!-- Заголовок -->
      <div class="log-list__header">
         <CustomSerch v-model="searchQuery" placeholder="Поиск по номеру лога..." />
         <ButtonUI svg="save-icon" text="Скачать логи" buttonClass="btn--primary" />
      </div>
      <CustomTable :ItemRows="itemRow" :headerRows="headerRows" :lineClamp="5" height="34px" :tablePagination="false" />
   </div>
</template>

<script setup>
import { ref } from 'vue';
import ButtonUI from '@/components/UI/ButtonUI.vue';
import CustomSerch from '@/components/UI/CustomSerch.vue';
import CustomTable from '@/components/UI/CustomTable.vue';

const searchQuery = ref('');

const itemRow = ref([
   {
      ID: { value: '7237 8348 0132', type: 'text', contenteditable: false },
      Дата: { value: '03.07.2024', type: 'text', contenteditable: false },
      Время: { value: '18:57', type: 'text', contenteditable: false },
      Событие: { value: 'Регистрация в системе через номер телефона', type: 'text', contenteditable: false },
      Ссылка: { value: 'https://www.aligo.ru/kkknfskmlskmnvasjklnkaejtnvkajtnvkfjnkaefjfnekjvnfk', type: 'link' },
   },
   {
      ID: { value: '8237 2348 1132', type: 'text', contenteditable: false },
      Дата: { value: '04.07.2024', type: 'text', contenteditable: false },
      Время: { value: '12:20', type: 'text', contenteditable: false },
      Событие: { value: 'Подтверждение телефона', type: 'text', contenteditable: false },
      Ссылка: { value: 'https://www.aligo.ru/kkknfskmlskmnvasjklnkaejtnvkajtnvkfjnkaefjfnekjvnfk', type: 'link' },
   },
   {
      ID: { value: '1234 5678 9012', type: 'text', contenteditable: false },
      Дата: { value: '05.07.2024', type: 'text', contenteditable: false },
      Время: { value: '09:15', type: 'text', contenteditable: false },
      Событие: { value: 'Смена пароля', type: 'text', contenteditable: false },
      Ссылка: { value: 'https://www.aligo.ru/kkknfskmlskmnvasjklnkaejtnvkajtnvkfjnkaefjfnekjvnfk', type: 'link' },
   },
   {
      ID: { value: '4567 8901 2345', type: 'text', contenteditable: false },
      Дата: { value: '06.07.2024', type: 'text', contenteditable: false },
      Время: { value: '16:45', type: 'text', contenteditable: false },
      Событие: { value: 'Вход в систему', type: 'text', contenteditable: false },
      Ссылка: { value: 'https://www.aligo.ru/kkknfskmlskmnvasjklnkaejtnvkajtnvkfjnkaefjfnekjvnfk', type: 'link' },
   },
   {
      ID: { value: '9999 8888 7777', type: 'text', contenteditable: false },
      Дата: { value: '06.07.2024', type: 'text', contenteditable: false },
      Время: { value: '17:55', type: 'text', contenteditable: false },
      Событие: { value: 'Выход из системы', type: 'text', contenteditable: false },
      Ссылка: { value: 'https://www.aligo.ru/kkknfskmlskmnvasjklnkaejtnvkajtnvkfjnkaefjfnekjvnfk', type: 'link' },
   },
   {
      ID: { value: '1111 2222 3333', type: 'text', contenteditable: false },
      Дата: { value: '07.07.2024', type: 'text', contenteditable: false },
      Время: { value: '10:10', type: 'text', contenteditable: false },
      Событие: { value: 'Добавление объявления', type: 'text', contenteditable: false },
      Ссылка: { value: 'https://www.aligo.ru/kkknfskmlskmnvasjklnkaejtnvkajtnvkfjnkaefjfnekjvnfk', type: 'link' },
   },
   {
      ID: { value: '4444 5555 6666', type: 'text', contenteditable: false },
      Дата: { value: '07.07.2024', type: 'text', contenteditable: false },
      Время: { value: '11:20', type: 'text', contenteditable: false },
      Событие: { value: 'Удаление объявления', type: 'text', contenteditable: false },
      Ссылка: { value: 'https://www.aligo.ru/kkknfskmlskmnvasjklnkaejtnvkajtnvkfjnkaefjfnekjvnfk', type: 'link' },
   },
   {
      ID: { value: '7777 6666 5555', type: 'text', contenteditable: false },
      Дата: { value: '08.07.2024', type: 'text', contenteditable: false },
      Время: { value: '08:30', type: 'text', contenteditable: false },
      Событие: { value: 'Запрос отчёта по авто', type: 'text', contenteditable: false },
      Ссылка: { value: 'https://www.aligo.ru/kkknfskmlskmnvasjklnkaejtnvkajtnvkfjnkaefjfnekjvnfk', type: 'link' },
   },
   {
      ID: { value: '3210 6543 9876', type: 'text', contenteditable: false },
      Дата: { value: '08.07.2024', type: 'text', contenteditable: false },
      Время: { value: '14:45', type: 'text', contenteditable: false },
      Событие: { value: 'Редактирование профиля', type: 'text', contenteditable: false },
      Ссылка: { value: 'https://www.aligo.ru/kkknfskmlskmnvasjklnkaejtnvkajtnvkfjnkaefjfnekjvnfk', type: 'link' },
   },
   {
      ID: { value: '0000 1111 2222', type: 'text', contenteditable: false },
      Дата: { value: '09.07.2024', type: 'text', contenteditable: false },
      Время: { value: '15:00', type: 'text', contenteditable: false },
      Событие: { value: 'Изменение номера телефона', type: 'text', contenteditable: false },
      Ссылка: { value: 'https://www.aligo.ru/kkknfskmlskmnvasjklnkaejtnvkajtnvkfjnkaefjfnekjvnfk', type: 'link' },
   },
]);

const headerRows = [
   { name: 'ID', width: '150px', helper: false },
   { name: 'Дата', width: '100px', helper: false },
   { name: 'Время', width: '100px', helper: false },
   { name: 'Событие', width: '350px', helper: false },
   { name: 'Ссылка', width: '500px', helper: false },
];
</script>

<style scoped lang="scss">
.log-list {
   display: flex;
   flex-direction: column;
   gap: 16px;

   &__header {
      display: flex;
      justify-content: flex-end;
   }
}
</style>
