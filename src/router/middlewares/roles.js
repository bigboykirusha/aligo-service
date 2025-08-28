export const ROLES = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};
// данные моковые
export const ROLE_ROUTES = {
  [ROLES.GUEST]: ['/users'],
  [ROLES.USER]: ['/seo/sitemap', '/seo/filters'],
  [ROLES.ADMIN]: ['/users', '/admin'],
};

// где 1 это чтение данных 2 это редактирование существубщих
//  3 это добавление новых и редактирование старых а 4 это весь функционал и удаление
// export const ROLE_ROUTES = {
//   [ROLES.GUEST]: {
//     routes: [я
//       { path: '/users', access: 1 }
//     ]
//   },
//   [ROLES.USER]: {
//     routes: [
//       { path: '/seo/sitemap', access: 2 },
//       { path: '/seo/filters', access: 3 }
//     ]
//   },
//   [ROLES.ADMIN]: {
//     routes: [
//       { path: '/users', access: 4 },
//       { path: '/admin', access: 5 }
//     ]
//   },
//   [ROLES.SUPERADMIN]: {
//     routes: [
//       { path: '/users', access: 6 },
//       { path: '/admin', access: 7 },
//       { path: '/superadmin', access: 8 }
//     ]
//   }
// };
