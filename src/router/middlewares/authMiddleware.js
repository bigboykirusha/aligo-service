import { ROLE_ROUTES } from './roles';

export default function authMiddleware(to, from, next, userRole) {
  if (ROLE_ROUTES[userRole].includes(to.path)) {
    next();
  } else {
    next('/users');
  }
}
