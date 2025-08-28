<template>
   <div class="profile__header">
      <button @click="goBack" class="profile__back-button">
         <img :src="backIcon" alt="Назад" class="profile__back-icon" />
      </button>
      <div class="profile__info">
         {{ username ? `${username} (#${uniqueCode})` : `#${uniqueCode}` }}
      </div>
   </div>
</template>

<script setup>
import { defineProps, toRefs } from 'vue';

const props = defineProps({
   username: {
      type: String,
      required: false,
   },
   uniqueCode: {
      type: String,
      required: true,
   },
   goBack: {
      type: Function,
      required: false,
   },
   backIcon: {
      type: String,
      required: false,
   }
});

const { username, uniqueCode, goBack, backIcon } = toRefs(props);
</script>

<style lang="scss">
.profile__header {
   display: flex;
   align-items: center;
   margin-bottom: 24px;
}

.profile__back-button {
   width: 34px;
   height: 34px;
   display: flex;
   align-items: center;
   justify-content: center;
   background-color: #D6EFFF;
   border: none;
   border-radius: 6px;
   cursor: pointer;
   margin-right: 16px;
   transition: background-color 0.3s;

   &:hover {
      background-color: #A4DCFF;
   }
}

.profile__back-icon {
   width: 14px;
}

.profile__info {
   flex-grow: 1;
   color: #003BCE;
   font-size: 16px;
   font-weight: 700;

   @media (max-width: 768px) {
      font-size: 14px;
   }
}
</style>