<template>
   <nuxt-link
      :to="to"
      class="header__icon-wrapper"
      :class="{ 'header__icon-wrapper--active': iconCount > 0 }"
   >
      <img :src="iconSrc" alt="Icon" class="header__icon" >
      <span v-if="iconCount > 0" class="header__icon-count">{{
         iconCount
      }}</span>
   </nuxt-link>
</template>

<script setup>
defineProps({
   to: {
      type: String,
      required: true
   },
   iconSrc: {
      type: String,
      required: true
   },
   iconCount: {
      type: Number,
      default: 0
   }
})
</script>

<style lang="scss" scoped>
.header__icon-wrapper {
   display: flex;
   align-items: center;
   gap: 8px;
   color: #ffffff;
   font-size: 12px;
   font-weight: 400;
   padding: 0 8px;
   height: 24px;
   border-radius: 12px;
   background: none;
   border: none;
   cursor: pointer;
   text-decoration: none;
   transition: background-color 0.2s ease-in-out;

   &.header__icon-wrapper--active {
      background-color: #144df8;
   }

   &:hover {
      background-color: #0c41e0;
   }
}

.header__icon-count {
   color: #ffffff;
   font-size: 14px;
}

.header__icon {
   height: 12px;
}
</style>
