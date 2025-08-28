<template>
  <LoginModal />
</template>

<script setup>
import { useLoginModalStore } from '@/store/loginModal';
import LoginModal from '@/components/LoginModal';
import { onMounted, onBeforeUnmount } from 'vue';

const loginModalStore = useLoginModalStore();

onMounted(() => {
  loginModalStore.openLoginModal();
});

onBeforeUnmount(() => {
  loginModalStore.closeLoginModal();
});
</script>
