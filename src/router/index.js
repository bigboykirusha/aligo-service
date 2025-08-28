import { createRouter, createWebHistory } from 'vue-router';
import { shouldBeLogIn } from '@/router/middlewares/shouldBeLogIn.js';

// реализовать проверку на единичный доступ на странице с изменением данных
// import shouldBeAuthenticated from '@/router/middlewares/shouldBeAuthenticated.js';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/UsersPage.vue'),
    beforeEnter: shouldBeLogIn,
  },
  {
    path: '/authorization/',
    name: 'authorization',
    component: () => import('../views/AuthorizationPage.vue'),
  },
  {
    path: '/users/',
    name: 'users',
    component: () => import('../views/UsersPage.vue'),
    beforeEnter: shouldBeLogIn,
  },

  {
    path: '/createad/:id/',
    name: 'create-ad',
    component: () => import('../views/CreateNewAd.vue'),
    beforeEnter: shouldBeLogIn,
  },

  {
    path: '/create-profile/',
    name: 'create-profile',
    component: () => import('../views/CreateProfilePage.vue'),
    beforeEnter: shouldBeLogIn,
  },
  {
    path: '/user/:id/',
    name: 'UserPage',
    component: () => import('../views/user/UserPage.vue'),
    beforeEnter: shouldBeLogIn,
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'errore',
    component: () => import('../views/ErrorPage.vue'),
  },
];
// beforeEach c данной функцией мы кастомно прописали route код ниже не актуален
// пока есть кастомный роут

const basePath = process.env.NODE_ENV === 'production' ? '/nexuilezt/' : '/';

const router = createRouter({
  history: createWebHistory(basePath),
  routes,
});

// проверка route
router.beforeEach((to, from, next) => {
  const routes = router.getRoutes();

  const normalizePath = (path) => (path.endsWith('/') ? path : path + '/');
  const toPath = normalizePath(to.path);

  const matchedRoute = routes.find((route) => {
    const routePath = normalizePath(route.path);

    if (route.path.includes(':')) {
      const regexPattern = routePath
        .replace(/\/:[^/]+/g, '/[^/]+')
        .replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(toPath);
    }

    return routePath === toPath;
  });

  if (!matchedRoute) {
    return next({ name: 'errore' });
  }

  if (!to.path.endsWith('/') && to.path !== '/') {
    return next({ name: 'users' });
    // правило дописывающее роуте /
    // return next({
    //   path: to.path + '/',
    //   query: to.query,
    //   hash: to.hash,
    //   replace: true,
    // });
  }

  return next();
});

export default router;
