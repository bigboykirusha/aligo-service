import { useUserStore } from '@/store/user';
import { getCookie } from '@/services/auth';

export default defineNuxtPlugin(() => {
  const userStore = useUserStore();

  const savedUserData = JSON.parse(getCookie('userData'));
  if (savedUserData && savedUserData.token) {
    if (savedUserData.phoneNumber || savedUserData.email) {
      userStore.fetchAndSetUserdata();
    }
  }
});
