/* eslint-disable */
export default defineNuxtPlugin((nuxtApp) => {
  const CACHE_VERSION = '1.1';
  const storedVersion = localStorage.getItem('cacheVersion');

  if (storedVersion !== CACHE_VERSION) {
    console.log('Обновление данных: очищаем localStorage...');
    localStorage.clear();
    localStorage.setItem('cacheVersion', CACHE_VERSION);
  }
});
// почему плагин NUXT тут?
/* eslint-enable */
