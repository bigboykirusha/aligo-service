export default defineNuxtConfig({
   ssr: false,

   app: {
      head: {
         htmlAttrs: {
            lang: 'ru'
         },
         link: [
            {
               rel: 'icon',
               type: 'image/png',
               href: '/favicons/favicon-96x96.png',
               sizes: '96x96'
            },
            {
               rel: 'icon',
               type: 'image/svg+xml',
               href: '/favicons/favicon.svg'
            },
            { rel: 'shortcut icon', href: '/favicons/favicon.ico' },
            {
               rel: 'apple-touch-icon',
               sizes: '180x180',
               href: '/favicons/apple-touch-icon.png'
            }
         ],
         title: 'Aligo Admin',
         meta: [
            {
               name: 'viewport',
               content: 'width=device-width, initial-scale=1.0'
            },
            { name: 'apple-mobile-web-app-title', content: 'Aligo Admin' },
            {
               name: 'description',
               content: 'Статическая админка для пользователей и объявлений.'
            },
            {
               name: 'keywords',
               content: 'Aligo, admin, users, ads'
            },
            { property: 'og:title', content: 'Aligo Admin' },
            {
               property: 'og:description',
               content: 'Статическая админка для пользователей и объявлений.'
            },
            {
               property: 'og:image',
               content: '/favicons/web-app-manifest-512x512.png'
            },
            { property: 'og:type', content: 'website' },
            { property: 'og:locale', content: 'ru_RU' },
            { name: 'twitter:card', content: 'summary_large_image' },
            {
               name: 'twitter:image',
               content: '/favicons/web-app-manifest-512x512.png'
            }
         ]
      }
   },

   experimental: {
      payloadExtraction: false,
      appManifest: false
   },

   runtimeConfig: {
      apiToken: process.env.API_TOKEN,
      yandexApiKey: process.env.YANDEX_API_KEY,

      public: {
         apiBaseUrl: process.env.API_BASE_URL,
         yandexApiKey: process.env.YANDEX_API_KEY
      }
   },

   modules: [
      'nuxt-swiper',
      '@pinia/nuxt',
      'nuxt-rating',
      '@nuxt/image',
      '@sentry/nuxt'
   ],

   css: ['~/assets/scss/main.scss', '~/assets/scss/_reset.scss'],

   vite: {
      css: {
         preprocessorOptions: {
            scss: {
               additionalData: '@use "~/assets/scss/_vars.scss" as *;'
            }
         }
      },
      build: {
         cssCodeSplit: true,
         chunkSizeWarningLimit: 1000,
         rollupOptions: {
            output: {
               manualChunks: {
                  'vue-vendor': ['vue', 'vue-router'],
                  'ui-vendor': ['nuxt-swiper', 'nuxt-rating'],
                  'utils-vendor': ['lodash-es', 'date-fns', 'axios'],
                  'chart-vendor': ['chart.js', 'html2canvas', 'jspdf']
               }
            }
         }
      }
   },

   devServer: {
      port: 4000
   },

   nitro: {
      preset: 'static'
   }
})
