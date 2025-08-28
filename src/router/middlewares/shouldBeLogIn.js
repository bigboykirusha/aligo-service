import { useCookie } from '@/composables/useCookie';
import { ROLE_ROUTES, ROLES } from './roles';

export function shouldBeLogIn(to, from, next) {
  const { getCookie } = useCookie('userData');
  const userDataCookie = getCookie();
  console.log('userDataCookie:', userDataCookie);

  if (!userDataCookie) {
    console.log('Куки userData нет, редиректим');
    return redirectToAuth(to, next);
  }

  let userData = null;

  if (typeof userDataCookie === 'string') {
    try {
      userData = JSON.parse(userDataCookie);
    } catch (error) {
      console.error('Ошибка при парсинге userData куки:', error);
      return redirectToAuth(to, next);
    }
  } else {
    userData = userDataCookie;
  }

  console.log('Распарсенный userData:', userData);

  if (!userData || !userData.token) {
    console.log('Нет токена в userData, редиректим');
    return redirectToAuth(to, next);
  }

  const mockUserRole = ROLES.SUPERADMIN; // Моковые данные для роли пользователя

  if (mockUserRole === ROLES.SUPERADMIN) {
    console.log('Роль SUPERADMIN, доступ ко всем маршрутам разрешен');
    if (to.path === '/') {
      const firstAvailableRoute = getFirstAvailableRoute(ROLES.ADMIN);
      return next(firstAvailableRoute);
    }
    return next();
  }

  // Проверяем доступ для других ролей
  if (!checkUserRole(to, mockUserRole)) {
    console.log('Нет доступа по роли, редиректим');
    return next('/unauthorized');
  }

  console.log('Авторизация и проверка роли пройдены, пропускаем');

  if (to.path === '/') {
    const firstAvailableRoute = getFirstAvailableRoute(mockUserRole);
    return next(firstAvailableRoute);
  }

  return next();
}

function checkUserRole(to, userRole) {
  if (!ROLE_ROUTES[userRole]) {
    return false;
  }

  return ROLE_ROUTES[userRole].includes(to.path);
}

function getFirstAvailableRoute(userRole) {
  if (!ROLE_ROUTES[userRole]) {
    console.error(`Роль ${userRole} не найдена в ROLE_ROUTES`);
    return '/unauthorize/';
  }

  return ROLE_ROUTES[userRole][0];
}

function redirectToAuth(to, next) {
  const redirectUrl = `/authorization/?redirect=${encodeURIComponent(
    to.fullPath
  )}`;
  console.log('Редирект на:', redirectUrl);
  return next(redirectUrl);
}
