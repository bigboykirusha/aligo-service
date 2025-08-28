import { createApp } from 'vue';
// ядро
import App from './app.vue';

import './assets/scss/main.scss';
// роутер и стор
import router from './router';
import { createPinia } from 'pinia';
// либы
import axios from 'axios';
import VueTheMask from 'vue-the-mask';
import VueDOMPurifyHTML from 'vue-dompurify-html';
import Vue3Cookies from 'vue3-cookies';
import { useUserStore } from '@/store/user';
import { getCookie } from '@/services/auth';
// кастомные плагины
import clickOutside from '@/plugins/clickOutside.js';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

const userStore = useUserStore();
const savedUserData = getCookie('userData')
  ? JSON.parse(getCookie('userData'))
  : null;

if (savedUserData?.token) {
  if (savedUserData.phoneNumber || savedUserData.email) {
    userStore.fetchAndSetUserdata();
  }
}

app.use(router);

app.config.globalProperties.$axios = axios;

app.use(VueTheMask);

app.use(VueDOMPurifyHTML);

app.use(Vue3Cookies);

app.directive('click-outside', clickOutside);

app.mount('#app');
